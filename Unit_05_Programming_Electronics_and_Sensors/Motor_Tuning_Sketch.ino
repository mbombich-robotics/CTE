// Motor Tuning Sketch
// Use this to calibrate your motors so they spin at the same speed
//
// Instructions:
// 1. Upload this sketch to your robot
// 2. Open Serial Monitor (9600 baud)
// 3. Press 's' to start both motors at the test speed
// 4. Mark a spot on each wheel with tape
// 5. Count how many times each wheel rotates in 10 seconds
// 6. Press 'x' to stop motors
// 7. Calculate the coefficient:
//    coefficient = slower_count / faster_count
//    Apply this to the FASTER motor in your line follower code
//
// Example:
//   Left wheel: 12 rotations in 10 sec
//   Right wheel: 14 rotations in 10 sec
//   Right is faster, so: RIGHT_COEFF = 12/14 = 0.857
//
// You can also press '+' or '-' to adjust the test speed

// ===== MOTOR PIN DEFINITIONS =====
const int LEFT_MOTOR_INA = 8;
const int LEFT_MOTOR_INB = 7;
const int LEFT_MOTOR_PWM = 5;

const int RIGHT_MOTOR_INA = 6;
const int RIGHT_MOTOR_INB = 4;
const int RIGHT_MOTOR_PWM = 3;

// ===== TEST SETTINGS =====
int testSpeed = 150;       // PWM value to test at (0-255)
bool motorsRunning = false;

void setup() {
  // Configure motor pins
  pinMode(LEFT_MOTOR_INA, OUTPUT);
  pinMode(LEFT_MOTOR_INB, OUTPUT);
  pinMode(LEFT_MOTOR_PWM, OUTPUT);
  pinMode(RIGHT_MOTOR_INA, OUTPUT);
  pinMode(RIGHT_MOTOR_INB, OUTPUT);
  pinMode(RIGHT_MOTOR_PWM, OUTPUT);

  // Stop motors
  stopMotors();

  Serial.begin(9600);
  delay(500);

  Serial.println("================================");
  Serial.println("   MOTOR TUNING SKETCH");
  Serial.println("================================");
  Serial.println();
  Serial.println("Commands:");
  Serial.println("  s - Start both motors");
  Serial.println("  x - Stop both motors");
  Serial.println("  l - Run LEFT motor only");
  Serial.println("  r - Run RIGHT motor only");
  Serial.println("  + - Increase speed by 10");
  Serial.println("  - - Decrease speed by 10");
  Serial.println("  1 - Set speed to 100");
  Serial.println("  2 - Set speed to 150");
  Serial.println("  3 - Set speed to 200");
  Serial.println();
  printSpeed();
}

void loop() {
  if (Serial.available() > 0) {
    char cmd = Serial.read();

    switch (cmd) {
      case 's':
        // Start both motors
        motorsRunning = true;
        setLeftMotor(testSpeed);
        setRightMotor(testSpeed);
        Serial.println(">>> Both motors RUNNING at PWM " + String(testSpeed));
        Serial.println("    Count wheel rotations for 10 seconds!");
        break;

      case 'x':
        // Stop both motors
        motorsRunning = false;
        stopMotors();
        Serial.println(">>> Motors STOPPED");
        Serial.println();
        Serial.println("Enter your rotation counts:");
        Serial.println("  Left wheel rotations:  ___");
        Serial.println("  Right wheel rotations: ___");
        Serial.println();
        Serial.println("Coefficient = slower / faster");
        Serial.println("Apply to the FASTER motor in your code.");
        break;

      case 'l':
        // Left motor only
        motorsRunning = true;
        setLeftMotor(testSpeed);
        setRightMotor(0);
        Serial.println(">>> LEFT motor only at PWM " + String(testSpeed));
        break;

      case 'r':
        // Right motor only
        motorsRunning = true;
        setLeftMotor(0);
        setRightMotor(testSpeed);
        Serial.println(">>> RIGHT motor only at PWM " + String(testSpeed));
        break;

      case '+':
        testSpeed = constrain(testSpeed + 10, 0, 255);
        printSpeed();
        if (motorsRunning) {
          setLeftMotor(testSpeed);
          setRightMotor(testSpeed);
        }
        break;

      case '-':
        testSpeed = constrain(testSpeed - 10, 0, 255);
        printSpeed();
        if (motorsRunning) {
          setLeftMotor(testSpeed);
          setRightMotor(testSpeed);
        }
        break;

      case '1':
        testSpeed = 100;
        printSpeed();
        if (motorsRunning) {
          setLeftMotor(testSpeed);
          setRightMotor(testSpeed);
        }
        break;

      case '2':
        testSpeed = 150;
        printSpeed();
        if (motorsRunning) {
          setLeftMotor(testSpeed);
          setRightMotor(testSpeed);
        }
        break;

      case '3':
        testSpeed = 200;
        printSpeed();
        if (motorsRunning) {
          setLeftMotor(testSpeed);
          setRightMotor(testSpeed);
        }
        break;
    }
  }
}

void printSpeed() {
  Serial.println("Test speed: PWM " + String(testSpeed) + " / 255");
}

void setLeftMotor(int speed) {
  if (speed > 0) {
    digitalWrite(LEFT_MOTOR_INA, LOW);
    digitalWrite(LEFT_MOTOR_INB, HIGH);
    analogWrite(LEFT_MOTOR_PWM, speed);
  } else {
    digitalWrite(LEFT_MOTOR_INA, LOW);
    digitalWrite(LEFT_MOTOR_INB, LOW);
    analogWrite(LEFT_MOTOR_PWM, 0);
  }
}

void setRightMotor(int speed) {
  if (speed > 0) {
    digitalWrite(RIGHT_MOTOR_INA, LOW);
    digitalWrite(RIGHT_MOTOR_INB, HIGH);
    analogWrite(RIGHT_MOTOR_PWM, speed);
  } else {
    digitalWrite(RIGHT_MOTOR_INA, LOW);
    digitalWrite(RIGHT_MOTOR_INB, LOW);
    analogWrite(RIGHT_MOTOR_PWM, 0);
  }
}

void stopMotors() {
  digitalWrite(LEFT_MOTOR_INA, LOW);
  digitalWrite(LEFT_MOTOR_INB, LOW);
  analogWrite(LEFT_MOTOR_PWM, 0);
  digitalWrite(RIGHT_MOTOR_INA, LOW);
  digitalWrite(RIGHT_MOTOR_INB, LOW);
  analogWrite(RIGHT_MOTOR_PWM, 0);
}
