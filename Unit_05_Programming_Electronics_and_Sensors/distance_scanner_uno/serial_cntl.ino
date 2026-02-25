/***************     SERIAL COMMAND INPUT — Arduino Uno    *****************/
// Type an angle (0–180) in the Serial Monitor and press Enter to move
// the scanning servo directly to that position. Useful for verifying
// servo range and finding the actual start/stop endpoints on your hardware.
//
// Example: type "0" → servo goes to 0°
//          type "90" → servo goes to 90° (center)
//          type "180" → servo goes to 180°

String inputBuffer = "";

void processInput(String s) {
  s.trim();
  if (s.length() == 0) return;

  // Validate: digits only
  bool valid = true;
  for (int i = 0; i < (int)s.length(); i++) {
    if (!isDigit(s[i])) { valid = false; break; }
  }

  if (!valid) {
    Serial.println("Invalid input: enter an integer angle between 0 and 180.");
    return;
  }

  int angle = s.toInt();
  if (angle < 0 || angle > 180) {
    Serial.print("Out of range: ");
    Serial.print(angle);
    Serial.println(". Valid range is 0 to 180 degrees.");
    return;
  }

  setServoAngle(angle);
  Serial.print("Servo moved to: ");
  Serial.print(angle);
  Serial.println("°");
}

void checkSerial() {
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n' || c == '\r') {
      if (inputBuffer.length() > 0) {
        processInput(inputBuffer);
        inputBuffer = "";
      }
    } else {
      inputBuffer += c;
    }
  }
}
/***************     END OF SERIAL COMMAND INPUT CODE    *****************/
