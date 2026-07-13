// *************************************************************************************
// *******   Day 75: Single Motor Control                                       *******
// *******   VHS Robotics Class - Arduino Programming                            *******
// *************************************************************************************
// *******   Learning Objectives:                                                *******
// *******   - Understand motor driver operation (direction + PWM)               *******
// *******   - Control motor direction using digital pins                        *******
// *******   - Control motor speed using analogWrite() PWM                       *******
// *******   - Practice smooth acceleration and deceleration                     *******
// *************************************************************************************

// ===================================================================================
// HARDWARE SETUP - VNH5019 Motor Driver
// ===================================================================================
// The VNH5019 motor driver uses 3 pins to control one motor:
//   INA & INB: Direction control pins (digital outputs)
//   PWM:       Speed control pin (PWM output, 0-255)
//
// Direction Truth Table:
//   INA=LOW,  INB=HIGH  →  Motor spins FORWARD
//   INA=HIGH, INB=LOW   →  Motor spins REVERSE
//   INA=LOW,  INB=LOW   →  Motor BRAKE (active stop)
//   INA=HIGH, INB=HIGH  →  Motor BRAKE (active stop)
// ===================================================================================

// Motor driver pin definitions
const int MOTOR_INA = 6;      // Direction control A
const int MOTOR_INB = 4;      // Direction control B
const int MOTOR_PWM = 3;      // PWM speed control (must be PWM-capable pin)

// PWM Settings
const int MIN_SPEED = 0;      // Minimum PWM value (motor stopped)
const int MAX_SPEED = 255;    // Maximum PWM value (full speed)

// Global variable to track current motor speed
int currentSpeed = 0;

// ===================================================================================
// SETUP - Runs once when Arduino powers on or resets
// ===================================================================================
void setup() {
  // Initialize Serial Monitor for debugging
  Serial.begin(9600);
  Serial.println("=================================");
  Serial.println("Day 75: Single Motor Control");
  Serial.println("=================================");

  // Configure motor driver pins as outputs
  pinMode(MOTOR_INA, OUTPUT);
  pinMode(MOTOR_INB, OUTPUT);
  pinMode(MOTOR_PWM, OUTPUT);

  // Safety: Ensure motor is stopped at startup
  stopMotor();

  Serial.println("Motor driver initialized");
  Serial.println("Starting demonstration in 2 seconds...");
  delay(2000);
}

// ===================================================================================
// LOOP - Runs continuously
// ===================================================================================
void loop() {
  // Demonstration sequence - students will modify this for their challenges

  Serial.println("\n--- Forward Acceleration Test ---");
  driveForward(100);    // Drive forward at medium speed
  delay(2000);          // Run for 2 seconds

  Serial.println("\n--- Increase Speed ---");
  driveForward(200);    // Increase to higher speed
  delay(2000);

  Serial.println("\n--- Full Speed ---");
  driveForward(255);    // Maximum speed
  delay(2000);

  Serial.println("\n--- Stopping ---");
  stopMotor();          // Stop the motor
  delay(2000);

  Serial.println("\n--- Reverse Test ---");
  driveReverse(150);    // Drive reverse at medium speed
  delay(2000);

  Serial.println("\n--- Stopping ---");
  stopMotor();
  delay(3000);          // Wait before repeating
}

// ===================================================================================
// MOTOR CONTROL FUNCTIONS
// ===================================================================================

/**
 * Drive motor forward at specified speed
 * @param speed PWM value (0-255), where 0=stopped, 255=full speed
 */
void driveForward(int speed) {
  // Constrain speed to valid range
  speed = constrain(speed, MIN_SPEED, MAX_SPEED);

  // Set direction: INA=LOW, INB=HIGH for forward
  digitalWrite(MOTOR_INA, LOW);
  digitalWrite(MOTOR_INB, HIGH);

  // Set speed using PWM
  analogWrite(MOTOR_PWM, speed);

  // Update global tracking variable
  currentSpeed = speed;

  // Debug output
  Serial.print("Motor FORWARD at speed: ");
  Serial.println(speed);
}

/**
 * Drive motor in reverse at specified speed
 * @param speed PWM value (0-255), where 0=stopped, 255=full speed
 */
void driveReverse(int speed) {
  // Constrain speed to valid range
  speed = constrain(speed, MIN_SPEED, MAX_SPEED);

  // Set direction: INA=HIGH, INB=LOW for reverse
  digitalWrite(MOTOR_INA, HIGH);
  digitalWrite(MOTOR_INB, LOW);

  // Set speed using PWM
  analogWrite(MOTOR_PWM, speed);

  // Update global tracking variable
  currentSpeed = -speed;  // Negative indicates reverse

  // Debug output
  Serial.print("Motor REVERSE at speed: ");
  Serial.println(speed);
}

/**
 * Stop the motor using active brake
 * (Both direction pins LOW creates braking effect)
 */
void stopMotor() {
  // Set both direction pins LOW for active brake
  digitalWrite(MOTOR_INA, LOW);
  digitalWrite(MOTOR_INB, LOW);

  // Set PWM to 0
  analogWrite(MOTOR_PWM, 0);

  // Update tracking variable
  currentSpeed = 0;

  // Debug output
  Serial.println("Motor STOPPED (brake)");
}

/**
 * Coast the motor to a stop (no braking)
 * (Both direction pins HIGH or PWM=0 allows coasting)
 */
void coastMotor() {
  // Set PWM to 0 but leave direction unchanged
  analogWrite(MOTOR_PWM, 0);

  // Update tracking variable
  currentSpeed = 0;

  // Debug output
  Serial.println("Motor COASTING to stop");
}

// ===================================================================================
// CHALLENGE FUNCTIONS - Students will complete these!
// ===================================================================================

/**
 * CHALLENGE 1: Smooth Acceleration
 * Gradually increase speed from current speed to target speed
 *
 * TODO: Students write this function
 * Hints:
 *  - Use a for loop to step from currentSpeed to targetSpeed
 *  - Add small delay between steps (10-50ms)
 *  - Use driveForward() or driveReverse() based on direction
 *
 * @param targetSpeed Final speed to reach (-255 to +255)
 *                    Positive = forward, Negative = reverse
 */
void smoothAccelerate(int targetSpeed) {
  // TODO: Student code here

  // Example structure (students fill in details):
  // if (targetSpeed > currentSpeed) {
  //   for (int speed = currentSpeed; speed <= targetSpeed; speed += 5) {
  //     driveForward(speed);
  //     delay(20);
  //   }
  // }
}

/**
 * CHALLENGE 2: Timed Drive
 * Drive at specified speed for specified duration
 *
 * TODO: Students write this function
 * Hints:
 *  - Use millis() for non-blocking timing
 *  - Check if duration has elapsed
 *  - Stop motor when time is up
 *
 * @param speed Motor speed (-255 to +255)
 * @param durationMs Time to drive in milliseconds
 */
void timedDrive(int speed, unsigned long durationMs) {
  // TODO: Student code here

  // Example structure:
  // unsigned long startTime = millis();
  //
  // if (speed >= 0) {
  //   driveForward(speed);
  // } else {
  //   driveReverse(abs(speed));
  // }
  //
  // while (millis() - startTime < durationMs) {
  //   // Wait for duration to complete
  // }
  //
  // stopMotor();
}

/**
 * CHALLENGE 3: Speed Ramping
 * Create a "breathing" motor effect - ramp up then ramp down
 *
 * TODO: Students write this function
 * Hints:
 *  - Ramp from 0 to maxSpeed
 *  - Then ramp from maxSpeed back to 0
 *  - Use delay between steps for smooth effect
 *
 * @param maxSpeed Maximum speed to reach
 * @param stepDelay Delay between speed changes (ms)
 */
void breathingPattern(int maxSpeed, int stepDelay) {
  // TODO: Student code here
}

// ===================================================================================
// EXTENSION CHALLENGES (Advanced Students)
// ===================================================================================

/**
 * EXTENSION 1: Motor Test Sequence
 * Run through complete motor test:
 *  1. Slow forward
 *  2. Medium forward
 *  3. Fast forward
 *  4. Smooth deceleration
 *  5. Pause
 *  6. Slow reverse
 *  7. Smooth stop
 *
 * Use your smoothAccelerate() function for transitions!
 */
void motorTestSequence() {
  // TODO: Student code here
}

/**
 * EXTENSION 2: Read Motor Current (if current sense available)
 * VNH5019 has current sense output: approximately 140 mV/A
 *
 * @param csPin Analog pin connected to CS (current sense) output
 * @return Estimated motor current in Amps
 */
float readMotorCurrent(int csPin) {
  // TODO: Student code here
  // Hints:
  //  - Use analogRead() to get raw value
  //  - Convert to voltage: (raw * 3.3) / 1023.0
  //  - Convert to amps: voltage / 0.140

  return 0.0;  // Placeholder
}
