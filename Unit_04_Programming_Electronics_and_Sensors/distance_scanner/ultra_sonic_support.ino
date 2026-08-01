void usonic_echo_ISR() {
  if (digitalRead(USONIC_ECHO) == HIGH) {
  // rising edge interrupt
    if (usonic_state == USONIC_STATE_TRIGGERED) {
      // Rising edge - start timing
      usonic_echo_start_us = micros();
      usonic_state  = USONIC_STATE_ECHO_HIGH;
    }
  } 
  else if (usonic_state == USONIC_STATE_ECHO_HIGH) {
  // falling edge interrupt
    usonic_echo_stop_us = micros();
    usonic_state  = USONIC_STATE_ECHO_LOW;
  }
}

void usonic_start_measurement() {
  usonic_tmr_req_time_ms = millis();
  usonic_state  = USONIC_STATE_TRIGGERED;
  digitalWrite(USONIC_TRIGGER, HIGH);
  delayMicroseconds(15);
  digitalWrite(USONIC_TRIGGER, LOW);
}

// return the cm value of the ultrasonic sensor
float usonic_reading() {
  if (usonic_state != USONIC_STATE_ECHO_LOW) {
    return 0;
  }
  else {
    usonic_state = USONIC_STATE_IDLE;
    if (usonic_echo_stop_us > usonic_echo_start_us) {
      return (float(usonic_echo_stop_us - usonic_echo_start_us) * CM_PER_US);
    }
    else {   // calculate properly when wrap of system usec timer
      return (float((4294967296 - usonic_echo_start_us) + usonic_echo_stop_us) * CM_PER_US);
    }
  }
}
