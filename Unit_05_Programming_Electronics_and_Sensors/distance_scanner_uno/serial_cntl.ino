/***************     SERIAL COMMAND INPUT — Arduino Uno    *****************/
// Commands:
//   "scan"   → start continuous sweep mode
//   0–180    → stop sweeping, move servo to that angle
//
// Example: type "0" → servo goes to 0°
//          type "90" → servo goes to 90° (center)
//          type "scan" → starts sweeping 0°→180° continuously

extern bool scanMode;
extern int currentSweepAngle;

String inputBuffer = "";

void processInput(String s) {
  s.trim();
  if (s.length() == 0) return;

  // "scan" command — enter scanning mode
  if (s.equalsIgnoreCase("scan")) {
    scanMode = true;
    currentSweepAngle = STARTING_ANGLE;
    Serial.println("Scan mode ON — type an angle to stop.");
    return;
  }

  // Validate: digits only
  bool valid = true;
  for (int i = 0; i < (int)s.length(); i++) {
    if (!isDigit(s[i])) { valid = false; break; }
  }

  if (!valid) {
    Serial.println("Invalid input: enter an angle (0-180) or \"scan\".");
    return;
  }

  int angle = s.toInt();
  if (angle < 0 || angle > 180) {
    Serial.print("Out of range: ");
    Serial.print(angle);
    Serial.println(". Valid range is 0 to 180 degrees.");
    return;
  }

  scanMode = false;
  setServoAngle(angle);
  Serial.print("Scan mode OFF — servo moved to: ");
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
