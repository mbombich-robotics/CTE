// Lesson 8: Basic Line Following
// Starter Code for Lab Exercises

// Motor pin definitions - 3-pin motor controller (INA, INB, PWM)
const int LEFT_MOTOR_INA = 8;
const int LEFT_MOTOR_INB = 7;
const int LEFT_MOTOR_PWM = 5;

const int RIGHT_MOTOR_INA = 6;
const int RIGHT_MOTOR_INB = 4;
const int RIGHT_MOTOR_PWM = 3;

// Sensor pin definitions (3-sensor approach)
const int SENSOR_LEFT = 0;    // S2
const int SENSOR_CENTER = 2;  // S3
const int SENSOR_RIGHT = 1;   // S4

void setup() {
  // Set all motor pins as outputs
  pinMode(LEFT_MOTOR_INA, OUTPUT);
  pinMode(LEFT_MOTOR_INB, OUTPUT);
  pinMode(LEFT_MOTOR_PWM, OUTPUT);

  pinMode(RIGHT_MOTOR_INA, OUTPUT);
  pinMode(RIGHT_MOTOR_INB, OUTPUT);
  pinMode(RIGHT_MOTOR_PWM, OUTPUT);

  // Set sensor pins as inputs
  pinMode(SENSOR_LEFT, INPUT);
  pinMode(SENSOR_CENTER, INPUT);
  pinMode(SENSOR_RIGHT, INPUT);

  // Optional: Serial for debugging
  Serial.begin(9600);
}

void loop() {
  // TODO: Read all three sensors
  // int left = digitalRead(SENSOR_LEFT);
  // int center = digitalRead(SENSOR_CENTER);
  // int right = digitalRead(SENSOR_RIGHT);

  // TODO: Add your decision logic here!
  // if (center == LOW) {
  //   // Line is centered
  //   moveForward(150);
  // }
  // else if (left == LOW) {
  //   // Line is on left
  //   turnLeft();
  // }
  // else if (right == LOW) {
  //   // Line is on right
  //   turnRight();
  // }
  // else {
  //   // No line detected
  //   stopMotors();
  // }
}

// Motor control functions

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
