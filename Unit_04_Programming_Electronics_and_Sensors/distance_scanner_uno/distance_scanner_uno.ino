// *************************************************************************************
// *******                                                                       *******
// *******                       Distance Scanner (Uno)                          *******
// *******   Arduino Uno compatible port of the RP2040 distance_scanner sketch   *******
// *******   Programmer: T Puvogel (with the assistance from Claude)             *******
// *******   Original Date: Feb. 24, 2026    Uno port: Feb. 25, 2026            *******
// *******                                                                       *******
// *******   Key differences from RP2040 version:                                *******
// *******     - Servo.h replaces raw RP2040 hardware PWM (timer_cntl.ino)      *******
// *******     - Echo pin must be 2 or 3 (Uno interrupt-capable pins only)      *******
// *******     - INPUT_PULLDOWN not supported on Uno; use INPUT                 *******
// *******     - WiFiNINA and A4 workaround removed                             *******
// *******                                                                       *******
// *************************************************************************************
// *******         Release: 1.1 (Uno port)                                       *******
// *******         Date: 02-25-2026                                              *******
// *************************************************************************************

#include <Servo.h>
#include <stdlib.h>
#include <Arduino.h>

// ─── Hardware Pin Assignments ───────────────────────────────────────────────
// Servo.h on Uno disables PWM on pins 9 and 10 while servos are attached.
// That's fine here since we're not using motor PWM on those pins.
#define ULTRA_SONIC_SERVO  9    // Scanning servo (PWM pin)
#define GRIPPER_SERVO     10    // Gripper servo  (PWM pin)
#define USONIC_TRIGGER     4    // Ultrasonic trigger output (any digital pin)
#define USONIC_ECHO        3    // Ultrasonic echo input — MUST be pin 2 or 3 on Uno

// ─── Ultrasonic State Machine ────────────────────────────────────────────────
// Shared with ultra_sonic_support.ino
volatile uint32_t usonic_tmr_req_time_ms = 0;
volatile uint32_t usonic_echo_start_us   = 0;
volatile uint32_t usonic_echo_stop_us    = 0;
#define USONIC_STATE_IDLE      0
#define USONIC_STATE_TRIGGERED 1
#define USONIC_STATE_ECHO_HIGH 2
#define USONIC_STATE_ECHO_LOW  3
#define CM_PER_US 0.01715   // round-trip: usec → cm
int usonic_state = USONIC_STATE_IDLE;

// ─── Servo Objects ────────────────────────────────────────────────────────────
Servo scanServo;
Servo gripperServo;

// ─── Sweep Parameters ────────────────────────────────────────────────────────
// Adjust these to change sweep behavior.
// With defaults: sweeps 0°→180° in 1° steps, 30ms per step (~5.4 sec total).
#define CHANGE_ANGLE_DELAY_MS  30    // ms to wait after each angle step
#define SWEEP_RETURN_DELAY_MS 500    // ms to wait after returning to start
#define STARTING_ANGLE          0    // angle to begin sweep (0–180)
#define ANGLE_INCREMENT         1    // degrees per step
#define ANGLE_STEPS           180    // total steps (STARTING_ANGLE + ANGLE_STEPS * ANGLE_INCREMENT ≤ 180)

// ─── Scan Mode State ──────────────────────────────────────────────────────────
// Toggled via serial: type "scan" to sweep, type an angle to stop.
bool scanMode = false;
int currentSweepAngle = STARTING_ANGLE;


void setup() {
  Serial.begin(115200);
  while (!Serial && millis() < 3000);
  Serial.println("Ultrasonic Sensor and Servo Demo - Arduino Uno");
  Serial.println("------------------------------------------------");
  Serial.println("Commands: type an angle (0-180) to move, or \"scan\" to sweep.");

  scanServo.attach(ULTRA_SONIC_SERVO);
  gripperServo.attach(GRIPPER_SERVO);

  pinMode(USONIC_TRIGGER, OUTPUT);
  digitalWrite(USONIC_TRIGGER, LOW);
  pinMode(USONIC_ECHO, INPUT);   // INPUT_PULLDOWN not available on Uno
  attachInterrupt(digitalPinToInterrupt(USONIC_ECHO), usonic_echo_ISR, CHANGE);

  scanServo.write(90);    // center the scanning servo
  delay(500);
}

void loop() {
  checkSerial();   // process any incoming serial input (see serial_cntl.ino)

  if (scanMode) {
    setServoAngle(currentSweepAngle);
    delay(CHANGE_ANGLE_DELAY_MS);

    // Optional: trigger a reading at each step and print it
    // usonic_start_measurement();
    // delay(25);
    // float dist = usonic_reading();
    // Serial.print(currentSweepAngle); Serial.print("°: ");
    // Serial.print(dist, 1); Serial.println(" cm");

    currentSweepAngle += ANGLE_INCREMENT;
    if (currentSweepAngle > STARTING_ANGLE + ANGLE_STEPS) {
      currentSweepAngle = STARTING_ANGLE;
      delay(SWEEP_RETURN_DELAY_MS);
    }
  }
}
