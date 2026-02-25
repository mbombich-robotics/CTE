/***************     BEGINNING OF LOWER LEVEL PWM GENERATION CODE    *****************/
// Store wrap value per slice for duty cycle calculations
uint32_t sliceWrap[8] = {65535, 65535, 65535, 65535, 65535, 65535, 65535, 65535};

// -------------------------------------------------------
// Convert Arduino pin number to raw RP2040 GPIO number
// -------------------------------------------------------
uint arduinoToGPIO(uint arduinoPin) {
  return (uint)digitalPinToPinName(arduinoPin);
}


// -------------------------------------------------------
// Compute clkDiv and wrap to hit target frequency
// Maximizes wrap (resolution) while keeping clkDiv >= 1.0
// -------------------------------------------------------
void calcPWMParams(float freqHz, float &clkDiv, uint32_t &wrap) {
  clkDiv = 1.0f;
  wrap   = (uint32_t)(125000000.0f / (clkDiv * freqHz)) - 1;

  while (wrap > 65535 && clkDiv < 255.0f) {
    clkDiv += 1.0f;
    wrap = (uint32_t)(125000000.0f / (clkDiv * freqHz)) - 1;
  }
  if (wrap > 65535) wrap = 65535;
}

// -------------------------------------------------------
// PWM helper - sets frequency and initial duty on a pin
// -------------------------------------------------------
void setupPWM(uint arduinoPin, float freqHz, float dutyPercent) {
  uint gpio    = arduinoToGPIO(arduinoPin);
  uint slice   = pwm_gpio_to_slice_num(gpio);
  uint channel = pwm_gpio_to_channel(gpio);

  gpio_set_function(gpio, GPIO_FUNC_PWM);

  float    clkDiv;
  uint32_t wrap;
  calcPWMParams(freqHz, clkDiv, wrap);
  sliceWrap[slice] = wrap;

  Serial.print("    clkDiv="); Serial.print(clkDiv);
  Serial.print("  wrap=");     Serial.print(wrap);
  Serial.print("  actual Hz=");
  Serial.println(125000000.0f / (clkDiv * (wrap + 1)));

  pwm_set_clkdiv(slice, clkDiv);
  pwm_set_wrap(slice, (uint16_t)wrap);

  uint32_t level = (uint32_t)(dutyPercent / 100.0f * (wrap + 1));
  pwm_set_chan_level(slice, channel, (uint16_t)level);

  pwm_set_enabled(slice, true);
}

// -------------------------------------------------------
// PWM helper - update duty cycle only, frequency unchanged
// -------------------------------------------------------
void setPWMDuty(uint arduinoPin, float dutyPercent) {
  uint gpio    = arduinoToGPIO(arduinoPin);
  uint slice   = pwm_gpio_to_slice_num(gpio);
  uint channel = pwm_gpio_to_channel(gpio);
  uint32_t level = (uint32_t)(dutyPercent / 100.0f * (sliceWrap[slice] + 1));
  pwm_set_chan_level(slice, channel, (uint16_t)level);
}

// -------------------------------------------------------
// Servo helper - set pulse width in microseconds
// -------------------------------------------------------
void setServoPulse(uint arduinoPin, float pulseUs) {
  if (pulseUs < 500.0f)  pulseUs = 500.0f;
  if (pulseUs > 2500.0f) pulseUs = 2500.0f;
  float dutyPercent = (pulseUs / 20000.0f) * 100.0f;
  setPWMDuty(arduinoPin, dutyPercent);
}

void setServoAngle(int angle) {
  if (angle >= 0 && angle <= 180) {
    setServoPulse(ULTRA_SONIC_SERVO, (float(angle) / 180.0) * float(SONIC_SERVO_STOP - SONIC_SERVO_START) + float(SONIC_SERVO_START));
  }
  else {
    Serial.println("setServoAngle called with a value outside the 0 to 180 range");
  }
}
/***************     END OF LOWER LEVEL PWM GENERATION CODE    *****************/
