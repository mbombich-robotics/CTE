/***************     SERVO CONTROL — Arduino Uno    *****************/
// Replaces timer_cntl.ino from the RP2040 version.
// Uses the Servo.h library instead of raw RP2040 hardware PWM.

extern Servo scanServo;

void setServoAngle(int angle) {
  if (angle >= 0 && angle <= 180) {
    scanServo.write(angle);
  } else {
    Serial.print("setServoAngle: value out of range (");
    Serial.print(angle);
    Serial.println("). Must be 0–180.");
  }
}
/***************     END OF SERVO CONTROL CODE    *****************/
