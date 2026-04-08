// *************************************************************************************
// *  VHS Robotics — Master Codebase for Arduino Nano RP2040 Connect
// *
// *  This file is the authoritative pin map and function library for the class robot.
// *  Lesson starter code should copy what it needs from here.
// *
// *  Board: Arduino Nano RP2040 Connect
// *  Motor driver: L298N-style (INA/INB direction + PWM speed)
// *  PWM range: 0–255 (8-bit, default Arduino resolution)
// *
// *  Revision history:
// *    v1.0  2026-04-01  Initial master codebase with encoder straight drive
// *************************************************************************************

#include <Servo.h>
#include <Arduino.h>

// WiFiNINA redefines A4 as a NinaPin type — undefine it so we can use A4 as a plain int
#undef A4
#define A4 18   // physical pin 18 = Arduino analog label A4

// ─────────────────────────────────────────────────────────────
//  PIN MAP  (do not change unless robot is physically rewired)
// ─────────────────────────────────────────────────────────────

// Right motor
const uint8_t MTR_R_INA    = 6;   // direction pin A
const uint8_t MTR_R_INB    = 4;   // direction pin B
const uint8_t MTR_R_PWM    = 3;   // speed (PWM-capable pin)
const uint8_t MTR_R_QUAD_A = 9;   // encoder channel A, blue wire (interrupt-capable)
const uint8_t MTR_R_QUAD_B = 10;  // encoder channel B, white wire

// Left motor
const uint8_t MTR_L_INA    = 8;   // direction pin A
const uint8_t MTR_L_INB    = 7;   // direction pin B
const uint8_t MTR_L_PWM    = 5;   // speed (PWM-capable pin)
const uint8_t MTR_L_QUAD_A = 11;  // encoder channel A, blue wire (interrupt-capable)
const uint8_t MTR_L_QUAD_B = 12;  // encoder channel B, white wire

// Ultrasonic sensor
const uint8_t USONIC_TRIG  = 15;
const uint8_t USONIC_ECHO  = 13;

// Servos
const uint8_t SCAN_SERVO_PIN    = A4;  // = 18, ultrasonic scan servo
const uint8_t GRIPPER_SERVO_PIN = 19;  // A5

// IR line sensors (used in line-following lessons)
const uint8_t IR_1 = A2;  // leftmost
const uint8_t IR_2 = 0;
const uint8_t IR_3 = 2;   // center
const uint8_t IR_4 = 1;
const uint8_t IR_5 = A3;  // rightmost  (shares A3 with MTR_R_CS when used)

// Motor current sense (L298N boards with CS output, optional)
const uint8_t MTR_R_CS = A3;
const uint8_t MTR_L_CS = A1;


// ─────────────────────────────────────────────────────────────
//  ENCODER GLOBALS
//  Volatile because they are written inside ISRs.
// ─────────────────────────────────────────────────────────────
volatile long encoderRight = 0;
volatile long encoderLeft  = 0;

void rightEncoderISR() { encoderRight++; }
void leftEncoderISR()  { encoderLeft++;  }


// ─────────────────────────────────────────────────────────────
//  TUNING CONSTANTS  (adjust these for your robot)
// ─────────────────────────────────────────────────────────────
const int  BASE_SPEED    = 150;   // default drive speed (0–255)
const int  TURN_SPEED    = 180;   // turning speed
const long TICKS_PER_CM  = 20;    // encoder ticks per centimeter — MEASURE AND UPDATE
                                   // Measure: mark wheel, count ticks over known distance

// Straight-drive P-controller gain.
// Increase if robot curves; decrease if it oscillates.
const float STRAIGHT_KP  = 2.0;


// ─────────────────────────────────────────────────────────────
//  SETUP
// ─────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  while (!Serial && millis() < 3000);
  Serial.println("VHS Robot Master — RP2040 Connect");

  // Motor direction and PWM pins
  pinMode(MTR_R_INA, OUTPUT);
  pinMode(MTR_R_INB, OUTPUT);
  pinMode(MTR_R_PWM, OUTPUT);
  pinMode(MTR_L_INA, OUTPUT);
  pinMode(MTR_L_INB, OUTPUT);
  pinMode(MTR_L_PWM, OUTPUT);

  // Encoder inputs — RP2040 does not have internal pullups on all pins,
  // so use INPUT_PULLUP if the encoder does not have its own pull-up resistor.
  pinMode(MTR_R_QUAD_A, INPUT_PULLUP);
  pinMode(MTR_R_QUAD_B, INPUT_PULLUP);
  pinMode(MTR_L_QUAD_A, INPUT_PULLUP);
  pinMode(MTR_L_QUAD_B, INPUT_PULLUP);

  // Attach encoder interrupts (trigger on rising edge of channel A)
  attachInterrupt(digitalPinToInterrupt(MTR_R_QUAD_A), rightEncoderISR, RISING);
  attachInterrupt(digitalPinToInterrupt(MTR_L_QUAD_A), leftEncoderISR,  RISING);

  // Ultrasonic sensor
  pinMode(USONIC_TRIG, OUTPUT);
  pinMode(USONIC_ECHO, INPUT);
  digitalWrite(USONIC_TRIG, LOW);

  stopMotors();
  Serial.println("Ready.");
}


// ─────────────────────────────────────────────────────────────
//  EXAMPLE LOOP — replace with your own
// ─────────────────────────────────────────────────────────────
void loop() {
  // Example: drive straight 50 cm, then stop
  driveStraight(BASE_SPEED, 50 * TICKS_PER_CM);
  stopMotors();
  delay(2000);

  // Example: print encoder counts and a distance reading
  Serial.print("L ticks: "); Serial.print(encoderLeft);
  Serial.print("  R ticks: "); Serial.println(encoderRight);
  Serial.print("Distance: "); Serial.print(readDistance()); Serial.println(" cm");

  delay(3000);
}


// ─────────────────────────────────────────────────────────────
//  DRIVE STRAIGHT  (encoder feedback, P-controller)
//
//  Drives forward at 'speed' until either motor accumulates
//  'targetTicks' encoder counts.  A P-controller trims the
//  slower motor up (or the faster one down) to keep both
//  wheels turning at the same rate.
//
//  Usage:
//    driveStraight(150, 30 * TICKS_PER_CM);  // 30 cm forward
// ─────────────────────────────────────────────────────────────
void driveStraight(int speed, long targetTicks) {
  // Reset encoder counts
  noInterrupts();
  encoderLeft  = 0;
  encoderRight = 0;
  interrupts();

  while (true) {
    long L, R;
    noInterrupts();
    L = encoderLeft;
    R = encoderRight;
    interrupts();

    // Stop when either motor has reached the target
    if (L >= targetTicks || R >= targetTicks) break;

    // Error: positive means left is ahead of right
    long error = L - R;

    // Proportional correction: slow the faster side
    int leftSpeed  = constrain(speed - (int)(STRAIGHT_KP * error), 0, 255);
    int rightSpeed = constrain(speed + (int)(STRAIGHT_KP * error), 0, 255);

    setMotorSpeeds(leftSpeed, rightSpeed);
    delay(10);  // short update interval keeps response tight
  }

  stopMotors();
}


// ─────────────────────────────────────────────────────────────
//  MOTOR PRIMITIVES
// ─────────────────────────────────────────────────────────────

// Drive each motor at an independent speed (both forward)
void setMotorSpeeds(int leftSpeed, int rightSpeed) {
  // Left motor — forward
  digitalWrite(MTR_L_INA, LOW);
  digitalWrite(MTR_L_INB, HIGH);
  analogWrite(MTR_L_PWM, constrain(leftSpeed, 0, 255));

  // Right motor — forward
  digitalWrite(MTR_R_INA, LOW);
  digitalWrite(MTR_R_INB, HIGH);
  analogWrite(MTR_R_PWM, constrain(rightSpeed, 0, 255));
}

void driveForward(int speed) {
  setMotorSpeeds(speed, speed);
}

void driveBackward(int speed) {
  digitalWrite(MTR_L_INA, HIGH);
  digitalWrite(MTR_L_INB, LOW);
  analogWrite(MTR_L_PWM, constrain(speed, 0, 255));

  digitalWrite(MTR_R_INA, HIGH);
  digitalWrite(MTR_R_INB, LOW);
  analogWrite(MTR_R_PWM, constrain(speed, 0, 255));
}

// Pivot left: right wheel forward, left wheel backward
void pivotLeft(int speed) {
  digitalWrite(MTR_L_INA, HIGH);
  digitalWrite(MTR_L_INB, LOW);
  analogWrite(MTR_L_PWM, constrain(speed, 0, 255));

  digitalWrite(MTR_R_INA, LOW);
  digitalWrite(MTR_R_INB, HIGH);
  analogWrite(MTR_R_PWM, constrain(speed, 0, 255));
}

// Pivot right: left wheel forward, right wheel backward
void pivotRight(int speed) {
  digitalWrite(MTR_L_INA, LOW);
  digitalWrite(MTR_L_INB, HIGH);
  analogWrite(MTR_L_PWM, constrain(speed, 0, 255));

  digitalWrite(MTR_R_INA, HIGH);
  digitalWrite(MTR_R_INB, LOW);
  analogWrite(MTR_R_PWM, constrain(speed, 0, 255));
}

// Turn left: only right wheel drives (gentle arc)
void turnLeft(int speed) {
  // Stop left wheel
  digitalWrite(MTR_L_INA, LOW);
  digitalWrite(MTR_L_INB, LOW);
  analogWrite(MTR_L_PWM, 0);
  // Drive right wheel
  digitalWrite(MTR_R_INA, LOW);
  digitalWrite(MTR_R_INB, HIGH);
  analogWrite(MTR_R_PWM, constrain(speed, 0, 255));
}

// Turn right: only left wheel drives (gentle arc)
void turnRight(int speed) {
  // Drive left wheel
  digitalWrite(MTR_L_INA, LOW);
  digitalWrite(MTR_L_INB, HIGH);
  analogWrite(MTR_L_PWM, constrain(speed, 0, 255));
  // Stop right wheel
  digitalWrite(MTR_R_INA, LOW);
  digitalWrite(MTR_R_INB, LOW);
  analogWrite(MTR_R_PWM, 0);
}

void stopMotors() {
  digitalWrite(MTR_L_INA, LOW);  digitalWrite(MTR_L_INB, LOW);  analogWrite(MTR_L_PWM, 0);
  digitalWrite(MTR_R_INA, LOW);  digitalWrite(MTR_R_INB, LOW);  analogWrite(MTR_R_PWM, 0);
}


// ─────────────────────────────────────────────────────────────
//  ULTRASONIC DISTANCE  (cm, returns 0 on timeout)
// ─────────────────────────────────────────────────────────────
long readDistance() {
  digitalWrite(USONIC_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(USONIC_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(USONIC_TRIG, LOW);
  long duration = pulseIn(USONIC_ECHO, HIGH, 30000);  // 30 ms timeout ≈ 500 cm
  if (duration == 0) return 0;
  return duration / 58;
}
