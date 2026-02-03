// Lesson 6: Basic Robot Motion Control
// Starter Code for Lab Exercises

// Motor pin definitions - 3-pin motor controller (INA, INB, PWM)
const int LEFT_MOTOR_INA  = 8;   // Left Motor Direction A
const int LEFT_MOTOR_INB  = 7;   // Left Motor Direction B
const int LEFT_MOTOR_PWM  = 5;   // Left Motor Speed (PWM)

const int RIGHT_MOTOR_INA = 6;   // Right Motor Direction A
const int RIGHT_MOTOR_INB = 4;   // Right Motor Direction B
const int RIGHT_MOTOR_PWM = 3;   // Right Motor Speed (PWM)

// IR sensor pin definitions
const int IR_1 = A2;             // IR 1 sensor input
const int IR_2 = 0;              // IR 2 sensor input
const int IR_3 = 2;              // IR 3 sensor input
const int IR_4 = 1;              // IR 4 sensor input
const int IR_5 = A3;             // IR 5 sensor input

void setup() {
  Serial.begin(9600);

  // Set all motor pins as outputs
  pinMode(LEFT_MOTOR_INA, OUTPUT);
  pinMode(LEFT_MOTOR_INB, OUTPUT);
  pinMode(LEFT_MOTOR_PWM, OUTPUT);

  pinMode(RIGHT_MOTOR_INA, OUTPUT);
  pinMode(RIGHT_MOTOR_INB, OUTPUT);
  pinMode(RIGHT_MOTOR_PWM, OUTPUT);

  // Set IR sensor pins as inputs
  pinMode(IR_1, INPUT);
  pinMode(IR_2, INPUT);
  pinMode(IR_3, INPUT);
  pinMode(IR_4, INPUT);
  pinMode(IR_5, INPUT);

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
  // Read and print IR sensors as a 5-bit pattern (IR5 IR4 IR3 IR2 IR1)
  // Open Serial Monitor (9600 baud) to see sensor values
  if (digitalRead(IR_5) == HIGH) {
    Serial.print("1");
  } else {
    Serial.print("0");
  }

  if (digitalRead(IR_4) == HIGH) {
    Serial.print("1");
  } else {
    Serial.print("0");
  }

  if (digitalRead(IR_3) == HIGH) {
    Serial.print("1");
  } else {
    Serial.print("0");
  }

  if (digitalRead(IR_2) == HIGH) {
    Serial.print("1");
  } else {
    Serial.print("0");
  }

  if (digitalRead(IR_1) == HIGH) {
    Serial.println("1");
  } else {
    Serial.println("0");
  }

  delay(500);
}
