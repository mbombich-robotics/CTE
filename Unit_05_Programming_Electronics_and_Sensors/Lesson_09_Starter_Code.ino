// Lesson 9: PD Control for Line Following
// Starter Code for Lab Exercises
// Complete the TODOs to implement a working PD line follower

// ===== MOTOR PIN DEFINITIONS =====
// 3-pin motor controller (INA, INB, PWM)
const int LEFT_MOTOR_INA = 8;
const int LEFT_MOTOR_INB = 7;
const int LEFT_MOTOR_PWM = 5;

const int RIGHT_MOTOR_INA = 6;
const int RIGHT_MOTOR_INB = 4;
const int RIGHT_MOTOR_PWM = 3;

// ===== SENSOR PIN DEFINITIONS =====
const int SENSOR_1 = A2;   // Far left
const int SENSOR_2 = 0;    // Left
const int SENSOR_3 = 2;    // Center
const int SENSOR_4 = 1;    // Right
const int SENSOR_5 = A3;   // Far right

// ===== PD CONSTANTS =====
// These values are a starting point - you will tune them!
const float Kp = 30.0;      // Proportional constant (start with 20-50)
const float Kd = 10.0;      // Derivative constant (start with Kp/3)
const int baseSpeed = 150;  // Base motor speed (0-255)

// ===== MOTOR CALIBRATION =====
// Run the Motor Tuning Sketch first to find these values!
// Set the coefficient for the FASTER motor (slower motor stays at 1.0)
const float LEFT_COEFF  = 1.0;   // Adjust if left motor is faster
const float RIGHT_COEFF = 1.0;   // Adjust if right motor is faster

// ===== VARIABLES =====
int lastError = 0;          // Stores previous error for derivative calculation

void setup() {
  // Configure motor pins as outputs
  pinMode(LEFT_MOTOR_INA, OUTPUT);
  pinMode(LEFT_MOTOR_INB, OUTPUT);
  pinMode(LEFT_MOTOR_PWM, OUTPUT);

  pinMode(RIGHT_MOTOR_INA, OUTPUT);
  pinMode(RIGHT_MOTOR_INB, OUTPUT);
  pinMode(RIGHT_MOTOR_PWM, OUTPUT);

  // Configure sensor pins as inputs
  pinMode(SENSOR_1, INPUT);
  pinMode(SENSOR_2, INPUT);
  pinMode(SENSOR_3, INPUT);
  pinMode(SENSOR_4, INPUT);
  pinMode(SENSOR_5, INPUT);

  // Optional: Initialize serial communication for debugging
  Serial.begin(9600);
  Serial.println("PD Line Follower Starting...");
  Serial.println("Kp=" + String(Kp) + " Kd=" + String(Kd) + " Base=" + String(baseSpeed));
}

void loop() {
  // ===== STEP 1: GET CURRENT POSITION ERROR =====
  int error = getPositionError();

  // ===== TODO: STEP 2 - CALCULATE DERIVATIVE =====
  // The derivative is the rate of change of error
  // Hint: derivative = current error - previous error

  // int derivative = error - lastError;


  // ===== TODO: STEP 3 - CALCULATE TOTAL CORRECTION =====
  // Combine the P term and D term
  // Hint: correction = (Kp * error) + (Kd * derivative)

  // float correction = (Kp * error) + (Kd * derivative);


  // ===== TODO: STEP 4 - CALCULATE MOTOR SPEEDS =====
  // Subtract correction from left motor, add to right motor
  // Hint:
  //   int leftSpeed = baseSpeed - correction;
  //   int rightSpeed = baseSpeed + correction;



  // ===== TODO: STEP 5 - CONSTRAIN SPEEDS TO VALID RANGE =====
  // Motor speeds must be between 0 and 255
  // Hint: Use the constrain() function

  // leftSpeed = constrain(leftSpeed, 0, 255);
  // rightSpeed = constrain(rightSpeed, 0, 255);


  // ===== TODO: STEP 6 - APPLY SPEEDS TO MOTORS =====
  // Call the setMotorSpeeds function

  // setMotorSpeeds(leftSpeed, rightSpeed);


  // ===== TODO: STEP 7 - UPDATE LAST ERROR =====
  // Save current error for next iteration's derivative calculation

  // lastError = error;


  // ===== DEBUGGING (Optional) =====
  // Uncomment these lines to see values in Serial Monitor
  // This helps with tuning!

  // Serial.print("Error: ");
  // Serial.print(error);
  // Serial.print(" | Deriv: ");
  // Serial.print(derivative);
  // Serial.print(" | Corr: ");
  // Serial.print(correction);
  // Serial.print(" | L: ");
  // Serial.print(leftSpeed);
  // Serial.print(" | R: ");
  // Serial.println(rightSpeed);


  // Small delay for stability (optional, adjust as needed)
  delay(10);
}

// ===== FUNCTION: GET POSITION ERROR =====
// Reads the 5 IR sensors and calculates position error
// Returns: -2 to +2
//   -2 = line far left
//   -1 = line slightly left
//    0 = line centered (perfect!)
//   +1 = line slightly right
//   +2 = line far right
int getPositionError() {
  // Read all 5 sensors
  // Remember: LOW = black line detected, HIGH = white surface
  int s1 = digitalRead(SENSOR_1);  // Far left
  int s2 = digitalRead(SENSOR_2);  // Left
  int s3 = digitalRead(SENSOR_3);  // Center
  int s4 = digitalRead(SENSOR_4);  // Right
  int s5 = digitalRead(SENSOR_5);  // Far right

  // Simple position calculation - return based on which sensor sees the line
  if (s1 == LOW) {
    return -2;      // Far left
  }
  else if (s2 == LOW) {
    return -1;      // Left
  }
  else if (s3 == LOW) {
    return 0;       // Center - perfect!
  }
  else if (s4 == LOW) {
    return 1;       // Right
  }
  else if (s5 == LOW) {
    return 2;       // Far right
  }

  // No sensor detects the line - robot is lost!
  // Return the last known error to maintain direction
  return lastError;
}

// ===== FUNCTION: SET MOTOR SPEEDS =====
// Controls both motors with variable speeds using PWM
// Applies calibration coefficients to compensate for motor differences
// Parameters:
//   leftSpeed: Speed for left motor (0-255, or negative for reverse)
//   rightSpeed: Speed for right motor (0-255, or negative for reverse)
void setMotorSpeeds(int leftSpeed, int rightSpeed) {
  // Apply calibration coefficients
  leftSpeed  = leftSpeed  * LEFT_COEFF;
  rightSpeed = rightSpeed * RIGHT_COEFF;

  // ===== LEFT MOTOR =====
  if (leftSpeed >= 0) {
    // Forward direction
    digitalWrite(LEFT_MOTOR_INA, LOW);
    digitalWrite(LEFT_MOTOR_INB, HIGH);
    analogWrite(LEFT_MOTOR_PWM, leftSpeed);
  } else {
    // Reverse direction (negative speed)
    digitalWrite(LEFT_MOTOR_INA, HIGH);
    digitalWrite(LEFT_MOTOR_INB, LOW);
    analogWrite(LEFT_MOTOR_PWM, -leftSpeed);  // Make positive
  }

  // ===== RIGHT MOTOR =====
  if (rightSpeed >= 0) {
    // Forward direction
    digitalWrite(RIGHT_MOTOR_INA, LOW);
    digitalWrite(RIGHT_MOTOR_INB, HIGH);
    analogWrite(RIGHT_MOTOR_PWM, rightSpeed);
  } else {
    // Reverse direction (negative speed)
    digitalWrite(RIGHT_MOTOR_INA, HIGH);
    digitalWrite(RIGHT_MOTOR_INB, LOW);
    analogWrite(RIGHT_MOTOR_PWM, -rightSpeed);  // Make positive
  }
}

// ===== EXERCISE PROGRESSION =====
//
// Exercise 1: Motor Calibration
// - Upload the Motor_Tuning_Sketch.ino
// - Run both motors at the same speed and count rotations
// - Calculate the coefficient and enter it above
//
// Exercise 2: P-Only Control
// - Set Kd = 0 at the top of this file
// - Complete TODOs 2-7 but skip the Kd term in Step 3
// - Upload and test - robot should follow but may oscillate
//
// Exercise 3: Tune Kp
// - Try different Kp values: 20, 30, 40, 50
// - Find the highest value that doesn't oscillate too wildly
// - Write down your best value!
//
// Exercise 4: Add D Term
// - Set Kd = Kp / 3
// - Complete Step 3 with full PD calculation
// - Upload and test - oscillation should reduce!
//
// Exercise 5: Fine-tune Kd
// - Adjust Kd up or down by 2-3
// - Find the smoothest motion
// - If sluggish, reduce Kd
// - If still wobbling, increase Kd
//
// Exercise 6: Optimize for Speed
// - Once tuned, increase baseSpeed gradually
// - Test: 150 -> 170 -> 190 -> 200
// - May need to re-tune Kp and Kd for higher speeds
// - Find your robot's maximum reliable speed!
//
// ===== TUNING TIPS =====
//
// Symptom: Robot barely turns, can't follow curves
// Solution: Increase Kp
//
// Symptom: Robot oscillates wildly side-to-side
// Solution: Decrease Kp, or add/increase Kd
//
// Symptom: Robot follows but wobbles slightly
// Solution: Add D term or increase Kd
//
// Symptom: Robot responds slowly, sluggish
// Solution: Decrease Kd or increase Kp
//
// Symptom: Robot leaves the line on sharp curves
// Solution: Reduce baseSpeed or increase Kp
//
// Symptom: Robot drifts to one side on straights
// Solution: Run Motor Tuning Sketch, adjust coefficients
//
