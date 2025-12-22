// Lesson 6: Basic Robot Motion Control
// Starter Code for Lab Exercises

// Motor pin definitions
const int LEFT_MOTOR_PIN1 = 2;
const int LEFT_MOTOR_PIN2 = 3;
const int RIGHT_MOTOR_PIN1 = 4;
const int RIGHT_MOTOR_PIN2 = 5;

void setup() {
  // Set all motor pins as outputs
  pinMode(LEFT_MOTOR_PIN1, OUTPUT);
  pinMode(LEFT_MOTOR_PIN2, OUTPUT);
  pinMode(RIGHT_MOTOR_PIN1, OUTPUT);
  pinMode(RIGHT_MOTOR_PIN2, OUTPUT);
}

// ===== MOVEMENT FUNCTIONS =====

void moveForward(int speed) {
  analogWrite(LEFT_MOTOR_PIN1, speed);
  digitalWrite(LEFT_MOTOR_PIN2, LOW);
  analogWrite(RIGHT_MOTOR_PIN1, speed);
  digitalWrite(RIGHT_MOTOR_PIN2, LOW);
}

void moveBackward(int speed) {
  digitalWrite(LEFT_MOTOR_PIN1, LOW);
  analogWrite(LEFT_MOTOR_PIN2, speed);
  digitalWrite(RIGHT_MOTOR_PIN1, LOW);
  analogWrite(RIGHT_MOTOR_PIN2, speed);
}

void turnLeft() {
  // Left motor backward, right motor forward
  digitalWrite(LEFT_MOTOR_PIN1, LOW);
  digitalWrite(LEFT_MOTOR_PIN2, HIGH);
  digitalWrite(RIGHT_MOTOR_PIN1, HIGH);
  digitalWrite(RIGHT_MOTOR_PIN2, LOW);
}

void turnRight() {
  // Left motor forward, right motor backward
  digitalWrite(LEFT_MOTOR_PIN1, HIGH);
  digitalWrite(LEFT_MOTOR_PIN2, LOW);
  digitalWrite(RIGHT_MOTOR_PIN1, LOW);
  digitalWrite(RIGHT_MOTOR_PIN2, HIGH);
}

void stopMotors() {
  digitalWrite(LEFT_MOTOR_PIN1, LOW);
  digitalWrite(LEFT_MOTOR_PIN2, LOW);
  digitalWrite(RIGHT_MOTOR_PIN1, LOW);
  digitalWrite(RIGHT_MOTOR_PIN2, LOW);
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
