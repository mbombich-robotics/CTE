/***************     BEGINNING ON NON BLOCKING SERIAL COMMAND INPUT CODE    *****************/

String inputBuffer = "";

void processInput(String s) {
  s.trim();
  if (s.length() == 0) return;

  // Validate all characters are digits (allow optional decimal point)
  bool hasDecimal = false;
  bool valid = true;
  for (int i = 0; i < s.length(); i++) {
    char c = s[i];
    if (c == '.') {
      if (hasDecimal) { valid = false; break; }
      hasDecimal = true;
    } else if (!isDigit(c)) {
      valid = false;
      break;
    }
  }

  if (!valid) {
    Serial.println("Invalid input: not a number. Enter a value between 1000 and 2000.");
    return;
  }

  float val = s.toFloat();

  if (val < 500.0 || val > 2500.0) {
    Serial.print("Out of range: ");
    Serial.print(val);
    Serial.println(". Valid range is 500 to 2500 microseconds.");
    return;
  }

  sonic_servo_pw_us = val;
  Serial.print("sonic_servo_pw_us set to: ");
  Serial.println(sonic_servo_pw_us);
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
/***************     END OF NON BLOCKING SERIAL COMMAND INPUT CODE    *****************/
