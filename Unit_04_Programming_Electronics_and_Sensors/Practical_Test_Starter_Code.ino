/*
  PRACTICAL TEST - Motor Speed Control Simulation

  INSTRUCTIONS:
  This code is supposed to simulate motor speed control by:
  1. Setting up pin 9 as an output
  2. Printing motor speed values to the Serial Monitor
  3. Ramping the speed from 0 to 255 in steps of 25

  THERE ARE 5 BUGS IN THIS CODE!

  Your task:
  - Copy this code into Arduino IDE
  - Find and fix all 5 bugs
  - Upload to your Arduino Uno
  - Verify the Serial Monitor shows:
      Motor Speed: 0
      Motor Speed: 25
      Motor Speed: 50
      Motor Speed: 75
      Motor Speed: 100
      Motor Speed: 125
      Motor Speed: 150
      Motor Speed: 175
      Motor Speed: 200
      Motor Speed: 225
      Motor Speed: 255
  - Copy your CORRECTED code and paste it back into the quiz
*/

void setup() {
  // Bug 1: Missing Serial.begin(9600);
  pinMode(9, INPUT);  // Bug 2: Should be OUTPUT, not INPUT
}

void loop() {
  int motorSpeed = 0;

  for (int i = 0; i <= 10; i++) {
    int pwmValue = i * 25;

    Serial.print("Motor Speed: ");
    Serial.println(motorSpeed)  // Bug 3: Missing semicolon (also wrong variable!)

    analogWrite(9, pwmValue);
    delay(500);
  }

  // Bug 4: PWM value out of range (max is 255, not 300)
  analogWrite(9, 300);
  Serial.print("Motor Speed: ");
  Serial.println(300);  // Bug 5: Should print 255, not 300

  delay(5000);  // Wait 5 seconds before repeating
}
