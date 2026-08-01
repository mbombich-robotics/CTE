/*
  PRACTICAL TEST - Motor Speed Control Simulation (CORRECT SOLUTION)
*/

void setup() {
  Serial.begin(9600);      // Fixed Bug 1: Added Serial.begin
  pinMode(9, OUTPUT);      // Fixed Bug 2: Changed INPUT to OUTPUT
}

void loop() {
  int motorSpeed = 0;

  for (int i = 0; i <= 10; i++) {
    int pwmValue = i * 25;

    Serial.print("Motor Speed: ");
    Serial.println(pwmValue);  // Fixed Bug 3: Added semicolon and used correct variable

    analogWrite(9, pwmValue);
    delay(500);
  }

  // Fixed Bug 4 & 5: Changed 300 to 255 (correct PWM max)
  analogWrite(9, 255);
  Serial.print("Motor Speed: ");
  Serial.println(255);

  delay(5000);
}
