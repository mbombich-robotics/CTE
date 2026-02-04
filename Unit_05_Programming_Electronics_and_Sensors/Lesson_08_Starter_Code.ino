// Lesson 8: Basic Line Following
// Starter Code for Lab Exercises

// Motor pin definitions - 3-pin motor controller (INA, INB, PWM)
const int LEFT_MOTOR_INA = 8;
const int LEFT_MOTOR_INB = 7;
const int LEFT_MOTOR_PWM = 5;

const int RIGHT_MOTOR_INA = 6;
const int RIGHT_MOTOR_INB = 4;
const int RIGHT_MOTOR_PWM = 3;

// Sensor pin definitions
const int SENSOR_1 = A2;   // S1 - Far left
const int SENSOR_2 = 0;    // S2 - Left
const int SENSOR_3 = 2;    // S3 - Center
const int SENSOR_4 = 1;    // S4 - Right
const int SENSOR_5 = A3;   // S5 - Far right

void setup() {
  // Set all motor pins as outputs
  pinMode(LEFT_MOTOR_INA, OUTPUT);
  pinMode(LEFT_MOTOR_INB, OUTPUT);
  pinMode(LEFT_MOTOR_PWM, OUTPUT);

  pinMode(RIGHT_MOTOR_INA, OUTPUT);
  pinMode(RIGHT_MOTOR_INB, OUTPUT);
  pinMode(RIGHT_MOTOR_PWM, OUTPUT);

  // Set sensor pins as inputs
  pinMode(SENSOR_1, INPUT);
  pinMode(SENSOR_2, INPUT);
  pinMode(SENSOR_3, INPUT);
  pinMode(SENSOR_4, INPUT);
  pinMode(SENSOR_5, INPUT);

  // Optional: Serial for debugging
  Serial.begin(9600);
}

void loop() {
  // Step 1: Read all 5 sensors
  // digitalRead() returns LOW (0) when the sensor detects the black line
  int s1 = digitalRead(SENSOR_1);  // Far left
  int s2 = digitalRead(SENSOR_2);  // Left
  int s3 = digitalRead(SENSOR_3);  // Center
  int s4 = digitalRead(SENSOR_4);  // Right
  int s5 = digitalRead(SENSOR_5);  // Far right

  // Step 2: Add your decision logic here!
  // Start simple: check the center sensor first, then left and right
  // Hint: if (s3 == LOW) means the center sensor detects the line

  // if (s3 == LOW) {
  //   moveForward(150);       // Line is centered - go straight!
  // }
  // else if (s2 == LOW || s1 == LOW) {
  //   turnLeft();             // Line is on the left - turn left
  // }
  // else if (s4 == LOW || s5 == LOW) {
  //   turnRight();            // Line is on the right - turn right
  // }
  // else {
  //   stopMotors();           // No line detected - stop
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
