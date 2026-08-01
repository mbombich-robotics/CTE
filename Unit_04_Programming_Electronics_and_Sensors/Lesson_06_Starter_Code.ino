// Lesson 6: Basic Robot Motion Control
// Starter Code for Lab Exercises

// Motor pin definitions - 3-pin motor controller (INA, INB, PWM)
const int LEFT_MOTOR_INA  = 8;   // Left Motor Direction A
const int LEFT_MOTOR_INB  = 7;   // Left Motor Direction B
const int LEFT_MOTOR_PWM  = 5;   // Left Motor Speed (PWM)

const int RIGHT_MOTOR_INA = 6;   // Right Motor Direction A
const int RIGHT_MOTOR_INB = 4;   // Right Motor Direction B
const int RIGHT_MOTOR_PWM = 3;   // Right Motor Speed (PWM)

void setup() {
  // Set all motor pins as outputs
  pinMode(LEFT_MOTOR_INA, OUTPUT);
  pinMode(LEFT_MOTOR_INB, OUTPUT);
  pinMode(LEFT_MOTOR_PWM, OUTPUT);

  pinMode(RIGHT_MOTOR_INA, OUTPUT);
  pinMode(RIGHT_MOTOR_INB, OUTPUT);
  pinMode(RIGHT_MOTOR_PWM, OUTPUT);

  // Safe startup: motors off, coast
  digitalWrite(LEFT_MOTOR_INA, LOW);
  digitalWrite(LEFT_MOTOR_INB, LOW);
  analogWrite(LEFT_MOTOR_PWM, 0);
  digitalWrite(RIGHT_MOTOR_INA, LOW);
  digitalWrite(RIGHT_MOTOR_INB, LOW);
  analogWrite(RIGHT_MOTOR_PWM, 0);
}

// ===== MOVEMENT FUNCTIONS =====

void moveForward(int speed) {
  // Left motor forward
  digitalWrite(LEFT_MOTOR_INA, LOW);
  digitalWrite(LEFT_MOTOR_INB, HIGH);
  analogWrite(LEFT_MOTOR_PWM, speed);

  // Right motor forward
  digitalWrite(RIGHT_MOTOR_INA, LOW);
  digitalWrite(RIGHT_MOTOR_INB, HIGH);
  analogWrite(RIGHT_MOTOR_PWM, speed);
}

void moveBackward(int speed) {
  // Left motor backward
  digitalWrite(LEFT_MOTOR_INA, HIGH);
  digitalWrite(LEFT_MOTOR_INB, LOW);
  analogWrite(LEFT_MOTOR_PWM, speed);

  // Right motor backward
  digitalWrite(RIGHT_MOTOR_INA, HIGH);
  digitalWrite(RIGHT_MOTOR_INB, LOW);
  analogWrite(RIGHT_MOTOR_PWM, speed);
}

void turnLeft() {
  // Left motor backward, right motor forward
  digitalWrite(LEFT_MOTOR_INA, HIGH);
  digitalWrite(LEFT_MOTOR_INB, LOW);
  analogWrite(LEFT_MOTOR_PWM, 150);

  digitalWrite(RIGHT_MOTOR_INA, LOW);
  digitalWrite(RIGHT_MOTOR_INB, HIGH);
  analogWrite(RIGHT_MOTOR_PWM, 150);
}

void turnRight() {
  // Left motor forward, right motor backward
  digitalWrite(LEFT_MOTOR_INA, LOW);
  digitalWrite(LEFT_MOTOR_INB, HIGH);
  analogWrite(LEFT_MOTOR_PWM, 150);

  digitalWrite(RIGHT_MOTOR_INA, HIGH);
  digitalWrite(RIGHT_MOTOR_INB, LOW);
  analogWrite(RIGHT_MOTOR_PWM, 150);
}

void stopMotors() {
  // Stop both motors by setting PWM to 0
  analogWrite(LEFT_MOTOR_PWM, 0);
  analogWrite(RIGHT_MOTOR_PWM, 0);

  // Set direction pins to LOW (coast mode)
  digitalWrite(LEFT_MOTOR_INA, LOW);
  digitalWrite(LEFT_MOTOR_INB, LOW);
  digitalWrite(RIGHT_MOTOR_INA, LOW);
  digitalWrite(RIGHT_MOTOR_INB, LOW);
}

// ===== MAIN PROGRAM =====

void loop() {
  // Test movement: Move forward for 2 seconds
  moveForward(150);
  delay(2000);
  stopMotors();
  delay(1000);  // Pause between movements

  // Add your code here for the lab exercises!

  delay(5000);  // Wait before repeating
}
