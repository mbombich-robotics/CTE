// Lesson 8: Basic Line Following
// Starter Code for Lab Exercises

// Motor pin definitions
const int LEFT_MOTOR_PIN1 = 2;
const int LEFT_MOTOR_PIN2 = 3;
const int RIGHT_MOTOR_PIN1 = 4;
const int RIGHT_MOTOR_PIN2 = 5;

// Sensor pin definitions (3-sensor approach)
const int SENSOR_LEFT = 7;    // S2
const int SENSOR_CENTER = 8;  // S3
const int SENSOR_RIGHT = 9;   // S4

void setup() {
  // Set motor pins as outputs
  pinMode(LEFT_MOTOR_PIN1, OUTPUT);
  pinMode(LEFT_MOTOR_PIN2, OUTPUT);
  pinMode(RIGHT_MOTOR_PIN1, OUTPUT);
  pinMode(RIGHT_MOTOR_PIN2, OUTPUT);

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
  analogWrite(LEFT_MOTOR_PIN1, speed);
  digitalWrite(LEFT_MOTOR_PIN2, LOW);
  analogWrite(RIGHT_MOTOR_PIN1, speed);
  digitalWrite(RIGHT_MOTOR_PIN2, LOW);
}

void turnLeft() {
  digitalWrite(LEFT_MOTOR_PIN1, LOW);
  digitalWrite(LEFT_MOTOR_PIN2, HIGH);
  digitalWrite(RIGHT_MOTOR_PIN1, HIGH);
  digitalWrite(RIGHT_MOTOR_PIN2, LOW);
}

void turnRight() {
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
