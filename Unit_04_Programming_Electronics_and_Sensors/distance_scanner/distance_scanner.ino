// *************************************************************************************
// *******                                                                       *******
// *******                       Distance Scanner                                *******
// *******   Demonstation of the ability to use a SR04 ultrasonic sensor         *******
// *******   Programmer: T Puvogel (with the assistance from Claude)             *******
// *******   Orginal Date: Feb. 24, 2026                                         *******
// *******                                                                       *******
// *******   Coded for Arduino Nano RP2040 Connect                               *******
// *******                                                                       *******
// *******   Started as a example for VHS robotics class students                *******
// *******                                                                       *******
// *************************************************************************************
// *******         Release: 1.0                                                  *******
// *******         Date: 02-25-2026                                              *******
// *******                                                                       *******
// *************************************************************************************

// include files to bring in for the program
#include <stdlib.h>
#include <Arduino.h>
#include "hardware/pwm.h"
#include <WiFiNINA.h>
// next to lines are in because of pesky redefinition of A4 in the WiFiNINA.h
#undef A4
#define A4 18


// hardware pin usage
// Servo PWM outputs - 50Hz 1ms to 2ms Duty cycle for SG90 Servo control
#define ULTRA_SONIC_SERVO A4   // Arduino pin A4
#define GRIPPER_SERVO 19   // Arduino D19 / A5
// ultrasonic sensor pins
#define USONIC_TRIGGER 15    // ultrasonic trigger output
#define USONIC_ECHO 13       // ultrasonic echo input
// SONIC_SERVO_START are the SONIC_SERVO_STOP are the valuse in us for the positive
// pulse width of the 50Hz cycle PWM single to the SG90 Sevo.  Per spec the postive pulse
// width determies the angle of the servo.  Per spec this control pulse should range from
// 1ms to 2ms high time to set the servo from 0 to 180 degrees.  These values may need to be 
// adjusted to get the proper full 180 degree span.  Range of values 500 to 2500. START should
// lower than STOP. Adjusting these tunes the sweep range/points.
#define SONIC_SERVO_START 560
#define SONIC_SERVO_STOP 1500


// variables and value initialization for ultrasonic sensor control and reading
volatile uint32_t usonic_tmr_req_time_ms = 0;    // system in msec when a distance measurement request was made
volatile uint32_t usonic_echo_start_us = 0;      // system time in usec when the echo pulse went high (echo start time)
volatile uint32_t usonic_echo_stop_us = 0;       // system time in usec when the echo pulse went low (echo stop stop)
#define USONIC_STATE_IDLE 0
#define USONIC_STATE_TRIGGERED 1
#define USONIC_STATE_ECHO_HIGH 2
#define USONIC_STATE_ECHO_LOW 3
#define MM_PER_US 0.343
#define CM_PER_US 0.01715 // round trip conversion of usec to cm
int usonic_state = USONIC_STATE_IDLE;            // state of the ultrasonic measurement
float sonic_servo_pw_us = 1500.0;  // default center position
float sonic_servo_last = 0.0;


void setup() {
  Serial.begin(115200);
  while (!Serial && millis() < 3000);
  Serial.println("Ultrasonic Sensor and Servo Demo - Nano RP2040 Connect");
  Serial.println("--------------------------------");

  setupPWM(ULTRA_SONIC_SERVO, 50.0f, 7.5f);         // Set up 50HZ Ultrasonic Direction Servo at freq 50Hz and 7.5% (~1.5ms on time) duty cycle
  setupPWM(GRIPPER_SERVO, 50.0f, 5.0f);             // Set up 50HZ Gripper Servo at freq 50Hz and 5.0% (~1ms on time) duty cycle
  pinMode(USONIC_ECHO, INPUT_PULLDOWN);               // Make the ultasonic echo pin an input with a pullup
  pinMode(USONIC_TRIGGER, OUTPUT);                  // make the trigger pin an output
  digitalWrite(USONIC_TRIGGER, LOW);                // Start the trigger output low
  attachInterrupt(digitalPinToInterrupt(USONIC_ECHO), usonic_echo_ISR, CHANGE);
}
// Sweep control parameters.  NOTE: only integer values for these #defines.
// Adust these to change your scanner sweep behavior.
// Set values such that the sweep is angles between 0 to 180
#define CHANGE_ANGLE_DELAY_MS 30      // delay for servo movement, perhaps larger for big ANGLE_INCREMENT
#define SWEEP_RETURN_DELAY_MS 500     // delay for servo movement when returning from full sweep
#define STARTING_ANGLE 0              // starting angle to begin the sweep, cannot be less than 0
#define MAX_ANGLE 180                 // not presently used but largest angle to set during sweep math
#define ANGLE_INCREMENT 1             // how much of an angle to move each time.
#define ANGLE_STEPS 360               // number of steps away from your stating position

void loop() {
  setServoAngle(STARTING_ANGLE);            // start the incremental sensor sweep here
  delay(SWEEP_RETURN_DELAY_MS);             // allow for a longer return time as could for return from full sweep
  for (int i = 1; i <= ANGLE_STEPS; i++) {  // for loop implements all the angle steps for the sweep
//    Serial.println(i);                      // uncomment to show the i varailble of the loop changing
    setServoAngle(i * ANGLE_INCREMENT);
    delay(CHANGE_ANGLE_DELAY_MS);
  }
//  Serial.println("through for loop");       // uncomment to show when the for loop stops
}


