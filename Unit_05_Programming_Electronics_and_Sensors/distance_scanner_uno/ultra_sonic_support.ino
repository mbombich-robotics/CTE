/***************     ULTRASONIC SUPPORT — Arduino Uno compatible    *****************/
// Interrupt-driven echo timing — same logic as RP2040 version.
// Requires echo pin to be 2 or 3 (the only external interrupt pins on Uno).

void usonic_echo_ISR() {
  if (digitalRead(USONIC_ECHO) == HIGH) {
    // Rising edge — start timing
    if (usonic_state == USONIC_STATE_TRIGGERED) {
      usonic_echo_start_us = micros();
      usonic_state = USONIC_STATE_ECHO_HIGH;
    }
  } else if (usonic_state == USONIC_STATE_ECHO_HIGH) {
    // Falling edge — stop timing
    usonic_echo_stop_us = micros();
    usonic_state = USONIC_STATE_ECHO_LOW;
  }
}

void usonic_start_measurement() {
  usonic_tmr_req_time_ms = millis();
  usonic_state = USONIC_STATE_TRIGGERED;
  digitalWrite(USONIC_TRIGGER, HIGH);
  delayMicroseconds(15);
  digitalWrite(USONIC_TRIGGER, LOW);
}

// Returns distance in cm, or 0 if reading is not yet ready
float usonic_reading() {
  if (usonic_state != USONIC_STATE_ECHO_LOW) {
    return 0;
  }
  usonic_state = USONIC_STATE_IDLE;
  if (usonic_echo_stop_us > usonic_echo_start_us) {
    return float(usonic_echo_stop_us - usonic_echo_start_us) * CM_PER_US;
  } else {
    // Handle 32-bit micros() rollover (~70 min wrap on Uno)
    return float((4294967296UL - usonic_echo_start_us) + usonic_echo_stop_us) * CM_PER_US;
  }
}
/***************     END OF ULTRASONIC SUPPORT CODE    *****************/
