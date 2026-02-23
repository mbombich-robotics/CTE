/*
 * Obstacle Avoidance Starter Code
 * Unit 5 — Week 5 Scanning Practical
 *
 * This file contains three strategy implementations to choose from.
 * Read each one, pick the approach that makes sense for your robot,
 * and tune the thresholds for your specific hardware.
 *
 * Hardware:
 *   Servo:            Pin 4
 *   Ultrasonic TRIG:  Pin 2
 *   Ultrasonic ECHO:  Pin 3
 *   Left motor:       Pins 5 (speed PWM) + 6 (direction)
 *   Right motor:      Pins 9 (speed PWM) + 10 (direction)
 *   (Adjust motor pins to match your robot's wiring)
 */

#include <Servo.h>

// ─────────────────────────────────────────────
//  PIN DEFINITIONS — adjust to match your robot
// ─────────────────────────────────────────────
const int SERVO_PIN  = 4;
const int TRIG_PIN   = 2;
const int ECHO_PIN   = 3;

// Motor pins (example — change if yours differ)
const int LEFT_SPEED  = 5;
const int LEFT_DIR    = 6;
const int RIGHT_SPEED = 9;
const int RIGHT_DIR   = 10;

// ─────────────────────────────────────────────
//  TUNING CONSTANTS — start here, adjust to fit
// ─────────────────────────────────────────────
const int DANGER_DIST   = 20;   // cm — stop & turn if nearest obstacle is closer than this
const int CAUTION_DIST  = 35;   // cm — begin scanning when something is this close ahead
const int DRIVE_SPEED   = 180;  // 0–255, motor drive speed
const int TURN_SPEED    = 150;  // 0–255, turning speed
const int SCAN_STEP     = 10;   // degrees between scan readings (smaller = more precise, slower)
const int SERVO_DELAY   = 40;   // ms to wait after each servo move

// ─────────────────────────────────────────────
//  STRATEGY SELECTION
//  Uncomment exactly ONE of the three below
// ─────────────────────────────────────────────
#define STRATEGY_STOP_AND_SCAN    // Full 180° sweep → find clearest path → turn & go
// #define STRATEGY_REACTIVE      // React when obstacle gets within DANGER_DIST of center
// #define STRATEGY_WEIGHTED      // Steer proportionally based on left vs right clearance

// ─────────────────────────────────────────────
//  GLOBALS
// ─────────────────────────────────────────────
Servo scanServo;

const int NUM_READINGS = (180 / SCAN_STEP) + 1;  // 19 readings at 10° step
int distances[19];   // fixed size for safety — handles up to 10° step


// ─────────────────────────────────────────────
//  SETUP
// ─────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  scanServo.attach(SERVO_PIN);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  // Motor pins as output
  pinMode(LEFT_SPEED,  OUTPUT);
  pinMode(LEFT_DIR,    OUTPUT);
  pinMode(RIGHT_SPEED, OUTPUT);
  pinMode(RIGHT_DIR,   OUTPUT);

  stopMotors();
  scanServo.write(90);   // center
  delay(500);

  Serial.println("=== Obstacle Avoidance Ready ===");
  #ifdef STRATEGY_STOP_AND_SCAN
    Serial.println("Strategy: Stop-and-Scan");
  #endif
  #ifdef STRATEGY_REACTIVE
    Serial.println("Strategy: Reactive / Threshold");
  #endif
  #ifdef STRATEGY_WEIGHTED
    Serial.println("Strategy: Weighted Steering");
  #endif
}


// ─────────────────────────────────────────────
//  MAIN LOOP — dispatches to chosen strategy
// ─────────────────────────────────────────────
void loop() {

  #ifdef STRATEGY_STOP_AND_SCAN
    loopStopAndScan();
  #endif

  #ifdef STRATEGY_REACTIVE
    loopReactive();
  #endif

  #ifdef STRATEGY_WEIGHTED
    loopWeighted();
  #endif
}


// ══════════════════════════════════════════════
//  STRATEGY 1: STOP-AND-SCAN
//  - Drive forward
//  - When center reading drops below CAUTION_DIST, stop & scan
//  - Turn toward the direction with the most clearance
// ══════════════════════════════════════════════
void loopStopAndScan() {
  // Quick center-only check while driving
  scanServo.write(90);
  delay(SERVO_DELAY);
  long centerDist = getDistance();

  if (centerDist > CAUTION_DIST || centerDist == 0) {
    // Path clear — drive forward
    driveForward(DRIVE_SPEED);
    return;
  }

  // Obstacle ahead — stop and do a full scan
  stopMotors();
  delay(200);

  performFullScan();
  printScanData();

  int nearestDist, nearestAngle, clearestDist, clearestAngle;
  findNearest(&nearestDist, &nearestAngle);
  findClearest(&clearestDist, &clearestAngle);

  Serial.print("Nearest: ");  Serial.print(nearestDist);  Serial.print("cm at "); Serial.print(nearestAngle);  Serial.println("°");
  Serial.print("Clearest: "); Serial.print(clearestDist); Serial.print("cm at "); Serial.print(clearestAngle); Serial.println("°");

  // Decide and act
  if (clearestDist < DANGER_DIST) {
    // Boxed in — back up first
    Serial.println("Decision: REVERSE");
    driveBackward(DRIVE_SPEED);
    delay(600);
    stopMotors();
    delay(300);
  } else if (clearestAngle < 80) {
    Serial.println("Decision: TURN RIGHT");
    turnRight(TURN_SPEED);
    delay(500);
    stopMotors();
  } else if (clearestAngle > 100) {
    Serial.println("Decision: TURN LEFT");
    turnLeft(TURN_SPEED);
    delay(500);
    stopMotors();
  } else {
    Serial.println("Decision: GO FORWARD (center clear)");
    driveForward(DRIVE_SPEED);
  }

  Serial.println("───────────────────");
  scanServo.write(90);  // return servo to center
  delay(300);
}


// ══════════════════════════════════════════════
//  STRATEGY 2: REACTIVE / THRESHOLD
//  - Drive forward, servo stays centered
//  - The instant the forward distance drops below DANGER_DIST, react
//  - Quick left/right check to pick a direction
// ══════════════════════════════════════════════
void loopReactive() {
  scanServo.write(90);
  delay(SERVO_DELAY);
  long forwardDist = getDistance();

  Serial.print("Forward: ");
  Serial.print(forwardDist);
  Serial.println(" cm");

  if (forwardDist > DANGER_DIST && forwardDist > 0) {
    // Clear ahead — keep going
    driveForward(DRIVE_SPEED);
    delay(50);
    return;
  }

  // Obstacle! Stop and do a quick 3-point check (left / center / right)
  stopMotors();
  delay(150);

  scanServo.write(30);   delay(SERVO_DELAY * 2);
  long rightDist = getDistance();   // servo at 30° ≈ robot's right side

  scanServo.write(150);  delay(SERVO_DELAY * 2);
  long leftDist = getDistance();    // servo at 150° ≈ robot's left side

  scanServo.write(90);   delay(SERVO_DELAY);

  Serial.print("Right(30°): ");  Serial.print(rightDist);  Serial.print("  Left(150°): "); Serial.println(leftDist);

  if (rightDist > leftDist) {
    Serial.println("Decision: TURN RIGHT");
    turnRight(TURN_SPEED);
    delay(450);
  } else {
    Serial.println("Decision: TURN LEFT");
    turnLeft(TURN_SPEED);
    delay(450);
  }

  stopMotors();
  Serial.println("───────────────────");
  delay(100);
}


// ══════════════════════════════════════════════
//  STRATEGY 3: WEIGHTED STEERING
//  - Continuously scan left half and right half
//  - Calculate a steering bias based on the difference
//  - The larger the difference, the sharper the correction
// ══════════════════════════════════════════════
void loopWeighted() {
  // Sample three zones: left (135°), center (90°), right (45°)
  scanServo.write(135); delay(SERVO_DELAY * 2);
  long leftDist = getDistance();

  scanServo.write(90);  delay(SERVO_DELAY);
  long centerDist = getDistance();

  scanServo.write(45);  delay(SERVO_DELAY * 2);
  long rightDist = getDistance();

  Serial.print("L:");   Serial.print(leftDist);
  Serial.print(" C:");  Serial.print(centerDist);
  Serial.print(" R:");  Serial.println(rightDist);

  // Cap readings at a max range for math stability
  leftDist   = constrain(leftDist,   0, 150);
  rightDist  = constrain(rightDist,  0, 150);
  centerDist = constrain(centerDist, 0, 150);

  if (centerDist > 0 && centerDist < DANGER_DIST) {
    // Too close — stop and turn toward the more open side
    stopMotors();
    if (leftDist >= rightDist) {
      Serial.println("Decision: HARD LEFT");
      turnLeft(TURN_SPEED);
    } else {
      Serial.println("Decision: HARD RIGHT");
      turnRight(TURN_SPEED);
    }
    delay(400);
    stopMotors();
    return;
  }

  // Compute steering bias: positive = turn left, negative = turn right
  int bias = (int)(leftDist - rightDist);   // e.g. +60 means left is much clearer

  // Scale the bias into a speed difference
  // Clamp bias so it doesn't exceed the max motor speed
  int steerAmount = constrain(abs(bias) / 3, 0, 80);

  int leftSpeed  = DRIVE_SPEED;
  int rightSpeed = DRIVE_SPEED;

  if (bias > 15) {
    // Left is much clearer — steer gently left
    rightSpeed += steerAmount;  // speed up right wheel = turn left
    Serial.print("Steering LEFT  bias="); Serial.println(bias);
  } else if (bias < -15) {
    // Right is much clearer — steer gently right
    leftSpeed += steerAmount;   // speed up left wheel = turn right
    Serial.print("Steering RIGHT bias="); Serial.println(bias);
  } else {
    Serial.println("Straight");
  }

  leftSpeed  = constrain(leftSpeed,  0, 255);
  rightSpeed = constrain(rightSpeed, 0, 255);

  setMotors(leftSpeed, rightSpeed);
  delay(80);
}


// ─────────────────────────────────────────────
//  SENSOR UTILITIES
// ─────────────────────────────────────────────

// Single ultrasonic distance reading (returns 0 on timeout)
long getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);  // 30ms timeout ≈ 500cm
  if (duration == 0) return 0;
  return duration / 58;  // convert to cm
}

// Full 180° sweep, fills distances[] array
void performFullScan() {
  int index = 0;
  for (int angle = 0; angle <= 180; angle += SCAN_STEP) {
    scanServo.write(angle);
    delay(SERVO_DELAY);
    if (index < NUM_READINGS) {
      distances[index] = getDistance();
    }
    index++;
  }
}

// Print all scan readings to Serial
void printScanData() {
  Serial.println("Scan Data:");
  for (int i = 0; i < NUM_READINGS; i++) {
    int angle = i * SCAN_STEP;
    Serial.print("  ");
    Serial.print(angle);
    Serial.print("°: ");
    Serial.print(distances[i]);
    Serial.print("cm");
    if ((i + 1) % 5 == 0) Serial.println();
    else Serial.print("  ");
  }
  Serial.println();
}

// Find the nearest obstacle (minimum non-zero distance)
void findNearest(int* minDist, int* minAngle) {
  *minDist = 9999;
  int minIndex = 0;
  for (int i = 0; i < NUM_READINGS; i++) {
    if (distances[i] > 0 && distances[i] < *minDist) {
      *minDist = distances[i];
      minIndex = i;
    }
  }
  if (*minDist == 9999) *minDist = 0;  // no valid reading
  *minAngle = minIndex * SCAN_STEP;
}

// Find the clearest path (maximum distance)
void findClearest(int* maxDist, int* maxAngle) {
  *maxDist = 0;
  int maxIndex = 0;
  for (int i = 0; i < NUM_READINGS; i++) {
    if (distances[i] > *maxDist) {
      *maxDist = distances[i];
      maxIndex = i;
    }
  }
  *maxAngle = maxIndex * SCAN_STEP;
}


// ─────────────────────────────────────────────
//  MOTOR UTILITIES
//  These assume a simple motor driver (e.g. L298N or L9110).
//  Adjust the HIGH/LOW logic if your motors spin the wrong way.
// ─────────────────────────────────────────────

void stopMotors() {
  analogWrite(LEFT_SPEED,  0);
  analogWrite(RIGHT_SPEED, 0);
}

void driveForward(int speed) {
  digitalWrite(LEFT_DIR,  HIGH);
  digitalWrite(RIGHT_DIR, HIGH);
  analogWrite(LEFT_SPEED,  speed);
  analogWrite(RIGHT_SPEED, speed);
}

void driveBackward(int speed) {
  digitalWrite(LEFT_DIR,  LOW);
  digitalWrite(RIGHT_DIR, LOW);
  analogWrite(LEFT_SPEED,  speed);
  analogWrite(RIGHT_SPEED, speed);
}

void turnLeft(int speed) {
  // Spin left wheel backward, right wheel forward
  digitalWrite(LEFT_DIR,  LOW);
  digitalWrite(RIGHT_DIR, HIGH);
  analogWrite(LEFT_SPEED,  speed);
  analogWrite(RIGHT_SPEED, speed);
}

void turnRight(int speed) {
  // Spin right wheel backward, left wheel forward
  digitalWrite(LEFT_DIR,  HIGH);
  digitalWrite(RIGHT_DIR, LOW);
  analogWrite(LEFT_SPEED,  speed);
  analogWrite(RIGHT_SPEED, speed);
}

// Weighted steering — set each motor independently
void setMotors(int leftSpeed, int rightSpeed) {
  digitalWrite(LEFT_DIR,  HIGH);
  digitalWrite(RIGHT_DIR, HIGH);
  analogWrite(LEFT_SPEED,  leftSpeed);
  analogWrite(RIGHT_SPEED, rightSpeed);
}
