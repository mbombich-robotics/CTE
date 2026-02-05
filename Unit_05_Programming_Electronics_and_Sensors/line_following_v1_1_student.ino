// *************************************************************************************
// *******                                                                       *******
// *******   VHS Basic Line Follower Code                                        *******
// *******   Adapted from line following code of Osoyoo 5 channel IR sensor      *******
// *******   Programmer: T Puvogel                                               *******
// *******   Orginal Date: Jan. 13, 2026                                         *******
// *******                                                                       *******
// *******   Coded for Arduino Nano RP2040 Connect                               *******
// *******                                                                       *******
// *******   Provided as a starting point for robotics class students            *******
// *******   line following project. Students can verify motor wiring            *******
// *******   by defining DEBUG and setting the DEBUG motor speeds.               *******
// *******   This code was written for the class example bot. Students           *******
// *******   may of assigned their motor controllers and/or wired their          *******
// *******   motor phases and/or defined their forward direction diff-           *******
// *******   than the example bot.  They can compensate for any of these         *******
// *******   differences by their settings in the speed_array.                   *******
// *******                                                                       *******
// *******   A suggested way to get familiar with and get initial settings       *******
// *******   for the speed_array is to put the bot on a highly reflective        *******
// *******   surface with the wheels just barely held up off the surface.        *******
// *******   Adjust the potentiometer so each IR sensor LED is off, but          *******
// *******   illuminates when a small black (electrical tape width)              *******
// *******   object is put on under the individual sensors.  The non-            *******
// *******   reflective object can move across the array to show how             *******
// *******   each valid IR sensor reading changes the motor behavior             *******
// *******                                                                       *******
// *************************************************************************************
// *******         Release: V1.1                                                 *******
// *******            Date: 02-04-2026                                           *******
// *******          Author: Tom Puvogel                                          *******
// *******         Summary: Cleaned up some comments and modified DEBUG code     *******
// *******                                                                       *******
// *******                                                                       *******
// *************************************************************************************

// include files to bring in for the program
#include <stdlib.h>
#include <Arduino.h>

// Uncomment the following line to set the motors to the debug PWM level (nextg two #defines) and to get the serial debug messages
// coming out. Useful when working on IR decode and motor drive values
#define DEBUG 1

// When in DEBUG mode (the above #define not commented out) the next two #defines determine the motor speeds. 
// Suggest setting the PWM the motors are set to run between to 500 to 1000 one at a time to check wiring
#define DEBUG_RM_PWM 0        // PWM value sent to left motor when debug enabled
#define DEBUG_LM_PWM 0        // PWM value sent to left motor when debug enabled

#define ANL_WR_LEN 12         // defines the bit length to set the ADC conversion to. Specific Arduino board types have different limits.
#define PWM_STEPS 4095        // should be set to (2^ANL_WR_LEN - 1)
#define PWM_MAX_CHG 400       // set to the max PWM steps to change per loop length. Make larger to make bot more responsive. This is to prevent current surges and smooth operation.
#define MAX_PWM 1000          // the maximum PWM to allow the bot to go.  Should be <= PWM_STEPS.
#define LOOP_DLY_MS 0         // The number of msec delay for control loop; (NOTE: loop execution increases loop time [ideally this would be eliminated])

// define line follwing speeds for each state below suffix of RM for right motor suffix of LM for left motor
// speed for the motors when the center position is detected

// motor speeds when just the IR1 sensor is detecting a black line
#define IR1_M0 0
#define IR1_M1 0

// motor speeds when just IR sensors 1 and 2 are detecting a black line
#define IR12_M0 0
#define IR12_M1 0

// motor speeds when just IR sensor 2 is detecting a black line
#define IR2_M0 0
#define IR2_M1 0

// motor speeds when IR just sensor 2 and 3 are detecting a black line
#define IR23_M0 0
#define IR23_M1 0

// centered motor speeds when just IR 3 is detecting a black line
#define IR3_M0 0
#define IR3_M1 0

// motor speeds when just IR sensors 3 and 4 are detecting a black line
#define IR34_M0 0
#define IR34_M1 0

// motor speeds when just the IR sensor 4 is detecting a black line
#define IR4_M0 0
#define IR4_M1 0

// motor speeds when just IR 4 and 5 are detecting a black line
#define IR45_M0 0
#define IR45_M1 0

// motor speeds when just IR sensor 5 is detecting a black line
#define IR5_M0 0
#define IR5_M1 0


#define SPD_ARRAY_ROWS 2
#define SPD_ARRAY_COLS 10

// Define the lookup table speed_array below for motor speeds based on IR sensor position Row 0 is typically 
// right motor speed. Row 1 is the speed for typically the left motor.  Centered is when the bot is seeing the 
// black line on IR3, the center IR sensor.  The name of the definitions indicate which sensors detect a black  
// line. center. NOTE the tenth row entry [index 9] is the setting when no line is seen, and is the speed should
// typically be set to straight forward. NOTE: The numbering of the rows and columns of the array start at 0
// so a ten element row goes from 0 (far left entry) to 9 (far right entry).

// This defines the array, think a matrix of rows and columns like a checker board where each square has an
// assigned value.  The speeds the bot runs is pulled from this array of values. In the example bot the first row
// (row 0) goes to the motor controller that controls the right motor.  and the second row (row 1) goes to the
// motor controller that controls the right motor.  Your bot may be different.  Each student needs to 
// fill in this array such that the values of the array have you going what you call think is forward (may need
// to make values in the array negative to achieve this)  and that they change the drive strength to correct for 
// your detected position on the line.  Suggest operating bot with wheels off the ground while you force valid 
// line detection on the bot to figure out a starting point before trying to tune on the line.  NOTE: 
// the more you are off center the more aggressive you will correct your direction.

// NOTE: before doing the real line tracking change the last entry of row 0 and 1 to IR3_M0 and IR3_M1 respectively

int speed_array[SPD_ARRAY_ROWS][SPD_ARRAY_COLS] = {
  {IR1_M0, IR12_M0, IR2_M0, IR23_M0, IR3_M0, IR34_M0, IR4_M0, IR45_M0, IR5_M0, 0},   // Row 0
  {IR1_M1, IR12_M1, IR2_M1, IR23_M1, IR3_M1, IR34_M1, IR4_M1, IR45_M1, IR5_M1, 0},   // Row 1
};


// hardware pin useage definitions for the HW implementation
const uint8_t MTR_R_INA = 6;      // Right Motor Direction A
const uint8_t MTR_R_INB = 4;      // Right Motor Direction B
const uint8_t MTR_R_PWM = 3;      // Right Motor PWM (must support analogWrite)
const int MTR_R_CS = A3;          // Right Motor Current Sense

const uint8_t MTR_R_QUAD_A = 10;  // Right Motor Quadrature Input A
const uint8_t MTR_R_QUAD_B = 9;   // Right Motor Quadrature Input A

const uint8_t MTR_L_INA = 8;      // Left Motor Direction A
const uint8_t MTR_L_INB = 7;      // Left Motor Direction B
const uint8_t MTR_L_PWM = 5;      // Left Motor PWM (must support analogWrite)
const int MTR_L_CS = A1;          // Left Motor Current sense

const uint8_t MTR_L_QUAD_A = 12;  // Right Motor Quadrature Input A
const uint8_t MTR_L_QUAD_B = 11;  // Right Motor Quadrature Input A

const int IR_1 = A2;              // IR 1 sensor input
const uint8_t IR_2 = 0;           // IR 2 sensor input
const uint8_t IR_3 = 2;           // IR 3 sensor input
const uint8_t IR_4 = 1;           // IR 4 sensor input
const int IR_5 = A3;              // IR 5 sensor input


// variables and value initialization for current reading
const float ADC_REF_V = 3.3;      // ADC reference voltage (5V on most Unos)
const int ADC_LEN = 10;           // Variable to the ADC bit length
const float ADC_COUNTS = 1023.0;  // 12-bit ADC
const float CS_V_PER_A = 0.140;   // ~140 mV/A per VNH5019 datasheet (0.140 V/A)

int last_speed_r = 0;               // holds the last spped (actually PWM) sent to the right motor driver part
int last_speed_l = 0;               // holds the last spped (actually PWM) sent to the left motor driver part
int last_target_r = 0;              // variable that holds the present target PWM value of the right motor
int last_target_l = 0;              // variable that holds the present target PWM value of the left motor
int max_pwm_chg = PWM_MAX_CHG;      // the variable that contains the max PWM change per loop

int decode_error_count = 0;         // counts how many time an invalid IR reading is seen
int ir_pos;                         // variable that keeps a decode of the IR sensor, used as an index into the motor speed array



//  The function setMotor() takes two integer target speeds the first is for the speed of the right motor, and the second is for the speed
//  of the left motor (***NOTE student bots orientaion may be different requiring adjustments)  THe value of can be negative or positive 
//  such that the magnitude of the motor represents the PWM duty cycle, and the sign of the integer determines direction.  ***NOTE PWM
//  below certain magnitude will not cause the motor/wheels to spin and should avoided as this is a stall current (wasted energy and 
//  heat with no value added).  This routine will move the motors from their last commanded PWM which is stored in the global variables
//  last_speed_r and last_speed_l to the passed target speeds of speed_r and speed_l.  The PWM is allowed to change by max amount of PWM_MAX_CHG 
//  per call to this function.  PWM_MAX_CHG is a #define value at the top of this sketch.  This functionality is to control how fast the 
//  commanded PWM % can change.  Grandual changes have lower current draws and stress on the system.  To make the motor control more responsive 
//  increase the value assigned to PWM_MAX_CHG and/or make the loop time faster.
void setMotor(int speed_r, int speed_l) {
  speed_r = constrain(speed_r, -PWM_STEPS, PWM_STEPS);    //  limit the target speed for the right motor to the allowed range
  speed_l = constrain(speed_l, -PWM_STEPS, PWM_STEPS);    //  limit the target speed for the left motor to the allowed range
  
  // adjust the PWM sent to the right motor toward or to the passed target speed of speed_r as determined by PWM_MAX_CHG
  if (last_speed_r > speed_r) {
    last_speed_r = last_speed_r - max_pwm_chg;
    if (last_speed_r < speed_r) {
      last_speed_r = speed_r;
    }
  } else if (last_speed_r < speed_r) {
    last_speed_r = last_speed_r + max_pwm_chg;
    if (last_speed_r > speed_r) {
      last_speed_r = speed_r;
    }
  }

  // adjust the PWM sent to the left motor toward or to the passed target speed of speed_l as determined by PWM_MAX_CHG
  if (last_speed_l > speed_l) {
    last_speed_l = last_speed_l - max_pwm_chg;
    if (last_speed_l < speed_l) {
      last_speed_l = speed_l;
    }
  } else if (last_speed_l < speed_l) {
    last_speed_l = last_speed_l + max_pwm_chg;
    if (last_speed_l > speed_l) {
      last_speed_l = speed_l;
    }
  }

// ***NOTE this code is written for motor controller that have the phase colors reversed to compensate for motor mount directions 180 shift
// Be aware if the quadrature code is enabled in the future there was not thought of swapping them so the direction would look wrong for one motor

// set the right motor driver speed  [NOTE: disabling interrupts between config of right and left controllers may be wise due to interrrupts]
  if (last_speed_r > 0) {
    digitalWrite(MTR_R_INA, LOW);           //  if the right motor speed is positive (forward) enable motor and set direction
    digitalWrite(MTR_R_INB, HIGH);
  }
  else {
    digitalWrite(MTR_R_INA, HIGH);          // if the right motor speed is negative (reverse) enable motor and set direction
    digitalWrite(MTR_R_INB, LOW);
  }

  analogWrite(MTR_R_PWM, abs(last_speed_r));     // Set the PWM for the right motor


// set the left motor driver speed
  if (last_speed_l > 0) {
    digitalWrite(MTR_L_INA, LOW);           //  if the left motor speed is positive (forward) enable motor and set direction
    digitalWrite(MTR_L_INB, HIGH);
  } else {
    digitalWrite(MTR_L_INA, HIGH);          // if the left motor speed is negative (reverse) enable motor and set direction
    digitalWrite(MTR_L_INB, LOW);
  }

  analogWrite(MTR_L_PWM, abs(last_speed_l));     // Set the PWM for the left motor

}

// Read estimated motor current in Amps using CS pin.  May ideally want to digitally filter this reading
float left_mtr_current() {
  int raw = analogRead(MTR_L_CS);
  float v = (raw * ADC_REF_V) / ADC_COUNTS;  // volts at CS
  float amps = v / CS_V_PER_A;
  return amps;
}

// Read estimated motor current in Amps using CS pin.  May ideally want to digitally filter this reading
float right_mtr_current() {
  int raw = analogRead(MTR_L_CS);
  float v = (raw * ADC_REF_V) / ADC_COUNTS;  // volts at CS
  float amps = v / CS_V_PER_A;
  return amps;
}

void setup() {
  Serial.begin(9600);

  analogWriteResolution(ANL_WR_LEN);  // set up the PWM resolution (default Arduino is 0 to 255, but the Arduino Nano RP2040 connect can go up to 0 to 4095)

// define the pin usage

// define the right motor pins  *** NOTE right for example bot.  May be the left for student bots depending on wiring and defined front 
  pinMode(MTR_R_INA, OUTPUT);
  pinMode(MTR_R_INB, OUTPUT);
  pinMode(MTR_R_CS, INPUT);

// define the left motor pins  *** NOTE left for example bot.  May be the right for student bots depending on wiring and defined front 
  pinMode(MTR_L_INA, OUTPUT);
  pinMode(MTR_L_INB, OUTPUT);
  pinMode(MTR_L_CS, INPUT);

// IR sensor pins ***NOTE This should be true for both example bot and students if wired properly but right left side could be different
  pinMode(IR_1, INPUT);
  pinMode(IR_2, INPUT);
  pinMode(IR_3, INPUT);
  pinMode(IR_4, INPUT);
  pinMode(IR_5, INPUT);

// Safe startup: set motors off, and not dynamically braked
  digitalWrite(MTR_R_INA, LOW);
  digitalWrite(MTR_R_INB, LOW);
  analogWrite(MTR_R_PWM, 0);
  digitalWrite(MTR_L_INA, LOW);
  digitalWrite(MTR_L_INB, LOW);
  analogWrite(MTR_L_PWM, 0);
}

void loop() {
  int ir_val_1, ir_val_2, ir_val_3, ir_val_4, ir_val_5;
  
  int decode_error = 0;     // clear the decodew error for this decode attempt

  // read all the IR sensors and store the reading
  ir_val_1 = digitalRead(IR_1);
  ir_val_2 = digitalRead(IR_2);
  ir_val_3 = digitalRead(IR_3);
  ir_val_4 = digitalRead(IR_4);
  ir_val_5 = digitalRead(IR_5);

  // One sensor only low is a valid state. Two adjacent sensors LOW is a valid state.  Two non-adjacent sensors LOW is invalid.
  // For the class example bot, IR_1 is the left most sensor. valid IR decodes are put in the ir_pos variable.
  // IR_1 only LOW = 0, IR_1 and IR_2 LOW = 1, IR_2 only LOW = 2, IR_2 and IR_3 only LOW = 3, IR_3 only LOW = 4
  // IR_3 and IR_4 only LOW = 5, IR_4 only LOW = 6, IR_4 and IR_5 only LOW = 7, IR_5 only LOW = 8, no IRs LOW = 9
  // When an invald IR sensor reading is made the last valad ir_pos remains. 
  // *** NOTE student bot may have a different sense of which IR sensor shows off to the left or right. For bots where this is 
  // reversed in code below swap the names of ir_val_1 and ir_val_5, and the names of ir_val_2 and ir_val_4. ir_val_3 DOES NOT change.

  if (ir_val_1 == LOW) {
    if (ir_val_3 == HIGH && ir_val_4 == HIGH && ir_val_5 == HIGH) {
      if (ir_val_2 == LOW) {
        ir_pos = 1;
      }
      else {
        ir_pos = 0;
      }
    }
    else {
      decode_error = 1;
    }
  }
  else if (ir_val_2 == LOW && decode_error == 0) {
    if (ir_val_4 == HIGH && ir_val_5 == HIGH) {
      if (ir_val_3 == LOW) {
        ir_pos = 3;
      }
      else {
        ir_pos = 2;
      }
    }
    else {
      decode_error = 1; 
    }
  }
  else if (ir_val_3 == LOW && decode_error == 0) {
    if (ir_val_5 == HIGH) {
      if (ir_val_4 == LOW) {
        ir_pos = 5;
      }
      else {
        ir_pos = 4;
      }
    }
    else {
      decode_error = 1;
    }
  }
  else if (ir_val_4 == LOW && decode_error == 0) {
    if (ir_val_5 == LOW) {
      ir_pos = 7;
    }
    else {
      ir_pos = 6;
    }
  }
  else if (ir_val_5 == LOW && decode_error == 0) {
    ir_pos = 8;
  }
  else {
    ir_pos = 9;
  }

  if (decode_error != 0) {
    decode_error_count++;   // increment decode error count for each occurence
  }

#ifndef DEBUG
// use the last valid ir_pos decode
  last_target_r = speed_array[0][ir_pos];
  last_target_l = speed_array[1][ir_pos];
#endif

#ifdef DEBUG
  last_target_r = DEBUG_RM_PWM;
  last_target_l = DEBUG_LM_PWM;
#endif

// Define DEBUG to get the following debug print statements
#ifdef DEBUG
  Serial.print("decode_error = ");
  Serial.print(decode_error);
  Serial.print(" ir_pos = ");
  Serial.print(ir_pos);
  Serial.print(" speed_target_r = ");
  Serial.print(last_target_r);
  Serial.print(" speed_target_l = ");
  Serial.print(last_target_l);
#endif

  setMotor(last_target_r, last_target_l);

// uncomment the next line and give a positive integer for LOOP_DLY_MS to slow down the loop
//  delay(LOOP_DLY_MS);
}
