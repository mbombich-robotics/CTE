// *************************************************************************************
// *******   Arduino Wirelss Joystick Controller                                 *******
// *******   File: wireless_joystick.ino                                         *******
// *******   Orignial Programmer: T Puvogel                                      *******
// *******   Orginal Date: Aug. 23, 2025                                         *******
// *******                                                                       *******
// *******   Started as a demonstration of controlling a basic robot prototype   *******
// *******   For the new Vicksburg High School Robotics class                    *******
// *******                                                                       *******
// *******   Original Components used: Arduino UNO R4 WiFi                       *******
// *******                             HiLetgo Gamepad Joystick Shield           *******
// *************************************************************************************
// *******         Release: V1.0                                                 *******
// *******            Date: 09-01-2025                                           *******
// *******          Author: Tom Puvogel                                          *******
// *******         Summary: Original Release                                     *******
// *******                                                                       *******
// *******  Program reads the analog input of the X and Y inputs from a joy-     *******
// *******  stick device and changes them into polar coordinates, a magnitude    *******
// *******  and an angle.  There is a dead band associated with the magnitude    *******
// *******  of the polar coordinate.  Anything less than the DEADBAND value is   *******
// *******  set to the a magnitude and angle of 0.  for any magnitude greater    *******
// *******  than the DEADBAND is then scaled bewteen 0 and the MAX_DRV_VALUE.    *******
// *******  It is important that the device recieving the joystick info has      *******
// *******  the same max magnitude setting.  The joystick also sends a pseudo    *******
// *******  checksum such that the addition of the magnitude and the angle and   *******
// *******  the checksum integer all equal the defined COMM_CHECK_VAL.           *******
// *******  For a manitude of 200 at and angle of 245, the string set with comma *******
// *******  delimites would be "200,24,9776"                                     *******
// *******    *******
// *******  When the joystick first powers on it requires being calibrated.      *******
// *******                                                                       *******
// *******  IMPORTANT When the joystick first powers up it takes a X and Y       *******
// *******  reading and these first readings become the joysticks calibrated     *******
// *******  center point. Finish the calibraton by manually moving the joystick  *******
// *******  to the 0, 90, 180 and 270 positions and while holding there          *******
// *******  depressing the corresponding position button on the shield.  The     *******
// *******  Order of position calibrations does not matter. A position can be    *******
// *******  redone until the calibratrion is complete.  The cal cyle is          *******
// *******  complete when the stick is returned to the DEADBAND after each cal   *******
// *******  position has been done at least once.                                *******
// *************************************************************************************



#include <WiFiS3.h>
#include <WiFiUdp.h>
#include <stdlib.h>

// *******  Physical Configuratioin Definitions   *******

#define PIN_ANALOG_X 0            // Analog pin for the X-axis
#define PIN_ANALOG_Y 1            // Analog pin for the Y-axis
#define XCTR_YUP_BTN 2            // The joystick button in the up-center position
#define XCTR_YDN_BTN 4            // The joystick button in the down-center position
#define XRT_YCTR_BTN 3            // The joystick button in the center-right position
#define XLFT_YCTR_BTN 5           // The joystick button in the center-left position
#define ADC_LEN 12                //  Congiguration of the length of the microcontollers ADC coversiions
#define COMM_CHECK_VAL 10000      // The value the joystick magnitude, angle, and checksum must equal to be valid

// *******  Program Definitions   *******

#define DEADBAND 55       // If trigger magnitude is under this value send 0 speed and 0 angle
#define MAX_DRV_VALUE 255 // The maximum drive vaule the joystick will send out
#define MAX_DRV_FLOAT 255.0 // The maximum drive vaule the joystick will send out

// define the structure for holding the polar coordinates in float
struct Polar {
  float r;       // radius (length), >= 0
  float thetaDeg; // angle in degrees, [0, 360)
};

// *******  Shared Variable Declarations/Initializations   *******
int x_center = -1;        // contains the calibrated no pressure X center position of joystick
int y_center = -1;        // contains the calibrated no pressure Y center position of joystick
int x_full_right = -1;    // contains the calibrated full right X position of the joystick
int x_full_left = -1;     // contains the calibrated full left X position of the joystick
int y_full_up = -1;       // contains the calibrated full up Y position of the joystick
int y_full_dwn = -1;      // contains the calibrated full down position of the joystick
int cal_done = 0;         // indicates when the calibration of joystick is done (when value is one)
int stick_mag = 0;        // contains the value of magnitude of the joystick to be sent via WiFi
int stick_agl = 0;        // contains the value of angle of the joystick to be sent via WiFi
int stick_x_val = 0;      // holds the analog reading of the X valy of the joystick
int stick_y_val = 0;      // holds the analog reading of the X valy of the joystick
int act_fwd_thrtl_rng;    // holds the value of the active range of the forward throttle
int act_rev_thrtl_rng;    // holds the value of the active range of the forward throttle
int stick_checksum = 0;   // integer error checksum to validate joystick comm magnitude + angle + checksum must = COMM_CHECK_VAL



char ssid[] = "ArduinoJoystick";
char pass[] = "joystick123";
int status = WL_IDLE_STATUS;

Polar cartesianToPolar(int x, int y) {
  Polar p;

  // Radius (always non-negative). hypotf is accurate & avoids overflow in intermediate steps
  p.r = hypotf((float)x, (float)y);

  if (p.r == 0.0f) {
    // Angle is undefined at the origin; choose 0 by convention
    p.thetaDeg = 0.0f;
    return p;
  }

  // atan2f returns radians in [-pi, pi]; convert to degrees and normalize to [0, 360)
  float thetaRad = atan2f((float)y, (float)x);
  float thetaDeg = thetaRad * 180.0f / PI;

  // Normalize: ensure 0 <= theta < 360
  if (thetaDeg < 0.0f) {
    thetaDeg += 360.0f;
  }
  // If desired, clamp 360 back to 0 (rare float edge case)
  if (thetaDeg >= 360.0f) {
    thetaDeg -= 360.0f;
  }

  p.thetaDeg = thetaDeg;
  return p;
}

WiFiUDP Udp;
IPAddress remoteIP(192, 168, 4, 255); // Broadcast address for the AP

void setup() {
  analogReadResolution(ADC_LEN);
  // set up the input buttons with pullups
  pinMode(XCTR_YUP_BTN, INPUT_PULLUP);      // the joystick top center button
  pinMode(XCTR_YDN_BTN, INPUT_PULLUP);      // the joystick bottom center button
  pinMode(XRT_YCTR_BTN, INPUT_PULLUP);      // the joystick center right button
  pinMode(XLFT_YCTR_BTN, INPUT_PULLUP);     // the joystick center left button

  Serial.begin(9600);
//  while (!Serial);

  // Set the UNO R4 as a Wi-Fi Access Point
//  Serial.print("Creating access point named: ");
//  Serial.println(ssid);
  delay(50);    // delay put in just to give the Auduino parts that have setup time some time to do so

  // setup/initialize the WiFi adapter
  status = WiFi.beginAP(ssid, pass);
  if (status != WL_AP_LISTENING) {
    Serial.println("Creating AP failed");
    while (1);
  }

  // Set the UDP port
  Udp.begin(2390);
  Serial.println("UDP server started");
  Serial.print("AP IP address: ");
  Serial.println(WiFi.localIP());

//  These analog reading on startup set the joystick middle position
  x_center = analogRead(PIN_ANALOG_Y);      // on start up joystick should be untouched and the X center position is set
  y_center = analogRead(PIN_ANALOG_Y);      // on start up joystick should be untouched and the Y center position is set

}

void loop() {
  stick_x_val = analogRead(PIN_ANALOG_X);             // get the raw ADC joystick pin readings
  stick_y_val = analogRead(PIN_ANALOG_Y);

  if (cal_done != 1) {                                          // If full stick cal not complete after startup run this  block of code
    if (digitalRead(XCTR_YUP_BTN) == LOW) {                     // execute this if body when the YDN (90 degree cal) button is pressedexecute this if statement body if the YUP button (90 degree cal) button is pressed
      y_full_up = stick_y_val;                                  // set the unadjusted for actual center Y max up ADC reading
      act_fwd_thrtl_rng = y_full_up - y_center - DEADBAND;      // set the active fwd throttle range
      Serial.println("YUP");
    }
    else if (digitalRead(XCTR_YDN_BTN) == LOW) {                // execute this else if body when the YDN (270 degree cal) button is pressed
      y_full_dwn = stick_y_val;                                 // set the unadjusted for actual center Y min ADC reading
      act_rev_thrtl_rng = y_center - y_full_dwn - DEADBAND;     // set the active rev throttle range
      Serial.println("YDWN");
    }
    else if (digitalRead(XRT_YCTR_BTN) == LOW) {                // execute this else if body when the YDN (270 degree cal) button is pressed
      x_full_right = stick_x_val;                               // set the unadjusted for actual center X full right ADC reading
      Serial.println("XRHT");
    }
    else if (digitalRead(XLFT_YCTR_BTN) == LOW) {               // execute this if statement body if the UUP (90 degree cal) button is pressed
      x_full_left = stick_x_val;                                // write the unadjusted for actual center X  full left ADC reading
      Serial.println("XLFT");
    }
    else if (y_full_up != -1 && y_full_dwn != -1 && x_full_right != -1 && x_full_left != -1) {  // check to see all min/max values for the X/Y axis are done
      if (abs(stick_x_val - x_center) < DEADBAND && abs(stick_y_val - y_center) < DEADBAND) {   // If axis are done see if joystic returned to the center area
        cal_done = 1;                                                                           // Set calibration as done so joystick can start broadcasting real values
      }
    }
    stick_mag = 0;                                  // If here calibration is not done and the stick magnitude and
    stick_agl = 0;                                  // and angle are forced to 0 for sending out
  }
  else {

    Polar p = cartesianToPolar((stick_x_val - x_center),  (stick_y_val-y_center));  // find the X/y to polar conversion after adjusting for calibrated center
    stick_mag = (int)p.r;
    stick_agl = (int)p.thetaDeg;
  }
/*
  Serial.print(x_full_left);
  Serial.print(",");
  Serial.print(y_full_dwn);
  Serial.print(",");
  Serial.print(x_full_right);
  Serial.print(",");
  Serial.print(y_full_up);
  Serial.print(",");
  Serial.print(x_center);
  Serial.print(",");
  Serial.print(y_center);
  Serial.print(",");
  Serial.print((stick_x_val-x_center));
  Serial.print(",");
  Serial.print((stick_y_val-y_center));
  Serial.print(",");
  Serial.print(stick_mag);
  Serial.print(",");
  Serial.print(stick_agl);
  Serial.print(",");
 */
 
  if (stick_mag < DEADBAND) {           // if the stick magnitude is less then the DEADBAND definition force stick_mag and stick_agl to 0
    stick_mag = 0;
    stick_agl = 0;
  }
  else if (stick_agl >= 0 && stick_agl <= 180) {  // for the forward drive direction calculate stick_mag with y_full_up/range correction
    if (stick_mag >= (y_full_up - y_center)) {    // stick_mag can get too big due to poor quality joystick
      stick_mag = MAX_DRV_VALUE;                  // correct for it if neccessary
    }
    else {
      stick_mag = (int)((((float)stick_mag - DEADBAND)/(float)act_fwd_thrtl_rng) * MAX_DRV_FLOAT);
    }
  }
  else {                                          // for the reverse drive direction calculate stick_mag with y_full_dwn/range correction
    if (stick_mag >= (y_center - y_full_dwn)) {   // stick_mag can get too big due to poor quality joystick
      stick_mag = MAX_DRV_VALUE;                  // correct for it if neccessary
    }
    else {
       stick_mag = (int)((((float)stick_mag - DEADBAND)/(float)act_rev_thrtl_rng) * MAX_DRV_FLOAT);
    }
  }
  // Create a data string to send out
  stick_checksum = COMM_CHECK_VAL - stick_mag - stick_agl;                                          // caculate the pseudo checksum
  String dataString = String(stick_mag) + "," + String(stick_agl) + "," + String(stick_checksum);   // build the text string
//  Serial.println(dataString);
  // Begin sending the UDP packet
  Udp.beginPacket(remoteIP, 2390);
  Udp.print(dataString);
  Udp.endPacket();




  delay(10); // Small delay to avoid flooding the network
}

