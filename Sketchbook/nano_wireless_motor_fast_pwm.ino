// *******   File: nano_wireless_motor_fast_pwm.ino                              *******
// *******   VHS wifi Motor Control                                              *******
// *******   Orignial Programmer: T Puvogel                                      *******
// *******   Orginal Date: Started Dec 4, 2025 based off nano_wirelessmotor.ino  *******
// *******                                                                       *******
// *******                                                                       *******
// *******   This was an attempt to get the motor PWM frequency up to  a more    *******
// *******   standard rate using PWM support from the Mbed OS core               *******
// *******                                                                       *******
// *******         Components used: Arduino Nano RP2040 Connect                  *******
// *******                          HiLetgo Gamepad Joystick Shield              *******
// *************************************************************************************
// *******         Release: V1.0                                                 *******
// *******            Date: 12-05-2025                                           *******
// *******          Author: Tom Puvogel                                          *******
// *******         Summary: Original Release                                     *******
// *******                                                                       *******
// *******  Program uses wifi communication to control two motor controllers     *******
// *******  which drive two independent wheels for driving a proto bot for       *******
// *******  the VHS robot class's proto robot                                    *******
// *******                                                                       *******
// *******  Communications over WiFi provides a basic ASCII controll string      *******
// *******  The format is an ascii presentation of 3 integers separated by       *******
// *******  and no spaces.  The first two numbers are polar coordinate of the    *******
// *******  joystick angle and force, and the third number is ascii represented  ******
// *******  integer where all three wifi communicated value add up to o          *******
// *******  COMM_CHECK_VAL.                                                      *******
// *******                                                                       *******
// *******
// *************************************************************************************

#include <WiFi.h>
#include <WiFiUdp.h>
#include <stdlib.h>
#include <Arduino.h>
#include <mbed.h>

#define ANL_WR_LEN 12         // defines the bit length to set the ADC conversion to. Specific Arduino board types have different limits limit.
#define PWM_STEPS 4095        // should be set to (2^ANL_WR_LEN - 1)
#define PWM_MAX_CHG 40        // set to the max PWM steps to change per loop length. Make larger to make bot more responsive. This is to preven current surges and smooth operation.
#define MIN_PWM 75            // the minimum PWM to set the bot to.  Should be above the typical stall PWM
#define MAX_PWM 1000          // the maximum PWM to allow the bot to go.  Should be <= PWM_STEPS.
#define MAX_STICK_MAG 255     // Set to the maximum joystick value the joystick will present.
#define ERR_HI_WATER 1000     // The max number of errors to count in an error counter
#define COMM_MISS_MAX 10      // The max number of loop intervals with no comm before motion auto motion shutdown. This is high but was set high due to issues seen.
#define LOOP_DLY_MS 20        // The number of msec delay for control loop; (NOTE: loop execution increases loop time [ideally this would be eliminated])
#define COMM_CHECK_VAL 10000  // The value the joystick magnitude, angle, and checksum must equal to be valid
#define PWM_FREQ 15000        // The PWM frequency to drive the motor
#define PWM_PERIOD_US 67      // set the PWM frequency to this or approximately 15kHz


// the following static table is used to allow a table lookup for a 0 to 90 (integer) and the code can addjust the sign of the results to get 0 to 360 degree sine or cosine results
static const float SIN_TABLE[91] = {
  0.000000, 0.017452, 0.034899, 0.052336, 0.069756, 0.087156, 0.104528, 0.121869, 0.139173, 0.156434,
  0.173648, 0.190809, 0.207912, 0.224951, 0.241922, 0.258819, 0.275637, 0.292372, 0.309017, 0.325568,
  0.342020, 0.358368, 0.374607, 0.390731, 0.406737, 0.422618, 0.438371, 0.453990, 0.469472, 0.484810,
  0.500000, 0.515038, 0.529919, 0.544639, 0.559193, 0.573576, 0.587785, 0.601815, 0.615661, 0.629320,
  0.642788, 0.656059, 0.669131, 0.681998, 0.694658, 0.707107, 0.719340, 0.731354, 0.743145, 0.754710,
  0.766044, 0.777146, 0.788011, 0.798636, 0.809017, 0.819152, 0.829038, 0.838671, 0.848048, 0.857167,
  0.866025, 0.874620, 0.882948, 0.891007, 0.898794, 0.906308, 0.913545, 0.920505, 0.927184, 0.933580,
  0.939693, 0.945519, 0.951057, 0.956305, 0.961262, 0.965926, 0.970296, 0.974370, 0.978148, 0.981627,
  0.984808, 0.987688, 0.990268, 0.992546, 0.994522, 0.996195, 0.997564, 0.998630, 0.999391, 0.999848,
  1.000000
};


// const float pwm_freq = PWM_FREQ;
const int pwm_freq = PWM_FREQ;

// hardware pin useage definitions for the HW implementation
const uint8_t MTR_R_INA = 6;      // Right Motor Direction A
const uint8_t MTR_R_INB = 4;      // Right Motor Direction B
const uint8_t MTR_R_PWM = 3;      // Right Motor PWM (must support PWM)
const int MTR_R_CS = A3;          // Right Motor Current Sense

const uint8_t MTR_R_QUAD_A = 10;  // Right Motor Quadrature Input A
const uint8_t MTR_R_QUAD_B = 9;   // Right Motor Quadrature Input A

const uint8_t MTR_L_INA = 8;      // Left Motor Direction A
const uint8_t MTR_L_INB = 7;      // Left Motor Direction B
const uint8_t MTR_L_PWM = 5;      // Left Motor PWM (must support PWM)
const int MTR_L_CS = A1;          // Left Motor Current sense

const uint8_t MTR_L_QUAD_A = 12;  // Right Motor Quadrature Input A
const uint8_t MTR_L_QUAD_B = 11;  // Right Motor Quadrature Input A


const int IR_1 = A2;              // IR 1 sensor input
const uint8_t IR_2 = 1;           // IR 2 sensor input
const uint8_t IR_3 = 2;           // IR 3 sensor input
const uint8_t IR_4 = 0;           // IR 4 sensor input
const int IR_5 = A3;              // IR 5 sensor input


// variables and value initialization for current reading
const float ADC_REF_V = 3.3;      // ADC reference voltage (5V on most Unos)
const int ADC_LEN = 10;           // Variable to the ADC bit length
const float ADC_COUNTS = 1023.0;  // 12-bit ADC
const float CS_V_PER_A = 0.140;   // ~140 mV/A per VNH5019 datasheet (0.140 V/A)

int speed_target_r = 0;             // holds the calculated speed (for now actually PWM) target for the right wheel
int speed_target_l = 0;             // holds the calculated speed (for now actually PWM) target for the left wheel
int last_speed_r = 0;               // holds the last spped (actually PWM) sent to the right motor driver part
int last_speed_l = 0;               // holds the last spped (actually PWM) sent to the left motor driver part
int max_pwm_chg = PWM_MAX_CHG;      // the variable that contains the max PWM change per loop
int stick_magnitude = 0;            // contains the last value received from the wireless joystick for joystick magnitude
int stick_angle = 0;                // contains the last value received from the wireless joystick for joystick angle
int stick_checksum = 0;             // integer error checksum to validate joystick comm magnitude + angle + checksum must = COMM_CHECK_VAL
int magnitude = 0;                  // the last PWM magnitude requested by the joystick after correcrted for motor PWM range
int pwm_range = MAX_PWM - MIN_PWM;  // the calcualted range of PWM setting that will be sent to the motor driver
int message_errors = 0;             // variable to keep track of the number of total packet errors count stopped at ERR_HI_WATER
int consec_comm_miss = 0;           // variable that keeps track of the consecutive misses
int in_comm_loss = 0;               // variable indicating when comm packets should be ignored integrates in and out of this state

char ssid[] = "ArduinoJoystick";    // defines the SSID for the UDP wireless communictions [NOTE: if multiple bots wireless controlled these need to be unique for each bot]
char pass[] = "joystick123";        // defines the connection password  

WiFiUDP Udp;
unsigned int localUdpPort = 2390;

//mbed::PwmOut pwm(digitalPinToPinName(D9))
mbed::PwmOut mtr_r_pwm(digitalPinToPinName(MTR_R_PWM));
mbed::PwmOut mtr_l_pwm(digitalPinToPinName(MTR_L_PWM));

void setup() {
  Serial.begin(9600);
  //  while (!Serial);

  Serial.println("Connecting to access point...");
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to AP!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  Udp.begin(localUdpPort);
  Serial.println("Listening for UDP packets...");

// define the pin usage
// first set up the frequence an original duty cycle of the PWM signals
  mtr_r_pwm.period_us(PWM_PERIOD_US);
  mtr_r_pwm.write(0.0f);
  mtr_l_pwm.period_us(PWM_PERIOD_US);
  mtr_l_pwm.write(0.0f);
// right motor pins
  pinMode(MTR_R_INA, OUTPUT);
  pinMode(MTR_R_INB, OUTPUT);
  pinMode(MTR_R_CS, INPUT);

// left motor pins
  pinMode(MTR_L_INA, OUTPUT);
  pinMode(MTR_L_INB, OUTPUT);
  pinMode(MTR_L_CS, INPUT);

// IR sensor pins
  pinMode(IR_1, INPUT);
  pinMode(IR_2, INPUT);
  pinMode(IR_3, INPUT);
  pinMode(IR_4, INPUT);
  pinMode(IR_5, INPUT);

// Safe startup: motors off, coast
  digitalWrite(MTR_R_INA, LOW);
  digitalWrite(MTR_R_INB, LOW);
  mtr_r_pwm.write(0.0);
  digitalWrite(MTR_L_INA, LOW);
  digitalWrite(MTR_L_INB, LOW);
  mtr_l_pwm.write(0.0f);
}

float sin_deg_int(int deg) {
  if (deg < 0 || deg > 360) {
    exit(EXIT_FAILURE);
  } else if (deg >= 0 && deg <= 90) {
    return SIN_TABLE[deg];
  } else if (deg > 90 && deg <= 180) {
    return SIN_TABLE[180 - deg];
  } else if (deg > 180 && deg <= 270) {
    return -SIN_TABLE[deg - 180];
  } else {
    return -SIN_TABLE[360 - deg];
  }
}


void setMotor(int speed_r, int speed_l) {
  speed_r = constrain(speed_r, -PWM_STEPS, PWM_STEPS);
  speed_l = constrain(speed_l, -PWM_STEPS, PWM_STEPS);

// NOTE this code is written with the assumption that the motor phase polarity is reversed between the right and left motor as they are mounted 180 degrees different
// Be aware if the quadrature code is enabled in the future there was not thought of swapping them so the direction would look wrong for one motor

// right motor speed control  [NOTE: may consider in the future disabling interrupts briefly here to prevent a right motor adjustment and a delayed left motor adjustment]
  if (speed_r == 0) {                       // have this if statement in case we want to dynamic brake the bot on 0 PWM
    speed_r = speed_r;                      // a throw away statement for now to keep if statement for 0 PWM
  } else if (speed_r > 0) {
    digitalWrite(MTR_R_INA, LOW);           //  if motor speed is positive enable motor and set direction
    digitalWrite(MTR_R_INB, HIGH);
  } else {
    digitalWrite(MTR_R_INA, HIGH);          // motor speed is negative enable motor and set direction
    digitalWrite(MTR_R_INB, LOW);
  }

  mtr_r_pwm.write(float(abs(speed_r)/PWM_STEPS));     // Set the PWM for the right motor

  if (speed_l == 0) {                       // have this if statement in case we want to dynamic brake the bot on 0 PWM
    speed_l = speed_l;                      // a throw away statement for now to keep if statement for 0 pwm
  }

  else if (speed_l > 0) {
    digitalWrite(MTR_L_INA, LOW);           //  if motor speed is positive enable motor and set direction
    digitalWrite(MTR_L_INB, HIGH);
  } else {
    digitalWrite(MTR_L_INA, HIGH);          // motor speed is negative enable motor and set direction
    digitalWrite(MTR_L_INB, LOW);
  }

  mtr_l_pwm.write(float(abs(speed_l)/PWM_STEPS));     // Set the PWM for the left motor
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

void loop() {
  int packetSize = Udp.parsePacket();  // try to grap a packet

  if (consec_comm_miss >= COMM_MISS_MAX) {  // code to stop the bot motion if the consecutive number attempts to read a valid wireless control message fail
    in_comm_loss = 1;                       // if the attempt threshold has been hit set the flag indicating such [note this can be cleared if this time a valid command rcvd]
    consec_comm_miss = COMM_MISS_MAX;       // cap the number of consecutive failed attempts to get a packet from the joystick to the miss threshold
  }

  ++consec_comm_miss;  // assume there will not be a valid joystick comm this loop will be decremented below if there is

  if (packetSize) {  // chedk to see if a joystick control packet is ready to read [yes if non zero packetSize]
                     //    Serial.println("comm point 1");
    char packetBuffer[255];
    int len = Udp.read(packetBuffer, 255);  // get the UDP packet rcvd into the packetBuffer char array
    packetBuffer[len] = 0;                  // place the NULL character at the end of the rcvd packet

    // Parse the received string
    // The control packet is comprised of ascii characeter, 3 fields deliminated by commas
    // the first field is the integer magnitude of the stick.  This can be thought of as an absolute number
    // the second number is an anger... OK this is really the joystick expressed in polar coordinates
    // the third number is a simple checksum.  The magnitude and the angle need to add up to COMM_CHECK_VAL [note if the joystick moves to a higher magnitude this checksum may need to be changed]
    String dataString = String(packetBuffer);
    int FirstCommaIndex = dataString.indexOf(',');
    if (FirstCommaIndex != -1) {
      int SecondCommaIndex = dataString.indexOf(',', FirstCommaIndex + 1);
      if (SecondCommaIndex != -1) {
        String mag_string = dataString.substring(0, FirstCommaIndex);
        String ang_string = dataString.substring(FirstCommaIndex + 1, SecondCommaIndex);
        String check_string = dataString.substring(SecondCommaIndex + 1);
        stick_magnitude = mag_string.toInt();
        stick_angle = ang_string.toInt();
        stick_checksum = check_string.toInt();
        // The next if checks to see that packet from the joystick has parameters in the proper range and with a valad checksum.
        if (stick_magnitude >= 0 && stick_magnitude <= MAX_STICK_MAG && stick_angle >= 0 && stick_angle <= 360 && (stick_magnitude + stick_angle + stick_checksum) == COMM_CHECK_VAL) {
          //          Serial.println("comm point 3");
          consec_comm_miss = 0;      // clear the number of loops where a valid comm message was not received because a good packet was just rcvd
          in_comm_loss = 0;          // make sure the in communication loss state indicater cleared
          if (stick_angle == 360) {  // make 360 degree polar to the equivalent 0
            stick_angle = 0;
          }
          if (stick_magnitude == 0) {  // if the joystick magnitude is 0 set the right and left motors to 0 PWM
            speed_target_r = 0;
            speed_target_l = 0;
            magnitude = 0;
          } else {
            magnitude = (float)pwm_range * (float)stick_magnitude / MAX_STICK_MAG;  // not zero magnitude from joystick then convert the joy stick amplitude to the level to be sent to motor drivers
            magnitude = magnitude + MIN_PWM;                                        // the magnitude is relative to the MIN_PWM [thought to be the stall current]

            // now with PWM target determined by definitions for this board and motor drivers, now aportion the magnitude based on the joystick angle


            if (stick_angle >= 10 && stick_angle <= 90) {                           // this if statement code for quadrant 1 (straight to forward turning right)
              speed_target_l = magnitude;
              speed_target_r = (int)((float)magnitude * sin_deg_int(stick_angle));
            } else if (stick_angle >= 90 && stick_angle <= 170) {                   // this if statement code for quadrant 2 (straight to forward turning left)
              speed_target_r = magnitude;
              speed_target_l = (int)((float)magnitude * sin_deg_int(stick_angle));
            } else if (stick_angle >= 190 && stick_angle <= 270) {                  // this if statement code for quadrant 3 (reverse to reverse turning left)
              speed_target_r = -magnitude;
              speed_target_l = (int)((float)magnitude * sin_deg_int(stick_angle));
            } else if (stick_angle >= 270 && stick_angle <= 350) {                  // this if statement code for quadrant 4 (reverse to reverse turning right)
              speed_target_l = -magnitude;
              speed_target_r = (int)((float)magnitude * sin_deg_int(stick_angle));
            } else if (stick_angle < 10 || stick_angle > 350) {                     // this if statement code for spinning clockwise
              speed_target_r = -magnitude;
              speed_target_l = magnitude;
            } else {                                                                // this if statement code for spinning counterclockwise
              speed_target_r = magnitude;  
              speed_target_l = -magnitude;
            }
          }
        }
      }
    }
  } else {
    //    Serial.println("no packet available");
  }

  if (in_comm_loss != 0) {  // if in comm loss state shutdown motion
    Serial.println("rcvr comm loss");
    speed_target_r = 0;
    speed_target_l = 0;
  }

  if (speed_target_r == 0 && speed_target_l == 0) {  // if the speed target for both motors is 0 don't move toward 0 drive, but shut 'em down amy be about to crash
    last_speed_r = 0;
    last_speed_l = 0;
  }

  // this block of code moves from the target speed set by the last valid joystick read (unless a comm loss time out) and moves
  // a limited about each loop.  Unless the target speed went to 0.  (no slow movement toward that)
  // the last_speed_r/l variables are the last PWM sent to the motor driver for r/l motor
  // the last_speed_r/l is moved a maximum of max_pwm_chg per loop time to match the latest speed_target_r/l

  else {
    if (last_speed_r > speed_target_r) {
      last_speed_r = last_speed_r - max_pwm_chg;
      if (last_speed_r < speed_target_r) {
        last_speed_r = speed_target_r;
      }
    } else if (last_speed_r < speed_target_r) {
      last_speed_r = last_speed_r + max_pwm_chg;
      if (last_speed_r > speed_target_r) {
        last_speed_r = speed_target_r;
      }
    }
    if (last_speed_l > speed_target_l) {
      last_speed_l = last_speed_l - max_pwm_chg;
      if (last_speed_l < speed_target_l) {
        last_speed_l = speed_target_l;
      }
    } else if (last_speed_l < speed_target_l) {
      last_speed_l = last_speed_l + max_pwm_chg;
      if (last_speed_l > speed_target_l) {
        last_speed_l = speed_target_l;
      }
    }
  }

  /*
  Serial.print(stick_magnitude);
  Serial.print(",");
  Serial.print(stick_angle);
  Serial.print(",");
  Serial.print(magnitude);
  Serial.print(",");
  Serial.print(speed_target_r);
  Serial.print(",");
  Serial.print(speed_target_l);
  Serial.print(",");
  Serial.print(last_speed_r);
  Serial.print(",");
  Serial.println(last_speed_l);
*/

  setMotor(last_speed_r, last_speed_l);

  delay(LOOP_DLY_MS);
}
