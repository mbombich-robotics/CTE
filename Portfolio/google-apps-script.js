/**
 * Robotics Portfolio - Google Apps Script Backend
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete the default code and paste this entire file
 * 4. Save the project (give it a name like "Robotics Portfolio Backend")
 * 5. Click "Deploy" > "New deployment"
 * 6. Select "Web app" as the type
 * 7. Set "Execute as" to "Me"
 * 8. Set "Who has access" to "Anyone" (or "Anyone with Google account" for more security)
 * 9. Click "Deploy" and authorize when prompted
 * 10. Copy the Web App URL and paste it into app.js CONFIG.SHEETS_API_URL
 *
 * The script will automatically create the necessary sheets on first run.
 */

// ============================================
// CONFIGURATION
// ============================================
const BACKEND_VERSION = 'v2.10.1';

// Shared secret — must match CONFIG.TEACHER_TOKEN in teacher-portal.js
const TEACHER_TOKEN = 'rp-portal-teach-2026';

const SHEET_NAMES = {
  STUDENTS: 'Students',
  REFLECTIONS: 'Weekly Reflections',
  DELIVERABLES: 'Deliverables',
  EVIDENCE: 'Evidence',
  CONFIG: 'Config',
  LOG: 'Activity Log',
  QUIZ: 'Quiz'
};

// ============================================
// AI TUTOR — LESSON CONFIGS
// Each lesson defines: unit info, step sequence (with gate questions),
// and the confidential target code the AI uses to guide students.
// To add a new unit: copy the 'unit5_motors' block and fill in the fields.
// ============================================
const TUTOR_LESSONS = {
  // TODO: unit5_motors steps and targetCode need rewriting for Pico 2W / MicroPython
  'unit5_motors': {
    unit: 'Unit 4 — Programming, Electronics & Sensors',
    title: 'Robot Motor Control Library',
    board: 'Raspberry Pi Pico 2W',
    language: 'MicroPython',
    objective: 'Build a complete motor control library for the class robot from scratch, one function at a time. By the end you will have a working sketch with forward, backward, stop, pivot, distance sensing, encoder tracking, and closed-loop straight driving.',
    steps: [
      { title: 'Declare pin constants',
        detail: 'Define all motor, encoder, ultrasonic, servo, and IR sensor pins as const uint8_t variables at the top of the sketch, before setup().',
        gateQuestion: 'What is const uint8_t and why use it instead of writing the number 6 directly in your code everywhere?' },
      { title: 'Configure pinMode in setup()',
        detail: 'Call pinMode() for each motor direction pin (OUTPUT) and each encoder pin (INPUT_PULLUP).',
        gateQuestion: 'What happens at runtime if you forget to call pinMode for an output pin? Test it.' },
      { title: 'Write driveForward(speed)',
        detail: 'A function that sets the INA/INB direction pins and calls analogWrite on both PWM pins to drive both motors forward.',
        gateQuestion: 'What is the valid range for the speed parameter? What does analogWrite do with a value outside 0–255?' },
      { title: 'Write driveBackward(speed)',
        detail: 'Same structure as driveForward but with direction pins reversed for both motors.',
        gateQuestion: 'What is the only thing that changes between driveForward and driveBackward?' },
      { title: 'Write stopMotors()',
        detail: 'Cut power to both motors completely — both direction pins LOW, both PWM pins 0.',
        gateQuestion: 'What is the difference between stopping by setting both direction pins LOW vs just setting PWM to 0? Try both.' },
      { title: 'Write pivotLeft() and pivotRight()',
        detail: 'Spin the robot in place by driving one wheel forward and the other backward.',
        gateQuestion: 'What is the difference between a pivot turn and an arc turn? When is each useful?' },
      { title: 'Write readDistance()',
        detail: 'Fire a 10 µs ultrasonic pulse on the TRIG pin and measure the echo duration to return distance in centimeters.',
        gateQuestion: 'The formula divides the echo duration by 58. Where does 58 come from — what physics is behind it?' },
      { title: 'Add encoder variables and ISRs',
        detail: 'Declare two volatile long variables for encoder counts, write ISR functions that increment them, and attach them with attachInterrupt() on RISING edge of channel A.',
        gateQuestion: 'Why must encoder count variables be declared volatile? What happens to the program if you forget?' },
      { title: 'Write driveStraight() with P-controller',
        detail: 'Drive forward a target number of encoder ticks. Use a proportional error term (left ticks minus right ticks) to trim the faster motor down and the slower motor up.',
        gateQuestion: 'What happens if KP is too high? Too low? How would you tune it on the real robot?' }
    ],
    targetCode: `// VHS Robotics — Master Codebase for Arduino Nano RP2040 Connect
// Motor driver: L298N-style (INA/INB direction + PWM speed)

#include <Servo.h>
#include <Arduino.h>

#undef A4
#define A4 18

// PIN MAP
const uint8_t MTR_R_INA    = 6;
const uint8_t MTR_R_INB    = 4;
const uint8_t MTR_R_PWM    = 3;
const uint8_t MTR_R_QUAD_A = 9;
const uint8_t MTR_R_QUAD_B = 10;
const uint8_t MTR_L_INA    = 8;
const uint8_t MTR_L_INB    = 7;
const uint8_t MTR_L_PWM    = 5;
const uint8_t MTR_L_QUAD_A = 11;
const uint8_t MTR_L_QUAD_B = 12;
const uint8_t USONIC_TRIG  = 15;
const uint8_t USONIC_ECHO  = 13;
const uint8_t SCAN_SERVO_PIN    = A4;
const uint8_t GRIPPER_SERVO_PIN = 19;
const uint8_t IR_1 = A2;
const uint8_t IR_2 = 0;
const uint8_t IR_3 = 2;
const uint8_t IR_4 = 1;
const uint8_t IR_5 = A3;
const uint8_t MTR_R_CS = A3;
const uint8_t MTR_L_CS = A1;

// ENCODER GLOBALS
volatile long encoderRight = 0;
volatile long encoderLeft  = 0;
void rightEncoderISR() { encoderRight++; }
void leftEncoderISR()  { encoderLeft++;  }

// TUNING
const int   BASE_SPEED   = 150;
const int   TURN_SPEED   = 180;
const long  TICKS_PER_CM = 20;
const float STRAIGHT_KP  = 2.0;

void setup() {
  Serial.begin(115200);
  while (!Serial && millis() < 3000);
  pinMode(MTR_R_INA, OUTPUT); pinMode(MTR_R_INB, OUTPUT); pinMode(MTR_R_PWM, OUTPUT);
  pinMode(MTR_L_INA, OUTPUT); pinMode(MTR_L_INB, OUTPUT); pinMode(MTR_L_PWM, OUTPUT);
  pinMode(MTR_R_QUAD_A, INPUT_PULLUP); pinMode(MTR_R_QUAD_B, INPUT_PULLUP);
  pinMode(MTR_L_QUAD_A, INPUT_PULLUP); pinMode(MTR_L_QUAD_B, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(MTR_R_QUAD_A), rightEncoderISR, RISING);
  attachInterrupt(digitalPinToInterrupt(MTR_L_QUAD_A), leftEncoderISR,  RISING);
  pinMode(USONIC_TRIG, OUTPUT); pinMode(USONIC_ECHO, INPUT);
  digitalWrite(USONIC_TRIG, LOW);
  stopMotors();
}

void loop() {
  driveStraight(BASE_SPEED, 50 * TICKS_PER_CM);
  stopMotors();
  delay(2000);
}

void driveStraight(int speed, long targetTicks) {
  noInterrupts(); encoderLeft = 0; encoderRight = 0; interrupts();
  while (true) {
    long L, R;
    noInterrupts(); L = encoderLeft; R = encoderRight; interrupts();
    if (L >= targetTicks || R >= targetTicks) break;
    long error = L - R;
    int leftSpeed  = constrain(speed - (int)(STRAIGHT_KP * error), 0, 255);
    int rightSpeed = constrain(speed + (int)(STRAIGHT_KP * error), 0, 255);
    setMotorSpeeds(leftSpeed, rightSpeed);
    delay(10);
  }
  stopMotors();
}

void setMotorSpeeds(int leftSpeed, int rightSpeed) {
  digitalWrite(MTR_L_INA, LOW); digitalWrite(MTR_L_INB, HIGH);
  analogWrite(MTR_L_PWM, constrain(leftSpeed, 0, 255));
  digitalWrite(MTR_R_INA, LOW); digitalWrite(MTR_R_INB, HIGH);
  analogWrite(MTR_R_PWM, constrain(rightSpeed, 0, 255));
}

void driveForward(int speed) { setMotorSpeeds(speed, speed); }

void driveBackward(int speed) {
  digitalWrite(MTR_L_INA, HIGH); digitalWrite(MTR_L_INB, LOW);
  analogWrite(MTR_L_PWM, constrain(speed, 0, 255));
  digitalWrite(MTR_R_INA, HIGH); digitalWrite(MTR_R_INB, LOW);
  analogWrite(MTR_R_PWM, constrain(speed, 0, 255));
}

void pivotLeft(int speed) {
  digitalWrite(MTR_L_INA, HIGH); digitalWrite(MTR_L_INB, LOW);
  analogWrite(MTR_L_PWM, constrain(speed, 0, 255));
  digitalWrite(MTR_R_INA, LOW);  digitalWrite(MTR_R_INB, HIGH);
  analogWrite(MTR_R_PWM, constrain(speed, 0, 255));
}

void pivotRight(int speed) {
  digitalWrite(MTR_L_INA, LOW);  digitalWrite(MTR_L_INB, HIGH);
  analogWrite(MTR_L_PWM, constrain(speed, 0, 255));
  digitalWrite(MTR_R_INA, HIGH); digitalWrite(MTR_R_INB, LOW);
  analogWrite(MTR_R_PWM, constrain(speed, 0, 255));
}

void stopMotors() {
  digitalWrite(MTR_L_INA, LOW); digitalWrite(MTR_L_INB, LOW); analogWrite(MTR_L_PWM, 0);
  digitalWrite(MTR_R_INA, LOW); digitalWrite(MTR_R_INB, LOW); analogWrite(MTR_R_PWM, 0);
}

long readDistance() {
  digitalWrite(USONIC_TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(USONIC_TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(USONIC_TRIG, LOW);
  long duration = pulseIn(USONIC_ECHO, HIGH, 30000);
  if (duration == 0) return 0;
  return duration / 58;
}`
  }
  ,
  // TODO: battle_royale uses WiFiNINA (Arduino-specific) — needs rewriting for Pico 2W / MicroPython network module
  'battle_royale': {
    unit: 'Unit 4 — Programming, Electronics & Sensors',
    title: 'Battle Royale Tilt Controller',
    board: 'Raspberry Pi Pico 2W',
    language: 'MicroPython',
    objective: 'Build a WiFi access point on the robot that serves a phone-based tilt controller. The phone browser reads DeviceOrientation (beta/gamma), sends tilt values to /drive every 100 ms, and the robot maps those values to bidirectional motor speeds with a dead zone and exponential response curve.',
    steps: [
      { title: 'Include WiFiNINA, declare server and globals',
        detail: 'Add #include <SPI.h> and #include <WiFiNINA.h>. Define ROBOT_ID and WIFI_PASS macros. Add the A4 undefine/redefine workaround. Declare the six motor pin constants (MTR_R_INA/INB/PWM, MTR_L_INA/INB/PWM). Declare DEAD_ZONE, MAX_TILT, EXPO tuning constants. Declare a WiFiServer on port 80 and a lastCmd unsigned long for the watchdog.',
        gateQuestion: 'Why do we need to #undef A4 and then #define it as 18? What would go wrong if we skipped that step?' },

      { title: 'Write setup(): motor pins, WiFi AP, server.begin()',
        detail: 'In setup(), call Serial.begin(115200). Use pinMode OUTPUT for all six motor pins, then call stopMotors(). Call WiFi.beginAP() with the SSID "Robot-" concatenated with ROBOT_ID and the password. Delay 1000 ms, then call server.begin(). Print the SSID and the AP\'s local IP to Serial.',
        gateQuestion: 'What does WiFi.beginAP() do differently from WiFi.begin()? Why do we want the robot to be the access point rather than connecting to the school Wi-Fi?' },

      { title: 'Read HTTP requests in loop()',
        detail: 'In loop(), call server.available() and return early if no client. Read the first line of the request character-by-character into a String until a newline or timeout (300 ms). Then drain all remaining bytes with client.available()/client.read() so the client buffer is empty before you respond.',
        gateQuestion: 'Why do we stop reading at the first newline? What is in the rest of the HTTP request that we are discarding, and why is it safe to ignore it here?' },

      { title: 'Route requests: /drive, /stop, default',
        detail: 'After reading the request line, use indexOf() to check for "GET /drive", "GET /stop", or neither. For /drive: call extractParam for "fwd" and "turn", call applyTilt, update lastCmd = millis(), and send a 200 OK plain-text response of "OK". For /stop: call stopMotors, clear lastCmd, send 200 OK. For anything else: call serveControlPage(client). Always call client.stop() at the end.',
        gateQuestion: 'What happens if we forget to call client.stop()? Why does the phone need a fast "OK" response on every /drive request rather than the full HTML page?' },

      { title: 'Write extractParam() to parse URL query params',
        detail: 'Write int extractParam(const String& req, const String& key). Find the index of key + "=" in the request string. Starting after the "=", advance an end index while the characters are digits or "-". Return the substring converted with toInt(). Return 0 if the key is not found.',
        gateQuestion: 'The URL looks like /drive?fwd=23&turn=-15. Walk through exactly what extractParam does when called with key "turn" on that string. What would it return?' },

      { title: 'Write applyTilt(): dead zone and normalize to ±1',
        detail: 'Write void applyTilt(int fwd, int turn). First apply the dead zone: if abs(fwd) < DEAD_ZONE set fwd to 0; same for turn. Then normalize each to a float in the range -1.0 to +1.0 by dividing by MAX_TILT and clamping with constrain(). Store as float f and t.',
        gateQuestion: 'What is the purpose of the dead zone? What happens physically on the robot if we remove it and the phone is sitting flat on a desk?' },

      { title: 'Add expo curve and write setMotorsBidi()',
        detail: 'After normalizing, apply the exponential response curve: f = sign(f) * pow(abs(f), EXPO), and same for t. Then compute int spd = f * 255 and int steer = t * 130. Call setMotorsBidi(spd - steer, spd + steer). In setMotorsBidi(int L, int R): constrain both to ±255. For each motor, if the speed is >= 0 write LOW/HIGH to INA/INB (forward); if negative write HIGH/LOW (backward). Call analogWrite with abs(speed).',
        gateQuestion: 'With EXPO = 1.6, how does a 50% tilt (0.5 normalized) compare to a linear response? Why might a gentle center response make the robot easier to control in a crowded gym?' },

      { title: 'Implement the watchdog timer',
        detail: 'At the top of loop(), check: if (lastCmd > 0 && millis() - lastCmd > 600). If true, call stopMotors() and reset lastCmd to 0. This fires if no /drive command arrives within 600 ms.',
        gateQuestion: 'Name three real-world situations where the watchdog would trigger and stop the robot. Why do we check lastCmd > 0 before comparing the elapsed time?' },

      { title: 'Write serveControlPage() — HTML, CSS, and JavaScript',
        detail: 'Write void serveControlPage(WiFiClient& client). Send the HTTP header with Content-Type text/html. Then use multiple client.print(F("...")) calls to send the page in chunks (F() macro keeps strings in flash, not RAM). The page needs: a visual tilt indicator dot in a circular arena, a status div, and an "Enable Tilt" button (iOS only). The JavaScript must: (1) listen for deviceorientation events to get beta (fwd) and gamma (turn), (2) apply the same dead zone as the firmware, (3) use setInterval every 100 ms with a "sending" flag to prevent overlapping fetches to /drive, (4) use DeviceOrientationEvent.requestPermission() for iOS, and (5) send /stop when the tab is hidden.',
        gateQuestion: 'Why does iOS require DeviceOrientationEvent.requestPermission() but Android does not? Why do we recommend Firefox on Android instead of Chrome for plain HTTP sites?' }
    ],
    targetCode: `// VHS Robotics — Battle Royale Tilt Controller
// Board: Arduino Nano RP2040 Connect (or Nano 33 IoT)
// Library: WiFiNINA

#include <SPI.h>
#include <WiFiNINA.h>

#define ROBOT_ID  "1"
#define WIFI_PASS "vhs8126"

#undef A4
#define A4 18

const uint8_t MTR_R_INA = 6,  MTR_R_INB = 4,  MTR_R_PWM = 3;
const uint8_t MTR_L_INA = 8,  MTR_L_INB = 7,  MTR_L_PWM = 5;

const int   DEAD_ZONE = 10;
const int   MAX_TILT  = 40;
const float EXPO      = 1.6;

WiFiServer server(80);
unsigned long lastCmd = 0;

void setup() {
  Serial.begin(115200);
  pinMode(MTR_R_INA, OUTPUT); pinMode(MTR_R_INB, OUTPUT); pinMode(MTR_R_PWM, OUTPUT);
  pinMode(MTR_L_INA, OUTPUT); pinMode(MTR_L_INB, OUTPUT); pinMode(MTR_L_PWM, OUTPUT);
  stopMotors();
  WiFi.beginAP("Robot-" ROBOT_ID, WIFI_PASS);
  delay(1000);
  server.begin();
  Serial.print("AP: Robot-"); Serial.println(ROBOT_ID);
  Serial.println(WiFi.localIP());
}

void loop() {
  if (lastCmd > 0 && millis() - lastCmd > 600) { stopMotors(); lastCmd = 0; }

  WiFiClient client = server.available();
  if (!client) return;

  String req = "";
  unsigned long start = millis();
  while (client.connected() && millis() - start < 300) {
    if (client.available()) { char c = client.read(); if (c == '\\n') break; req += c; }
  }
  while (client.available()) client.read();

  if (req.indexOf("GET /drive") >= 0) {
    applyTilt(extractParam(req, "fwd"), extractParam(req, "turn"));
    lastCmd = millis();
    client.print(F("HTTP/1.1 200 OK\\r\\nContent-Type: text/plain\\r\\nContent-Length: 2\\r\\n\\r\\nOK"));
  } else if (req.indexOf("GET /stop") >= 0) {
    stopMotors(); lastCmd = 0;
    client.print(F("HTTP/1.1 200 OK\\r\\nContent-Type: text/plain\\r\\nContent-Length: 2\\r\\n\\r\\nOK"));
  } else {
    serveControlPage(client);
  }
  client.stop();
}

void applyTilt(int fwd, int turn) {
  if (abs(fwd)  < DEAD_ZONE) fwd  = 0;
  if (abs(turn) < DEAD_ZONE) turn = 0;
  float f = constrain((float)fwd  / MAX_TILT, -1.0f, 1.0f);
  float t = constrain((float)turn / MAX_TILT, -1.0f, 1.0f);
  f = (f >= 0 ? 1.0f : -1.0f) * pow(abs(f), EXPO);
  t = (t >= 0 ? 1.0f : -1.0f) * pow(abs(t), EXPO);
  setMotorsBidi((int)(f * 255) - (int)(t * 130), (int)(f * 255) + (int)(t * 130));
}

void setMotorsBidi(int L, int R) {
  L = constrain(L, -255, 255); R = constrain(R, -255, 255);
  digitalWrite(MTR_L_INA, L >= 0 ? LOW : HIGH); digitalWrite(MTR_L_INB, L >= 0 ? HIGH : LOW);
  analogWrite(MTR_L_PWM, abs(L));
  digitalWrite(MTR_R_INA, R >= 0 ? LOW : HIGH); digitalWrite(MTR_R_INB, R >= 0 ? HIGH : LOW);
  analogWrite(MTR_R_PWM, abs(R));
}

void stopMotors() {
  digitalWrite(MTR_L_INA, LOW); digitalWrite(MTR_L_INB, LOW); analogWrite(MTR_L_PWM, 0);
  digitalWrite(MTR_R_INA, LOW); digitalWrite(MTR_R_INB, LOW); analogWrite(MTR_R_PWM, 0);
}

int extractParam(const String& req, const String& key) {
  int idx = req.indexOf(key + "=");
  if (idx < 0) return 0;
  int s = idx + key.length() + 1, e = s;
  while (e < (int)req.length() && (isDigit(req[e]) || req[e] == '-')) e++;
  return req.substring(s, e).toInt();
}

void serveControlPage(WiFiClient& client) {
  client.print(F("HTTP/1.1 200 OK\\r\\nContent-Type: text/html\\r\\n\\r\\n"));
  // [full HTML/CSS/JS page with DeviceOrientation polling — see BattleRoyale_TiltControl.ino]
}`
  }
  // ── ADD FUTURE LESSONS HERE ──────────────────────────────────────────────────
  // 'unit6_sensors': {
  //   unit: 'Unit 6 — Sensors & Robot Behaviors',
  //   title: 'IR Line Following & Obstacle Avoidance',
  //   steps: [ ... ],
  //   targetCode: `...`
  // }
};

// ============================================
// WEB APP ENDPOINTS
// ============================================

/**
 * Handle GET requests (load data)
 */
function doGet(e) {
  try {
    const action = e.parameter.action;

    switch (action) {
      case 'load':
        return jsonResponse(loadStudentData(e.parameter.email));

      case 'team':
        return jsonResponse(loadTeamData(e.parameter.team, e.parameter.period));

      case 'all':
        return jsonResponse(loadAllData());

      case 'getConfig':
        return jsonResponse(handleGetConfig());

      case 'checkQuiz':
        return jsonResponse(handleCheckQuiz(e));

      case 'getQuizMeta':
        return jsonResponse(handleGetQuizMeta(e));

      case 'repair':
        return jsonResponse(repairStudent(e.parameter.email));

      case 'export':
        return jsonResponse(exportAllData());

      case 'getTutorProgress':
        return jsonResponse(getTutorProgress(e.parameter.email, e.parameter.lessonId));

      default:
        return jsonResponse({ error: 'Unknown action', validActions: ['load', 'team', 'all', 'export'] });
    }
  } catch (error) {
    return jsonResponse({ error: error.toString() });
  }
}

/**
 * Handle POST requests (save data)
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    switch (action) {
      case 'setConfig':
        return jsonResponse(handleSetConfig(data));

      case 'sync':
        return jsonResponse(syncStudentData(data));

      case 'register':
        return jsonResponse(registerStudent(data.student));

      case 'submitReflection':
        return jsonResponse(submitReflection(data));

      case 'submitDeliverable':
        return jsonResponse(submitDeliverable(data));

      case 'saveGrades':
        return jsonResponse(saveGrades(data.grades));

      case 'recordDeliverableUrl':
        return jsonResponse(handleRecordDeliverableUrl(data));

      case 'sendReminders':
        return jsonResponse(sendRemindersWeb(data.semesterStart));

      case 'getAIFeedback':
        return jsonResponse(getAIFeedback(data));

      case 'submitQuiz':
        return jsonResponse(handleSubmitQuiz(data));

      case 'regradeQuiz':
        return jsonResponse(handleRegradeQuiz(data));

      case 'saveQuizGrade':
        return jsonResponse(handleSaveQuizGrade(data));

      case 'gradeDesignBrief':
        return jsonResponse(handleGradeDesignBrief(data));

      case 'getStudentAIFeedback':
        return jsonResponse(handleGetStudentAIFeedback(data));

      case 'chatWithTutor':
        return jsonResponse(chatWithTutor(data));

      case 'saveTutorProgress':
        return jsonResponse(saveTutorProgress(data));

      default:
        return jsonResponse({ error: 'Unknown action' });
    }
  } catch (error) {
    logActivity('ERROR', error.toString());
    return jsonResponse({ error: error.toString() });
  }
}

/**
 * Return JSON response
 */
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// CONFIG OPERATIONS
// ============================================

function handleGetConfig() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName(SHEET_NAMES.CONFIG);
  const config = { skipReflectionWeeks: [], skipDeliverableWeeks: [], expectedVersion: '', quizEnabled: false, quizKey: 'claw', reflectionDueDates: {}, deliverableDueDates: {} };
  if (configSheet && configSheet.getLastRow() > 0) {
    configSheet.getDataRange().getValues().forEach(row => {
      try {
        if (row[0] === 'skipReflectionWeeks')  config.skipReflectionWeeks  = JSON.parse(row[1] || '[]');
        if (row[0] === 'skipDeliverableWeeks') config.skipDeliverableWeeks = JSON.parse(row[1] || '[]');
        if (row[0] === 'expectedVersion')       config.expectedVersion      = row[1] || '';
        if (row[0] === 'quizEnabled')           config.quizEnabled          = row[1] === true || row[1] === 'true';
        if (row[0] === 'quizKey')               config.quizKey              = row[1] || 'claw';
        if (row[0] === 'reflectionDueDates')    config.reflectionDueDates   = JSON.parse(row[1] || '{}');
        if (row[0] === 'deliverableDueDates')   config.deliverableDueDates  = JSON.parse(row[1] || '{}');
      } catch(e) {}
    });
  }
  return config;
}

function handleSetConfig(data) {
  if (data.token !== TEACHER_TOKEN) return { error: 'Unauthorized' };
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let configSheet = ss.getSheetByName(SHEET_NAMES.CONFIG);
  if (!configSheet) configSheet = ss.insertSheet(SHEET_NAMES.CONFIG);

  const existing = configSheet.getLastRow() > 0 ? configSheet.getDataRange().getValues() : [];
  const rowMap = {};
  existing.forEach((row, i) => { if (row[0]) rowMap[row[0]] = i + 1; });

  const updates = {
    skipReflectionWeeks:  JSON.stringify(data.skipReflectionWeeks  || []),
    skipDeliverableWeeks: JSON.stringify(data.skipDeliverableWeeks || []),
    expectedVersion:      data.expectedVersion || '',
    quizEnabled:          data.quizEnabled === true ? true : false,
    quizKey:              data.quizKey || 'claw',
    reflectionDueDates:   JSON.stringify(data.reflectionDueDates  || {}),
    deliverableDueDates:  JSON.stringify(data.deliverableDueDates || {})
  };

  Object.entries(updates).forEach(([key, value]) => {
    if (rowMap[key]) configSheet.getRange(rowMap[key], 2).setValue(value);
    else configSheet.appendRow([key, value]);
  });

  return { success: true };
}

// ============================================
// DATA OPERATIONS
// ============================================

/**
 * Initialize sheets if they don't exist
 */
function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Students sheet
  let studentsSheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  if (!studentsSheet) {
    studentsSheet = ss.insertSheet(SHEET_NAMES.STUDENTS);
    studentsSheet.getRange(1, 1, 1, 9).setValues([[
      'Email', 'Name', 'Team', 'Period', 'Created At', 'Last Sync', 'Total Points', 'Status', 'Full State JSON'
    ]]);
    studentsSheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#1a73e8').setFontColor('white');
    studentsSheet.setFrozenRows(1);
  }

  // Weekly Reflections sheet
  let reflectionsSheet = ss.getSheetByName(SHEET_NAMES.REFLECTIONS);
  if (!reflectionsSheet) {
    reflectionsSheet = ss.insertSheet(SHEET_NAMES.REFLECTIONS);
    reflectionsSheet.getRange(1, 1, 1, 14).setValues([[
      'Email', 'Name', 'Week', 'Contributions', 'Evidence Links', 'Challenges', 'Solutions', 'Goals', 'Submitted At', 'Points', 'Self Assessment', 'Grade', 'Feedback', 'Graded At'
    ]]);
    reflectionsSheet.getRange(1, 1, 1, 14).setFontWeight('bold').setBackground('#34a853').setFontColor('white');
    reflectionsSheet.setFrozenRows(1);
  } else {
    // Add missing columns if needed
    const headers = reflectionsSheet.getRange(1, 1, 1, reflectionsSheet.getLastColumn()).getValues()[0];
    if (!headers[10] || headers[10] !== 'Self Assessment') {
      reflectionsSheet.getRange(1, 11).setValue('Self Assessment');
      reflectionsSheet.getRange(1, 11).setFontWeight('bold').setBackground('#34a853').setFontColor('white');
    }
    if (!headers[11] || headers[11] !== 'Grade') {
      reflectionsSheet.getRange(1, 12).setValue('Grade');
      reflectionsSheet.getRange(1, 12).setFontWeight('bold').setBackground('#34a853').setFontColor('white');
    }
    if (!headers[12] || headers[12] !== 'Feedback') {
      reflectionsSheet.getRange(1, 13).setValue('Feedback');
      reflectionsSheet.getRange(1, 13).setFontWeight('bold').setBackground('#34a853').setFontColor('white');
    }
    if (headers.length < 14 || headers[13] !== 'Graded At') {
      reflectionsSheet.getRange(1, 14).setValue('Graded At');
      reflectionsSheet.getRange(1, 14).setFontWeight('bold').setBackground('#34a853').setFontColor('white');
    }
  }

  // Deliverables sheet
  let deliverablesSheet = ss.getSheetByName(SHEET_NAMES.DELIVERABLES);
  if (!deliverablesSheet) {
    deliverablesSheet = ss.insertSheet(SHEET_NAMES.DELIVERABLES);
    deliverablesSheet.getRange(1, 1, 1, 12).setValues([[
      'Email', 'Name', 'Deliverable ID', 'Title', 'Content', 'Links', 'Self Assessment', 'Status', 'Submitted At', 'Grade', 'Feedback', 'Graded At'
    ]]);
    deliverablesSheet.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#fbbc04').setFontColor('black');
    deliverablesSheet.setFrozenRows(1);
  }

  // Evidence sheet - supports both legacy base64 and new Drive-based storage
  let evidenceSheet = ss.getSheetByName(SHEET_NAMES.EVIDENCE);
  if (!evidenceSheet) {
    evidenceSheet = ss.insertSheet(SHEET_NAMES.EVIDENCE);
    evidenceSheet.getRange(1, 1, 1, 9).setValues([[
      'Email', 'Name', 'Week', 'Filename', 'Uploaded At', 'Image Data', 'Drive ID', 'Thumbnail Link', 'Web View Link'
    ]]);
    evidenceSheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#ea4335').setFontColor('white');
    evidenceSheet.setFrozenRows(1);
  } else {
    // Update existing sheet headers if Drive columns are missing
    const headers = evidenceSheet.getRange(1, 1, 1, 9).getValues()[0];
    if (!headers[6] || headers[6] !== 'Drive ID') {
      evidenceSheet.getRange(1, 7, 1, 3).setValues([['Drive ID', 'Thumbnail Link', 'Web View Link']]);
      evidenceSheet.getRange(1, 7, 1, 3).setFontWeight('bold').setBackground('#ea4335').setFontColor('white');
    }
  }

  // Activity Log sheet
  let logSheet = ss.getSheetByName(SHEET_NAMES.LOG);
  if (!logSheet) {
    logSheet = ss.insertSheet(SHEET_NAMES.LOG);
    logSheet.getRange(1, 1, 1, 4).setValues([[
      'Timestamp', 'Type', 'Email', 'Details'
    ]]);
    logSheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#5f6368').setFontColor('white');
    logSheet.setFrozenRows(1);
  }

  return { success: true };
}

/**
 * Sync all student data
 */
function syncStudentData(data) {
  // Acquire a script-level lock to prevent concurrent syncs from the same student
  // (e.g. two browser tabs open) creating duplicate rows in the sheets.
  const lock = LockService.getScriptLock();
  lock.waitLock(15000); // wait up to 15s for the lock
  try {
    return _syncStudentDataLocked(data);
  } finally {
    lock.releaseLock();
  }
}

function _syncStudentDataLocked(data) {
  initializeSheets();

  // Update student record and store full state JSON in column 9
  updateStudentRecord(data.student);
  try {
    saveFullState(data.student.email, data);
  } catch (fsError) {
    // Log but do not abort — individual row writes below must still run
    logActivity('ERROR', data.student.email, 'saveFullState threw: ' + fsError.toString());
  }

  // Sync submitted reflections to teacher-visible sheet
  if (data.weeklyReflections) {
    Object.entries(data.weeklyReflections).forEach(([week, reflection]) => {
      if (reflection.submitted) {
        saveReflection(data.student, week, reflection);
      }
    });
  }

  // Sync completed deliverables to teacher-visible sheet
  if (data.deliverables) {
    Object.entries(data.deliverables).forEach(([id, deliverable]) => {
      if (deliverable.status === 'completed') {
        saveDeliverable(data.student, id, deliverable);
      }
    });
  }

  // Sync all evidence photos to Evidence sheet (one row per photo)
  if (data.evidence && data.evidence.length > 0) {
    data.evidence.forEach(evidence => {
      saveEvidence(data.student, evidence);
    });
  }

  logActivity('SYNC', data.student.email, `Synced at ${data.timestamp}`);

  return { success: true, timestamp: new Date().toISOString(), backendVersion: BACKEND_VERSION };
}

/**
 * Save full application state as JSON (column 9 of Students sheet)
 * This preserves drafts, code snippets — everything the student needs to restore.
 * Evidence photos are stored separately in the Evidence sheet to avoid cell size limits.
 */
function saveFullState(email, data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  const sheetData = sheet.getDataRange().getValues();

  for (let i = 1; i < sheetData.length; i++) {
    if (sheetData[i][0] === email) {
      // Read existing state and merge — never allow a partial save to overwrite complete data.
      // If the frontend sends an incomplete weeklyReflections (e.g. due to a race condition
      // or two tabs open), existing weeks not present in the incoming data are preserved.
      let existingReflections = {};
      let existingDeliverables = {};
      let existingCodeSnippets = [];
      let existingViewedFeedback = [];

      const existingJson = sheetData[i][8];
      if (existingJson && existingJson.trim()) {
        try {
          const existing = JSON.parse(existingJson);
          existingReflections = existing.weeklyReflections || {};
          existingDeliverables = existing.deliverables || {};
          existingCodeSnippets = existing.codeSnippets || [];
          existingViewedFeedback = existing.viewedFeedback || [];
        } catch (e) {
          // Existing JSON is corrupt — start fresh from incoming data
        }
      }

      // Merge: incoming data wins for any weeks/deliverables it includes;
      // existing data is preserved for anything the incoming payload is missing.
      const mergedReflections = Object.assign({}, existingReflections, data.weeklyReflections || {});
      const mergedDeliverables = Object.assign({}, existingDeliverables, data.deliverables || {});

      const fullCodeSnippets = (data.codeSnippets && data.codeSnippets.length > 0) ? data.codeSnippets : existingCodeSnippets;
      const fullViewedFeedback = (data.viewedFeedback && data.viewedFeedback.length > 0) ? data.viewedFeedback : existingViewedFeedback;

      const buildJson = (includeSnippets) => JSON.stringify({
        student: data.student,
        weeklyReflections: mergedReflections,
        deliverables: mergedDeliverables,
        codeSnippets: includeSnippets ? fullCodeSnippets : [],
        viewedFeedback: fullViewedFeedback,
        lastSynced: data.timestamp || new Date().toISOString(),
        _codeSnippetsStripped: !includeSnippets
      });

      // Google Sheets cells cap at 50,000 characters. Try full state first,
      // then fall back to stripping code snippets. Never throw — a failed
      // fullState write must not block the individual deliverable row writes.
      const CELL_LIMIT = 49500;
      let stateJson = buildJson(true);
      if (stateJson.length > CELL_LIMIT) {
        stateJson = buildJson(false);
        logActivity('WARN', email, `Full state too large (stripped code snippets): ${stateJson.length} chars`);
      }
      try {
        sheet.getRange(i + 1, 9).setValue(stateJson.substring(0, CELL_LIMIT));
      } catch (cellError) {
        logActivity('ERROR', email, 'saveFullState cell write failed: ' + cellError.toString());
      }
      return;
    }
  }
}

/**
 * Register a new student (or update if already exists)
 */
function registerStudent(student) {
  initializeSheets();
  updateStudentRecord(student);
  logActivity('REGISTER', student.email, 'Student registered: ' + student.name);
  return { success: true };
}

/**
 * Update or create student record
 */
function updateStudentRecord(student) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  const data = sheet.getDataRange().getValues();

  // Find existing row
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === student.email) {
      rowIndex = i + 1;
      break;
    }
  }

  const now = new Date().toISOString();

  if (rowIndex > 0) {
    // Update existing
    sheet.getRange(rowIndex, 6).setValue(now); // Last Sync
  } else {
    // Create new
    sheet.appendRow([
      student.email,
      student.name,
      student.team,
      student.period,
      student.createdAt || now,
      now,
      0,
      'Active'
    ]);
  }
}

/**
 * Save weekly reflection
 */
function saveReflection(student, week, reflection) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.REFLECTIONS);
  const data = sheet.getDataRange().getValues();

  // Check if reflection already exists
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === student.email && data[i][2] == week) {
      rowIndex = i + 1;
      break;
    }
  }

  const contributions = (reflection.contributions || [])
    .map(c => `${c.date}: ${c.task}`)
    .join('\n');

  const goals = (reflection.goals || []).join('\n');

  // Calculate rubric total if available
  const rubricTotal = reflection.rubric ?
    (reflection.rubric.detail || 0) + (reflection.rubric.evidence || 0) +
    (reflection.rubric.problemSolving || 0) + (reflection.rubric.goals || 0) : '';

  const rowData = [
    student.email,
    student.name,
    week,
    contributions,
    reflection.evidenceLinks || '',
    reflection.challenges || '',
    reflection.solutions || '',
    goals,
    reflection.submittedAt || new Date().toISOString(),
    20, // Points for weekly reflection
    rubricTotal // Self-assessment score (column K)
  ];

  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
}

/**
 * Save deliverable
 */
function saveDeliverable(student, id, deliverable) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.DELIVERABLES);
  const data = sheet.getDataRange().getValues();

  const titles = {
    0:  'Career Ready Practices Reflection',
    11: 'Design Brief',
    12: 'Robot Deck Design Record',
    21: 'C1 — Wheel Hub',
    22: 'C2 — Drive Wheel',
    23: 'C3 — Motor Sleeve Mount',
    24: 'C4 — Robot Deck (Final)',
    25: 'C5 — Omni Wheel Mount',
    26: 'C6 — IR Sensor Mount',
    27: 'C7 — Ultrasonic Sensor Mount',
    51: 'Programming Basics — Check Your Understanding'
  };

  // Check if deliverable already exists
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === student.email && data[i][2] == id) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex > 0) {
    // Update content columns (A-I) but PRESERVE grade, feedback, and graded-at columns
    const contentData = [
      student.email,
      student.name,
      id,
      titles[id] || `Deliverable ${id}`,
      deliverable.content || '',
      deliverable.links || '',
      deliverable.selfAssessment || '',
      deliverable.status,
      deliverable.submittedAt || new Date().toISOString()
    ];
    sheet.getRange(rowIndex, 1, 1, contentData.length).setValues([contentData]);
  } else {
    sheet.appendRow([
      student.email,
      student.name,
      id,
      titles[id] || `Deliverable ${id}`,
      deliverable.content || '',
      deliverable.links || '',
      deliverable.selfAssessment || '',
      deliverable.status,
      deliverable.submittedAt || new Date().toISOString(),
      '' // Grade (teacher fills in)
    ]);
  }
}

/**
 * Teacher records a student's email-submitted deliverable.
 * Creates (or updates) a Deliverables row marked completed with the URL
 * pasted by the teacher. Grade and Feedback columns are preserved if the
 * row already exists.
 */
function handleRecordDeliverableUrl(data) {
  if (data.token !== TEACHER_TOKEN) return { error: 'Unauthorized' };
  if (!data.email || !data.deliverableId) return { error: 'Missing email or deliverableId' };

  initializeSheets();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Look up student name
  const studentsSheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  const studentsData  = studentsSheet.getDataRange().getValues();
  let studentName = '';
  for (let i = 1; i < studentsData.length; i++) {
    if (studentsData[i][0] === data.email) { studentName = studentsData[i][1]; break; }
  }
  if (!studentName) return { error: 'Student not found: ' + data.email };

  const titles = {
    0:  'Career Ready Practices Reflection',
    11: 'Design Brief',
    12: 'Robot Deck Design Record',
    21: 'C1 — Wheel Hub',
    22: 'C2 — Drive Wheel',
    23: 'C3 — Motor Sleeve Mount',
    24: 'C4 — Robot Deck (Final)',
    25: 'C5 — Omni Wheel Mount',
    26: 'C6 — IR Sensor Mount',
    27: 'C7 — Ultrasonic Sensor Mount',
    51: 'Programming Basics — Check Your Understanding'
  };

  const sheet = ss.getSheetByName(SHEET_NAMES.DELIVERABLES);
  const sheetData = sheet.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 1; i < sheetData.length; i++) {
    if (sheetData[i][0] === data.email && sheetData[i][2] == data.deliverableId) {
      rowIndex = i + 1;
      break;
    }
  }

  const now = new Date().toISOString();
  if (rowIndex > 0) {
    // Update content columns A-I; preserve Grade (J), Feedback (K), Graded At (L)
    const contentData = [
      data.email,
      studentName,
      data.deliverableId,
      titles[data.deliverableId] || `Deliverable ${data.deliverableId}`,
      'Submitted by email — recorded by teacher',
      data.url || '',
      '',
      'completed',
      now
    ];
    sheet.getRange(rowIndex, 1, 1, contentData.length).setValues([contentData]);
  } else {
    sheet.appendRow([
      data.email,
      studentName,
      data.deliverableId,
      titles[data.deliverableId] || `Deliverable ${data.deliverableId}`,
      'Submitted by email — recorded by teacher',
      data.url || '',
      '',
      'completed',
      now,
      '' // Grade (teacher fills in)
    ]);
  }

  logActivity('TEACHER_SUBMIT', data.email, 'Recorded email submission for deliverable ' + data.deliverableId);
  return { success: true };
}

/**
 * Save evidence photo (one row per photo in Evidence sheet)
 * Supports both legacy base64 and new Drive-based storage
 */
function saveEvidence(student, evidence) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.EVIDENCE);
  const data = sheet.getDataRange().getValues();

  // Check if this evidence item already exists
  // For Drive-based: match by email + driveId (most reliable)
  // For legacy base64: match by email + filename + uploadedAt
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === student.email) {
      // Drive-based: check driveId (column 7, index 6)
      if (evidence.driveId && data[i][6] === evidence.driveId) {
        rowIndex = i + 1;
        break;
      }
      // Legacy base64: check filename + uploadedAt
      if (!evidence.driveId && data[i][3] === evidence.filename && data[i][4] === evidence.uploadedAt) {
        rowIndex = i + 1;
        break;
      }
    }
  }

  const rowData = [
    student.email,
    student.name,
    evidence.week || '',
    evidence.filename || '',
    evidence.uploadedAt || new Date().toISOString(),
    evidence.data || '',           // Base64 image data (legacy)
    evidence.driveId || '',        // Google Drive file ID
    evidence.thumbnailLink || '',  // Drive thumbnail URL
    evidence.webViewLink || ''     // Drive web view URL
  ];

  if (rowIndex > 0) {
    // Update existing
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    // Append new
    sheet.appendRow(rowData);
  }
}

/**
 * Repair a student's data by clearing the stale fullState JSON and rebuilding
 * it immediately from the individual sheets (Reflections, Deliverables, Evidence).
 * Called by the teacher portal when a student's work isn't loading after an outage.
 */
function repairStudent(email) {
  if (!email) return { success: false, error: 'No email provided' };
  initializeSheets();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const studentsSheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  const studentsData = studentsSheet.getDataRange().getValues();

  let studentRow = -1;
  for (let i = 1; i < studentsData.length; i++) {
    if (studentsData[i][0] === email) {
      studentRow = i + 1; // 1-indexed for getRange
      break;
    }
  }

  if (studentRow < 0) {
    return { success: false, error: 'Student not found: ' + email };
  }

  // Clear the stale fullState JSON so loadStudentData falls back to sheet-based rebuild
  studentsSheet.getRange(studentRow, 9).setValue('');
  logActivity('REPAIR', email, 'Teacher initiated data repair — fullState cleared');

  // loadStudentData will now take the fallback path and rebuild from individual sheets
  const rebuilt = loadStudentData(email);

  if (rebuilt && !rebuilt.error) {
    // Write the freshly rebuilt state back to column 9 so it's cached for future loads
    studentsSheet.getRange(studentRow, 9).setValue(JSON.stringify(rebuilt));
    const reflCount = Object.keys(rebuilt.weeklyReflections || {}).length;
    const delCount = Object.keys(rebuilt.deliverables || {}).length;
    const evCount = (rebuilt.evidence || []).length;
    logActivity('REPAIR', email, 'Rebuilt: ' + reflCount + ' reflections, ' + delCount + ' deliverables, ' + evCount + ' evidence items');
    return {
      success: true,
      email: email,
      recovered: { reflections: reflCount, deliverables: delCount, evidence: evCount }
    };
  }

  return { success: false, error: 'Failed to rebuild data for ' + email };
}

/**
 * Load student data
 */
function loadStudentData(email) {
  initializeSheets();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const studentsSheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  const studentsData = studentsSheet.getDataRange().getValues();

  // Find student row and check for full state JSON (column 9)
  for (let i = 1; i < studentsData.length; i++) {
    if (studentsData[i][0] === email) {
      // If full state JSON exists, return it with merged teacher grades/feedback
      if (studentsData[i][8] && studentsData[i][8].trim()) {
        try {
          const fullState = JSON.parse(studentsData[i][8]);

          // Merge in submitted reflections from the Reflections sheet.
          // This both restores teacher grades/feedback AND recovers any weeks that
          // were accidentally lost from the fullState JSON (data loss recovery).
          const reflectionsSheet = ss.getSheetByName(SHEET_NAMES.REFLECTIONS);
          const reflectionsData = reflectionsSheet.getDataRange().getValues();

          if (!fullState.weeklyReflections) fullState.weeklyReflections = {};

          for (let j = 1; j < reflectionsData.length; j++) {
            if (reflectionsData[j][0] === email) {
              const week = reflectionsData[j][2];

              if (fullState.weeklyReflections[week]) {
                // Week exists in fullState — just merge teacher grades/feedback
                fullState.weeklyReflections[week].teacherGrade = reflectionsData[j][11] || undefined;
                fullState.weeklyReflections[week].teacherFeedback = reflectionsData[j][12] || '';
              } else {
                // Week is missing from fullState — reconstruct from Reflections sheet (data recovery)
                const contributionLines = (reflectionsData[j][3] || '').split('\n').filter(function(l) { return l.trim(); });
                const contributions = contributionLines.map(function(line) {
                  var colonIdx = line.indexOf(': ');
                  if (colonIdx > 0) {
                    return { date: line.substring(0, colonIdx), task: line.substring(colonIdx + 2) };
                  }
                  return { date: '', task: line };
                });

                const goals = (reflectionsData[j][7] || '').split('\n').filter(function(g) { return g.trim(); });

                fullState.weeklyReflections[week] = {
                  week: week,
                  contributions: contributions,
                  evidenceLinks: reflectionsData[j][4] || '',
                  challenges: reflectionsData[j][5] || '',
                  solutions: reflectionsData[j][6] || '',
                  goals: goals,
                  submitted: true,
                  submittedAt: reflectionsData[j][8] || '',
                  teacherGrade: reflectionsData[j][11] || undefined,
                  teacherFeedback: reflectionsData[j][12] || '',
                  _recoveredFromSheet: true
                };
              }
            }
          }

          // Also merge deliverable grades/feedback
          const deliverablesSheet = ss.getSheetByName(SHEET_NAMES.DELIVERABLES);
          const deliverablesData = deliverablesSheet.getDataRange().getValues();

          for (let j = 1; j < deliverablesData.length; j++) {
            if (deliverablesData[j][0] === email) {
              const id = deliverablesData[j][2];
              if (fullState.deliverables && fullState.deliverables[id]) {
                // Grade in column J (index 9), Feedback in column K (index 10)
                fullState.deliverables[id].teacherGrade = deliverablesData[j][9] || undefined;
                fullState.deliverables[id].teacherFeedback = deliverablesData[j][10] || '';
              }
            }
          }

          // Load evidence photos from Evidence sheet
          // Supports both legacy base64 and new Drive-based storage
          const evidenceSheet = ss.getSheetByName(SHEET_NAMES.EVIDENCE);
          const evidenceData = evidenceSheet.getDataRange().getValues();
          fullState.evidence = [];

          for (let j = 1; j < evidenceData.length; j++) {
            if (evidenceData[j][0] === email) {
              const evidenceItem = {
                type: 'weekly',
                week: evidenceData[j][2],
                filename: evidenceData[j][3],
                uploadedAt: evidenceData[j][4],
                data: evidenceData[j][5] || ''  // Base64 image data (legacy)
              };
              // Add Drive fields if they exist (columns 7-9)
              if (evidenceData[j][6]) evidenceItem.driveId = evidenceData[j][6];
              if (evidenceData[j][7]) evidenceItem.thumbnailLink = evidenceData[j][7];
              if (evidenceData[j][8]) evidenceItem.webViewLink = evidenceData[j][8];
              fullState.evidence.push(evidenceItem);
            }
          }

          return fullState;
        } catch (e) {
          // JSON parse failed — fall through to sheet-based load
        }
      }

      // Fallback: reconstruct from individual sheets (submitted/completed only)
      const student = {
        email: studentsData[i][0],
        name: studentsData[i][1],
        team: studentsData[i][2],
        period: studentsData[i][3],
        createdAt: studentsData[i][4],
        totalPoints: studentsData[i][6]
      };

      const reflectionsSheet = ss.getSheetByName(SHEET_NAMES.REFLECTIONS);
      const reflectionsData = reflectionsSheet.getDataRange().getValues();
      const weeklyReflections = {};

      for (let j = 1; j < reflectionsData.length; j++) {
        if (reflectionsData[j][0] === email) {
          const week = reflectionsData[j][2];
          // Parse contributions back into array format
          const contribLines = (reflectionsData[j][3] || '').split('\n').filter(l => l.trim());
          const contributions = contribLines.map(line => {
            const colonIdx = line.indexOf(':');
            return colonIdx > 0
              ? { date: line.substring(0, colonIdx).trim(), task: line.substring(colonIdx + 1).trim() }
              : { date: '', task: line.trim() };
          });
          // Parse goals back into array
          const goals = (reflectionsData[j][7] || '').split('\n').filter(l => l.trim());

          weeklyReflections[week] = {
            week: parseInt(week),
            contributions,
            evidenceLinks: reflectionsData[j][4] || '',
            challenges: reflectionsData[j][5] || '',
            solutions: reflectionsData[j][6] || '',
            goals,
            submittedAt: reflectionsData[j][8],
            submitted: true,
            // Grade in column L (index 11), Feedback in column M (index 12)
            teacherGrade: reflectionsData[j][11] || undefined,
            teacherFeedback: reflectionsData[j][12] || ''
          };
        }
      }

      const deliverablesSheet = ss.getSheetByName(SHEET_NAMES.DELIVERABLES);
      const deliverablesData = deliverablesSheet.getDataRange().getValues();
      const deliverables = {};

      for (let j = 1; j < deliverablesData.length; j++) {
        if (deliverablesData[j][0] === email) {
          const id = deliverablesData[j][2];
          deliverables[id] = {
            content: deliverablesData[j][4],
            links: deliverablesData[j][5],
            selfAssessment: deliverablesData[j][6],
            status: deliverablesData[j][7],
            submittedAt: deliverablesData[j][8],
            // Grade in column J (index 9), Feedback in column K (index 10)
            grade: deliverablesData[j][9],
            teacherFeedback: deliverablesData[j][10] || ''
          };
        }
      }

      // Load evidence photos from Evidence sheet
      // Supports both legacy base64 and new Drive-based storage
      const evidenceSheet = ss.getSheetByName(SHEET_NAMES.EVIDENCE);
      const evidenceData = evidenceSheet.getDataRange().getValues();
      const evidence = [];

      for (let j = 1; j < evidenceData.length; j++) {
        if (evidenceData[j][0] === email) {
          const evidenceItem = {
            type: 'weekly',
            week: evidenceData[j][2],
            filename: evidenceData[j][3],
            uploadedAt: evidenceData[j][4],
            data: evidenceData[j][5] || ''  // Base64 image data (legacy)
          };
          // Add Drive fields if they exist (columns 7-9)
          if (evidenceData[j][6]) evidenceItem.driveId = evidenceData[j][6];
          if (evidenceData[j][7]) evidenceItem.thumbnailLink = evidenceData[j][7];
          if (evidenceData[j][8]) evidenceItem.webViewLink = evidenceData[j][8];
          evidence.push(evidenceItem);
        }
      }

      return { student, weeklyReflections, deliverables, evidence, codeSnippets: [] };
    }
  }

  // Student not found at all
  return { error: 'Student not found' };
}

/**
 * Load team data
 */
function loadTeamData(team, period) {
  initializeSheets();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const studentsSheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  const reflectionsSheet = ss.getSheetByName(SHEET_NAMES.REFLECTIONS);
  const deliverablesSheet = ss.getSheetByName(SHEET_NAMES.DELIVERABLES);

  const studentsData = studentsSheet.getDataRange().getValues();
  const reflectionsData = reflectionsSheet.getDataRange().getValues();
  const deliverablesData = deliverablesSheet.getDataRange().getValues();

  const members = [];

  for (let i = 1; i < studentsData.length; i++) {
    if (studentsData[i][2] === team && studentsData[i][3] === period) {
      const email = studentsData[i][0];

      // Count reflections
      let reflectionCount = 0;
      for (let j = 1; j < reflectionsData.length; j++) {
        if (reflectionsData[j][0] === email) reflectionCount++;
      }

      // Count deliverables
      let deliverableCount = 0;
      for (let j = 1; j < deliverablesData.length; j++) {
        if (deliverablesData[j][0] === email && deliverablesData[j][7] === 'completed') {
          deliverableCount++;
        }
      }

      // Calculate points
      let points = reflectionCount * 20;
      const pointValues = { 0: 20, 11: 50, 12: 50, 21: 50, 22: 50, 23: 50, 24: 75, 25: 50, 26: 50, 27: 50, 51: 80 };
      for (let j = 1; j < deliverablesData.length; j++) {
        if (deliverablesData[j][0] === email && deliverablesData[j][7] === 'completed') {
          const id = deliverablesData[j][2];
          points += pointValues[id] || 0;
        }
      }

      members.push({
        name: studentsData[i][1],
        initials: studentsData[i][1].split(' ').map(n => n[0]).join('').toUpperCase(),
        reflections: reflectionCount,
        deliverables: deliverableCount,
        points: points
      });
    }
  }

  const teamNames = {
    'drivetrain': 'Drivetrain',
    'intake': 'Intake/Collector',
    'shooter': 'Shooter/Launcher',
    'climber': 'Climber',
    'autonomous': 'Autonomous/Vision',
    'integration': 'Integration/Electrical'
  };

  const totalPossible = 900;
  const avgPoints = members.length > 0
    ? Math.round(members.reduce((sum, m) => sum + m.points, 0) / members.length)
    : 0;

  return {
    teamName: teamNames[team] || team,
    members: members,
    totalProgress: Math.round((avgPoints / totalPossible) * 100)
  };
}

/**
 * Load all data (for teacher dashboard)
 */
function loadAllData() {
  initializeSheets();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  function safeGetSheet(name) {
    try {
      const sheet = ss.getSheetByName(name);
      if (!sheet) return [[]];
      return sheet.getDataRange().getValues();
    } catch (e) {
      logActivity('ERROR', 'system', 'loadAllData failed for sheet: ' + name + ' — ' + e.toString());
      return [[]];
    }
  }

  const students     = safeGetSheet(SHEET_NAMES.STUDENTS);
  const reflections  = safeGetSheet(SHEET_NAMES.REFLECTIONS);
  const deliverables = safeGetSheet(SHEET_NAMES.DELIVERABLES);
  const evidence     = safeGetSheet(SHEET_NAMES.EVIDENCE);
  const quiz         = safeGetSheet(SHEET_NAMES.QUIZ);  // legacy quiz sheet (kept for backward-compat)

  // Load every quiz sheet registered in QUIZ_REGISTRY, keyed by quizId so the
  // teacher portal can pick the right rows per quiz (e.g. final_exam vs claw).
  const quizzes = {};
  if (typeof QUIZ_REGISTRY !== 'undefined') {
    Object.keys(QUIZ_REGISTRY).forEach(quizId => {
      const sheetName = QUIZ_REGISTRY[quizId].sheetName || SHEET_NAMES.QUIZ;
      quizzes[quizId] = safeGetSheet(sheetName).slice(1);
    });
  }

  return {
    students:     students.slice(1),
    reflections:  reflections.slice(1),
    deliverables: deliverables.slice(1),
    evidence:     evidence.slice(1),
    quiz:         quiz.slice(1),     // legacy — kept so older frontends still work
    quizzes:      quizzes,           // new — keyed by quizId
    summary: {
      totalStudents:     Math.max(0, students.length - 1),
      totalReflections:  Math.max(0, reflections.length - 1),
      totalDeliverables: Math.max(0, deliverables.length - 1)
    }
  };
}

/**
 * Export all data as formatted report
 */
function exportAllData() {
  const data = loadAllData();

  // Group by student
  const studentReports = {};

  data.students.forEach(s => {
    studentReports[s[0]] = {
      name: s[1],
      team: s[2],
      period: s[3],
      reflections: [],
      deliverables: []
    };
  });

  data.reflections.forEach(r => {
    if (studentReports[r[0]]) {
      studentReports[r[0]].reflections.push({
        week: r[2],
        contributions: r[3],
        submittedAt: r[8]
      });
    }
  });

  data.deliverables.forEach(d => {
    if (studentReports[d[0]]) {
      studentReports[d[0]].deliverables.push({
        title: d[3],
        status: d[7],
        submittedAt: d[8],
        grade: d[9]
      });
    }
  });

  return {
    exportedAt: new Date().toISOString(),
    reports: studentReports
  };
}

/**
 * Save grades and feedback from teacher portal
 */
function saveGrades(grades) {
  initializeSheets();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  grades.forEach(gradeData => {
    const { email, type, assignmentId, grade, feedback } = gradeData;

    const gradedAt = new Date().toISOString();

    if (type === 'reflection') {
      const sheet = ss.getSheetByName(SHEET_NAMES.REFLECTIONS);
      const data = sheet.getDataRange().getValues();

      // Ensure we have grade, feedback, and graded at columns
      const headerRow = data[0];
      if (headerRow.length < 13 || headerRow[11] !== 'Grade') {
        sheet.getRange(1, 12).setValue('Grade');
      }
      if (headerRow.length < 13 || headerRow[12] !== 'Feedback') {
        sheet.getRange(1, 13).setValue('Feedback');
      }
      if (headerRow.length < 14 || headerRow[13] !== 'Graded At') {
        sheet.getRange(1, 14).setValue('Graded At');
      }

      // Find the reflection row
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === email && data[i][2] == assignmentId) {
          if (grade !== '') sheet.getRange(i + 1, 12).setValue(parseFloat(grade));
          if (feedback !== '') sheet.getRange(i + 1, 13).setValue(feedback);
          if (grade !== '' || feedback !== '') sheet.getRange(i + 1, 14).setValue(gradedAt);
          break;
        }
      }
    } else if (type === 'deliverable') {
      const sheet = ss.getSheetByName(SHEET_NAMES.DELIVERABLES);
      const data = sheet.getDataRange().getValues();

      // Ensure we have feedback and graded at columns
      const headerRow = data[0];
      if (headerRow.length < 11 || headerRow[10] !== 'Feedback') {
        sheet.getRange(1, 11).setValue('Feedback');
      }
      if (headerRow.length < 12 || headerRow[11] !== 'Graded At') {
        sheet.getRange(1, 12).setValue('Graded At');
      }

      // Find and update all matching deliverable rows (handles duplicates)
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === email && data[i][2] == assignmentId) {
          if (grade !== '') sheet.getRange(i + 1, 10).setValue(parseFloat(grade));
          if (feedback !== '') sheet.getRange(i + 1, 11).setValue(feedback);
          if (grade !== '' || feedback !== '') sheet.getRange(i + 1, 12).setValue(gradedAt);
        }
      }
    }
  });

  logActivity('GRADES', 'teacher', `Saved ${grades.length} grades`);
  return { success: true, count: grades.length };
}

/**
 * Log activity
 */
function logActivity(type, email, details) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAMES.LOG);
    if (sheet) {
      sheet.appendRow([
        new Date().toISOString(),
        type,
        email || '',
        details || ''
      ]);
    }
  } catch (e) {
    console.error('Failed to log activity:', e);
  }
}

// ============================================
// TEACHER UTILITIES
// ============================================

/**
 * Create a summary report
 * Run this from Apps Script editor to generate a summary
 */
function generateSummaryReport() {
  const data = loadAllData();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Create or get summary sheet
  let summarySheet = ss.getSheetByName('Summary Report');
  if (summarySheet) {
    summarySheet.clear();
  } else {
    summarySheet = ss.insertSheet('Summary Report');
  }

  // Header
  summarySheet.getRange(1, 1).setValue('Robotics Portfolio Summary Report');
  summarySheet.getRange(1, 1).setFontSize(18).setFontWeight('bold');
  summarySheet.getRange(2, 1).setValue(`Generated: ${new Date().toLocaleString()}`);

  // Stats
  summarySheet.getRange(4, 1, 1, 2).setValues([['Total Students', data.summary.totalStudents]]);
  summarySheet.getRange(5, 1, 1, 2).setValues([['Total Reflections', data.summary.totalReflections]]);
  summarySheet.getRange(6, 1, 1, 2).setValues([['Total Deliverables', data.summary.totalDeliverables]]);

  // Student progress table
  summarySheet.getRange(8, 1).setValue('Student Progress');
  summarySheet.getRange(8, 1).setFontWeight('bold');

  const headers = ['Name', 'Team', 'Period', 'Reflections', 'Deliverables', 'Est. Points'];
  summarySheet.getRange(9, 1, 1, headers.length).setValues([headers]);
  summarySheet.getRange(9, 1, 1, headers.length).setFontWeight('bold').setBackground('#e8eaed');

  let row = 10;
  data.students.forEach(student => {
    const email = student[0];
    const reflectionCount = data.reflections.filter(r => r[0] === email).length;
    const deliverableCount = data.deliverables.filter(d => d[0] === email && d[7] === 'completed').length;

    // Estimate points
    const pointValues = { 1: 50, 2: 50, 3: 75, 4: 50, 5: 75, 6: 50, 7: 50, 8: 75, 9: 100, 10: 100 };
    let points = reflectionCount * 20;
    data.deliverables.filter(d => d[0] === email && d[7] === 'completed').forEach(d => {
      points += pointValues[d[2]] || 0;
    });

    summarySheet.getRange(row, 1, 1, 6).setValues([[
      student[1], // Name
      student[2], // Team
      student[3], // Period
      reflectionCount,
      deliverableCount,
      points
    ]]);
    row++;
  });

  // Auto-resize columns
  summarySheet.autoResizeColumns(1, 6);

  SpreadsheetApp.getUi().alert('Summary report generated! Check the "Summary Report" sheet.');
}

/**
 * Send reminder emails via web request (called from teacher portal)
 */
function sendRemindersWeb(semesterStart) {
  const data = loadAllData();
  const startDate = semesterStart ? new Date(semesterStart) : new Date('2026-08-24');
  const diffTime = new Date() - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const currentWeek = Math.floor(diffDays / 7) + 1;
  let emailsSent = 0;
  const emailedStudents = [];

  // Read skip config from Config sheet
  const cfg = handleGetConfig();
  const skipReflectionWeeks  = cfg.skipReflectionWeeks  || [];
  const skipDeliverableWeeks = cfg.skipDeliverableWeeks || [];

  // Deliverable schedule: {id, title, week due}
  const deliverableSchedule = [
    { id: 0,  title: 'Career Ready Practices Reflection', week: 1 },
    { id: 11, title: 'Design Brief', week: 1 },
    { id: 12, title: 'Robot Deck Design Record', week: 2 },
    { id: 21, title: 'C1 — Wheel Hub', week: 3 },
    { id: 22, title: 'C2 — Drive Wheel', week: 4 },
    { id: 23, title: 'C3 — Motor Sleeve Mount', week: 4 },
    { id: 25, title: 'C5 — Omni Wheel Mount', week: 6 },
    { id: 26, title: 'C6 — IR Sensor Mount', week: 7 },
    { id: 27, title: 'C7 — Ultrasonic Sensor Mount', week: 7 },
    { id: 24, title: 'C4 — Robot Deck (Final)', week: 8 },
    { id: 51, title: 'Programming Basics — Check Your Understanding', week: 17 }
  ];

  data.students.forEach(student => {
    const email = student[0];
    const name = student[1];

    // Check missing reflections — only weeks whose Friday 3pm deadline has passed
    const submittedWeeks = data.reflections
      .filter(r => r[0] === email)
      .map(r => r[2]);

    const now = new Date();
    const missingReflections = [];
    for (let w = 1; w <= currentWeek; w++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(weekStart.getDate() + (w - 1) * 7);
      const fridayDeadline = new Date(weekStart);
      fridayDeadline.setDate(fridayDeadline.getDate() + 4);
      fridayDeadline.setHours(15, 0, 0, 0);
      if (now > fridayDeadline && !skipReflectionWeeks.includes(w) && !submittedWeeks.includes(w)) {
        missingReflections.push(w);
      }
    }

    // Check missing deliverables — only past-deadline weeks, skip optional/skipped
    const completedDeliverables = data.deliverables
      .filter(d => d[0] === email && d[7] === 'completed')
      .map(d => String(d[2]));

    const missingDeliverables = [];
    deliverableSchedule.forEach(d => {
      const weekStart = new Date(startDate);
      weekStart.setDate(weekStart.getDate() + (d.week - 1) * 7);
      const fridayDeadline = new Date(weekStart);
      fridayDeadline.setDate(fridayDeadline.getDate() + 4);
      fridayDeadline.setHours(15, 0, 0, 0);
      if (now > fridayDeadline && !skipDeliverableWeeks.includes(d.week) && !completedDeliverables.includes(String(d.id))) {
        missingDeliverables.push(d.title);
      }
    });

    if (missingReflections.length > 0 || missingDeliverables.length > 0) {
      let body = `Hi ${name},\n\nYou have missing portfolio work:\n`;
      if (missingReflections.length > 0) {
        body += `\nMissing Reflections: Weeks ${missingReflections.join(', ')}`;
      }
      if (missingDeliverables.length > 0) {
        body += `\nMissing Deliverables:\n- ${missingDeliverables.join('\n- ')}`;
      }
      body += `\n\nPlease submit them as soon as possible.\n\nPortfolio: https://mbombich-robotics.github.io/CTE/Portfolio/\n\nMr. B`;

      MailApp.sendEmail({
        to: email,
        subject: 'Robotics Portfolio Reminder - Missing Work',
        body: body
      });

      emailsSent++;
      emailedStudents.push({ name, email, missingReflections, missingDeliverables });
    }
  });

  logActivity('REMINDERS', 'teacher', `Sent ${emailsSent} reminder emails via portal`);
  return { success: true, emailsSent, emailedStudents };
}

/**
 * Send reminder emails to students with missing work
 * Customize and run from Apps Script editor
 */
function sendReminderEmails() {
  // This is a template - customize before using
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Send Reminders',
    'This will send reminder emails to students with missing work. Continue?',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) return;

  const data = loadAllData();
  const currentWeek = Math.ceil((new Date() - new Date('2026-08-24')) / (1000 * 60 * 60 * 24 * 7));
  let emailsSent = 0;

  data.students.forEach(student => {
    const email = student[0];
    const name = student[1];

    // Check for missing reflections
    const submittedWeeks = data.reflections
      .filter(r => r[0] === email)
      .map(r => r[2]);

    const missingWeeks = [];
    for (let w = 1; w <= currentWeek; w++) {
      if (!submittedWeeks.includes(w)) {
        missingWeeks.push(w);
      }
    }

    if (missingWeeks.length > 0) {
      MailApp.sendEmail({
        to: email,
        subject: 'Robotics Portfolio Reminder - Missing Reflections',
        body: `Hi ${name},\n\nYou have missing weekly reflections for weeks: ${missingWeeks.join(', ')}.\n\nPlease submit them as soon as possible.\n\nPortfolio: https://mbombich-robotics.github.io/CTE/Portfolio/\n\nMr. B`
      });

      console.log(`Emailed ${email}: Missing weeks ${missingWeeks.join(', ')}`);
      emailsSent++;
    }
  });

  ui.alert(`Sent ${emailsSent} reminder emails. Check the execution log for details.`);
}

// ============================================
// AI FEEDBACK (Gemini)
// ============================================

/**
 * Get AI feedback on a student submission using Gemini API.
 * Requires GEMINI_API_KEY to be set in Script Properties:
 *   File > Project Settings > Script Properties > Add: GEMINI_API_KEY = your_key
 */
function getAIFeedback(data) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) {
    return { error: 'AI feedback is not configured. Set GEMINI_API_KEY in Script Properties.' };
  }

  const { type, content, title, week, rubricScores } = data;

  // Build the prompt based on submission type
  let submissionText = '';
  if (type === 'reflection') {
    const contributions = content.contributions || [];
    const contribText = contributions.map(c => `  ${c.date}: ${c.task}`).join('\n');
    submissionText = [
      `WEEKLY REFLECTION - Week ${week}`,
      '',
      'Daily Contributions:',
      contribText || '  (none provided)',
      '',
      'Challenges: ' + (content.challenges || '(not provided)'),
      'Solutions: ' + (content.solutions || '(not provided)'),
      '',
      'Goals for Next Week:',
      (content.goals || []).map(g => `  - ${g}`).join('\n') || '  (none provided)'
    ].join('\n');
  } else if (type === 'deliverable') {
    submissionText = [
      `DELIVERABLE: ${title || 'Untitled'}`,
      '',
      content.text || content || ''
    ].join('\n');
  }

  const selfAssessment = rubricScores ? `\nStudent self-assessment: ${JSON.stringify(rubricScores)}` : '';

  const prompt = `You are a supportive robotics engineering teacher reviewing a high school student's portfolio submission. Your goal is to help them improve their submission by one quality level.

SUBMISSION:
${submissionText}
${selfAssessment}

EVALUATION CRITERIA:
- Specificity: Does the student mention specific tools, components, code functions, or technical details? (e.g., "adjusted PID constants" vs "worked on the robot")
- Detail: Is the description thorough enough to understand what was accomplished?
- Completeness: Are all sections addressed with meaningful content?
- Insight: Does the student show genuine reflection, problem-solving thinking, and learning?

RESPONSE FORMAT - You MUST respond with valid JSON only, no markdown:
{
  "level": "A" or "B" or "C" or "D",
  "summary": "One sentence overall assessment",
  "scores": {
    "specificity": 1-4,
    "detail": 1-4,
    "completeness": 1-4,
    "insight": 1-4
  },
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["specific actionable suggestion 1", "specific actionable suggestion 2", "specific actionable suggestion 3"],
  "example": "Take one weak part of their submission and rewrite it to show what a stronger version looks like"
}

TONE GUIDELINES:
- If the submission is minimal or vague (D-level): Be warm and encouraging. Focus on easy, concrete wins. Example: "You mentioned working on the robot - try adding which specific part you worked on and what tool you used."
- If the submission shows effort but lacks depth (C-level): Be supportive but direct. Point out exactly where more detail would strengthen it.
- If the submission is solid but could be polished (B-level): Be professional. Highlight what makes it good and suggest refinements for excellence.
- If the submission is strong (A-level): Affirm the quality. Suggest minor polish only.

Remember: respond with ONLY the JSON object, no other text.`;

  try {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey;

    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024
        }
      }),
      muteHttpExceptions: true
    });

    const result = JSON.parse(response.getContentText());

    if (result.error) {
      return { error: 'Gemini API error: ' + result.error.message };
    }

    const aiText = result.candidates[0].content.parts[0].text;

    // Parse the JSON response (strip markdown code fences if present)
    const cleanJson = aiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const feedback = JSON.parse(cleanJson);

    logActivity('AI_FEEDBACK', data.email || 'unknown', `${type} week ${week || ''}: Level ${feedback.level}`);

    return { success: true, feedback };
  } catch (error) {
    logActivity('AI_ERROR', data.email || 'unknown', error.toString());
    return { error: 'Failed to get AI feedback: ' + error.toString() };
  }
}

// ============================================
// QUIZ INFRASTRUCTURE
// ============================================
//
// Quiz questions and rubrics are stored in a SEPARATE file called quiz-content.js
// which is NOT tracked in git (see .gitignore) to keep questions private from students.
//
// To set up: in the Apps Script editor, create a second script file named quiz-content.js
// and paste the contents from your local copy (ask Mr. Bombich if you need it).
//
// quiz-content.js must define:
//   const QUIZ_REGISTRY = {
//     claw: { name, sheetName, maxPoints, context, questions: [{id, label, maxPts, question, rubric}, ...] }
//   };

// Helper — returns questions array for a quiz ID (falls back to [] if registry not loaded)
function quizQuestions(quizId) {
  if (typeof QUIZ_REGISTRY !== 'undefined' && QUIZ_REGISTRY[quizId]) {
    return QUIZ_REGISTRY[quizId].questions;
  }
  return [];
}

// Helper — returns the sheet name for a quiz ID
function quizSheetName(quizId) {
  if (typeof QUIZ_REGISTRY !== 'undefined' && QUIZ_REGISTRY[quizId]) {
    return QUIZ_REGISTRY[quizId].sheetName;
  }
  return SHEET_NAMES.QUIZ; // fallback to legacy constant
}

function handleGetQuizMeta(e) {
  const quizId = (e.parameter.quizId || 'claw').trim();
  if (typeof QUIZ_REGISTRY === 'undefined' || !QUIZ_REGISTRY[quizId]) {
    return { error: 'Quiz registry not loaded or quiz not found: ' + quizId };
  }
  const quiz = QUIZ_REGISTRY[quizId];
  return {
    quizId,
    name: quiz.name,
    maxPoints: quiz.maxPoints,
    questions: quiz.questions.map(q => ({ id: q.id, label: q.label, pts: q.maxPts, text: q.question, type: q.type || 'open', options: q.options || null }))
  };
}

// QUIZ_QUESTIONS: legacy claw-quiz fallback removed. Quiz content lives in quiz-content.js (not tracked in git).
// Without quiz-content.js, quiz functions fail gracefully with a 'no questions found' error.
const QUIZ_QUESTIONS = [];

function getOrCreateQuizSheet(quizId) {
  quizId = quizId || 'claw';
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sName = quizSheetName(quizId);
  let sheet = ss.getSheetByName(sName);
  if (!sheet) {
    sheet = ss.insertSheet(sName);
    const questions = quizQuestions(quizId).length ? quizQuestions(quizId) : QUIZ_QUESTIONS;
    const headers = ['Timestamp', 'Email', 'Name'];
    questions.forEach(q => {
      headers.push(q.label + ' Answer', q.label + ' AI Score', q.label + ' AI Feedback');
    });
    headers.push('AI Total', 'Teacher Final Score');
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    let col = 4;
    questions.forEach(() => {
      sheet.setColumnWidth(col,     320);
      sheet.setColumnWidth(col + 1, 80);
      sheet.setColumnWidth(col + 2, 260);
      col += 3;
    });
    sheet.setColumnWidth(col, 80);
    sheet.setColumnWidth(col + 1, 120);
  }
  return sheet;
}

function quizEmailSubmitted(sheet, email) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).toLowerCase().trim() === email.toLowerCase().trim()) return i + 1; // 1-based row
  }
  return 0;
}

function handleCheckQuiz(e) {
  const email = (e.parameter.email || '').trim();
  if (!email) return { error: 'Missing email' };
  const quizId = (e.parameter.quizId || 'claw').trim();
  const sheet = getOrCreateQuizSheet(quizId);
  const row = quizEmailSubmitted(sheet, email);
  if (!row) return { submitted: false };

  const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  const questions = quizQuestions(quizId).length ? quizQuestions(quizId) : QUIZ_QUESTIONS;
  const grades = {};
  let col = 3; // 0-based: col 0=timestamp, 1=email, 2=name, 3=first answer
  questions.forEach(q => {
    grades[q.id] = { answer: rowData[col], score: rowData[col + 1], feedback: rowData[col + 2] };
    col += 3;
  });
  const aiTotal = rowData[col];
  return { submitted: true, grades, aiTotal };
}

function handleSubmitQuiz(data) {
  if (data.token !== TEACHER_TOKEN && !data.email) return { error: 'Unauthorized' };
  const email = (data.email || '').trim();
  if (!email) return { error: 'Missing email' };
  const quizId = (data.quizId || 'claw').trim();
  const questions = quizQuestions(quizId).length ? quizQuestions(quizId) : QUIZ_QUESTIONS;

  const sheet = getOrCreateQuizSheet(quizId);
  if (quizEmailSubmitted(sheet, email)) return { success: false, error: 'already_submitted' };

  let gradeMap = {};
  let gradingError = null;
  try {
    gradeMap = gradeQuiz(quizId, data);
  } catch(err) {
    gradingError = err.toString();
    logActivity('QUIZ_GRADE_ERROR', email, gradingError);
    questions.forEach(q => {
      gradeMap[q.id] = { score: null, feedback: 'AI grading unavailable — Mr. Bombich will grade manually.' };
    });
  }

  let aiTotal = gradingError ? null : 0;
  if (!gradingError) {
    questions.forEach(q => {
      const g = gradeMap[q.id] || { score: 0 };
      aiTotal += Math.min(Number(g.score) || 0, q.maxPts);
    });
  }

  const row = [data.timestamp || new Date().toLocaleString(), email, data.name || ''];
  questions.forEach(q => {
    const g = gradeMap[q.id] || { score: null, feedback: '' };
    const score = g.score === null ? '' : Math.min(Number(g.score) || 0, q.maxPts);
    row.push((data[q.id] || '').trim(), score, g.feedback || '');
  });
  row.push(aiTotal !== null ? aiTotal : '', '');
  sheet.appendRow(row);

  questions.forEach(q => { if (gradeMap[q.id]) gradeMap[q.id].answer = (data[q.id] || '').trim(); });

  const maxPts = (typeof QUIZ_REGISTRY !== 'undefined' && QUIZ_REGISTRY[quizId]) ? QUIZ_REGISTRY[quizId].maxPoints : 26;
  logActivity('QUIZ_SUBMIT', email, gradingError ? 'AI grading failed — saved for manual grading' : `AI Total: ${aiTotal}/${maxPts}`);
  return { success: true, grades: gradeMap, aiTotal, gradingPending: !!gradingError, gradingErrorMessage: gradingError || null };
}

function handleRegradeQuiz(data) {
  if (data.token !== TEACHER_TOKEN) return { error: 'Unauthorized' };
  const email = (data.email || '').trim();
  if (!email) return { error: 'Missing email' };
  const quizId = (data.quizId || 'claw').trim();
  const questions = quizQuestions(quizId).length ? quizQuestions(quizId) : QUIZ_QUESTIONS;

  const sheet = getOrCreateQuizSheet(quizId);
  const rowNum = quizEmailSubmitted(sheet, email);
  if (!rowNum) return { error: 'No submission found for ' + email };

  const rowData = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).getValues()[0];
  const answers = {};
  let col = 3;
  questions.forEach(q => { answers[q.id] = rowData[col]; col += 3; });

  let gradeMap, gradingError = null;
  try {
    gradeMap = gradeQuiz(quizId, answers);
  } catch(err) {
    gradingError = err.toString();
    logActivity('QUIZ_REGRADE_ERROR', email, gradingError);
    return { success: false, error: gradingError };
  }

  let aiTotal = 0;
  col = 3;
  questions.forEach(q => {
    const g = gradeMap[q.id] || { score: 0, feedback: '' };
    const score = Math.min(Number(g.score) || 0, q.maxPts);
    aiTotal += score;
    sheet.getRange(rowNum, col + 2).setValue(score);
    sheet.getRange(rowNum, col + 3).setValue(g.feedback || '');
    col += 3;
  });
  sheet.getRange(rowNum, col + 1).setValue(aiTotal);

  const maxPts = (typeof QUIZ_REGISTRY !== 'undefined' && QUIZ_REGISTRY[quizId]) ? QUIZ_REGISTRY[quizId].maxPoints : 26;
  logActivity('QUIZ_REGRADE', email, `AI Total: ${aiTotal}/${maxPts}`);
  return { success: true, grades: gradeMap, aiTotal };
}

function handleSaveQuizGrade(data) {
  if (data.token !== TEACHER_TOKEN) return { error: 'Unauthorized' };
  const email = (data.email || '').trim();
  if (!email) return { error: 'Missing email' };
  const quizId = (data.quizId || 'claw').trim();
  const questions = quizQuestions(quizId).length ? quizQuestions(quizId) : QUIZ_QUESTIONS;
  const sheet = getOrCreateQuizSheet(quizId);
  const rowNum = quizEmailSubmitted(sheet, email);
  if (!rowNum) return { error: 'No submission found' };
  // Teacher Final Score column: 1-indexed = 3(fixed cols) + N*3(question cols) + 1(aiTotal) + 1 = N*3 + 5
  // But Apps Script setRange is 1-indexed: col 1 = timestamp, so offset by 1
  // 0-indexed: col = 3 + N*3 + 1 = N*3+4; 1-indexed: N*3+5
  const teacherFinalCol = questions.length * 3 + 5;
  sheet.getRange(rowNum, teacherFinalCol).setValue(data.score);
  logActivity('QUIZ_GRADE_SAVED', email, 'Teacher final: ' + data.score);
  return { success: true };
}

function gradeQuiz(quizId, answers) {
  const questions = quizQuestions(quizId).length ? quizQuestions(quizId) : QUIZ_QUESTIONS;
  if (!questions.length) throw new Error('No questions found for quiz: ' + quizId);

  const gradeMap = {};

  // Grade MC questions deterministically — no Claude needed
  const mcQuestions   = questions.filter(q => q.type === 'mc');
  const openQuestions = questions.filter(q => q.type !== 'mc');

  mcQuestions.forEach(q => {
    const given   = (answers[q.id] || '').trim().toUpperCase();
    const correct = (q.correctAnswer || '').toUpperCase();
    const isRight = given === correct;

    // Look up the full option text so the feedback shows the actual answer,
    // not just the letter. Options are stored as e.g. "A) Foo bar"; strip the
    // leading "X) " prefix to leave just the answer content.
    let correctText = '';
    if (Array.isArray(q.options)) {
      const match = q.options.find(opt => String(opt).trim().toUpperCase().startsWith(correct + ')'));
      if (match) correctText = String(match).replace(/^\s*[A-Z]\)\s*/i, '').trim();
    }

    gradeMap[q.id] = {
      score:    isRight ? q.maxPts : 0,
      feedback: isRight
        ? 'Correct!'
        : 'Incorrect — the correct answer is ' + q.correctAnswer + (correctText ? ': ' + correctText : '') + '.'
    };
  });

  // If there are no open-ended questions, skip Claude entirely
  if (!openQuestions.length) return gradeMap;

  const context = (typeof QUIZ_REGISTRY !== 'undefined' && QUIZ_REGISTRY[quizId])
    ? (QUIZ_REGISTRY[quizId].context || 'robotics and programming')
    : 'robotics and programming';

  const apiKey = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set in Script Properties.');

  const responseTemplate = openQuestions.map(q => `  "${q.id}": {"score": <int 0-${q.maxPts}>, "feedback": "<1-2 sentences>"}`).join(',\n');
  let prompt = `You are grading a high school robotics quiz about ${context}.
Grade each answer using only its rubric. Be fair but strict. Award partial credit for partial understanding.

Respond with ONLY a valid JSON object — no markdown fences, no other text:
{\n${responseTemplate}\n}

`;

  openQuestions.forEach(q => {
    const answer = (answers[q.id] || '').trim() || '(no answer)';
    prompt += `---\nid: ${q.id} | max: ${q.maxPts}\nQuestion: ${q.question}\nRubric: ${q.rubric}\nStudent answer: "${answer.replace(/"/g, "'").substring(0, 800)}"\n\n`;
  });

  const url = 'https://api.anthropic.com/v1/messages';
  const fetchOpts = {
    method: 'post',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    payload: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    }),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, fetchOpts);
  const result = JSON.parse(response.getContentText());
  if (result.type === 'error') throw new Error('Claude: ' + result.error.message);

  const text = result.content[0].text;
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  const openGrades = JSON.parse(cleaned);
  Object.assign(gradeMap, openGrades);
  return gradeMap;
}

/**
 * Create menu when spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Robotics Portfolio')
    .addItem('Initialize Sheets', 'initializeSheets')
    .addItem('Generate Summary Report', 'generateSummaryReport')
    .addItem('Send Reminder Emails', 'sendReminderEmails')
    .addToUi();
}

// ============================================
// DESIGN BRIEF AI GRADING
// ============================================

function handleGradeDesignBrief(data) {
  if (data.token !== TEACHER_TOKEN) return { error: 'Unauthorized' };
  const deliverableId = Number(data.deliverableId);
  if (deliverableId !== 0) return { error: 'AI grading is currently only supported for D0 (Career Ready Practices)' };

  const content = (data.content || '').trim();
  if (!content) return { error: 'No reflection content provided' };
  try {
    const grades = gradeWithRubric(content, 'No external hyperlinks (plain text submission).', 0);
    return { success: true, grades };
  } catch(e) {
    return { success: false, error: e.message };
  }
}

function handleGetStudentAIFeedback(data) {
  const deliverableId = Number(data.deliverableId);
  if (deliverableId !== 0) return { success: false, error: 'AI feedback only supported for D0' };
  const content = (data.content || '').trim();
  if (!content) return { success: false, error: 'No content provided' };
  try {
    const grades = gradeWithRubric(content, 'No external hyperlinks (plain text submission).', 0);
    return { success: true, grades };
  } catch(e) {
    return { success: false, error: e.message };
  }
}

function gradeWithRubric(docText, urlNote, deliverableId) {
  const rubricD0 = `RUBRIC — DELIVERABLE 0: Career Ready Practices (20 pts):

cr_career (max 4): Student identifies a career or trade and explains their interest. Connects to something concrete from class (names a project, concept, or skill). 4=specific interest + direct class connection; 3=specific interest, generic class mention; 2=vague interest, no class connection; 1=names a career only; 0=missing.

cr_education (max 4): Describes the education or training path specific to their career (e.g., apprenticeship, associate degree, bachelor's — not just "go to college"). 4=specific path with program type and rough timeline; 3=correct path type with some detail; 2=generic ("college" or "training"); 1=present but vague or incorrect; 0=missing.

cr_financial (max 4): Shows understanding of gross vs. net pay. References actual numbers from the paycheck activity. 4=mentions take-home vs. gross, cites specific numbers, shows budget awareness; 3=mentions both but numbers are vague; 2=mentions salary only, no take-home analysis; 1=present but shows no understanding of the distinction; 0=missing.

cr_goal (max 4): States a specific financial goal for year 1 of working — must include an amount AND a purpose (e.g., "save $3,000 for a used car" not just "save money"). 4=amount + purpose + rough plan; 3=amount + purpose, no plan; 2=purpose but no amount; 1=vague ("save money", "be smart"); 0=missing.

cr_skills (max 4): Names a Career Ready skill (e.g., communication, collaboration, problem-solving) and gives a specific example of using it in class. 4=skill named + specific class example with context; 3=skill named + brief example; 2=skill named, no example; 1=generic statement; 0=missing.`;

  const criteriaKeys = ['cr_career','cr_education','cr_financial','cr_goal','cr_skills'];

  const prompt = `You are grading a high school student's Career Ready Practices reflection for an Applied Engineering & Robotics course.

SCORING PHILOSOPHY:
Award points generously when the student demonstrates genuine effort and self-awareness, even if imperfectly worded. Reserve 0-1 for sections that are truly absent or show no engagement. A thoughtful, hardworking student should score in the 85-95% range overall.

FEEDBACK TONE:
Write in an encouraging, specific voice. Speak directly to the student using "you." Lead with what they did well, then give one concrete, actionable suggestion. No empty praise. Be specific — instead of "add more detail," say "add the specific dollar amount you'd save each month."

${rubricD0}

${urlNote}

Return ONLY a valid JSON object — no markdown fences, no explanation. Feedback must be 1-2 specific sentences per criterion.

Required keys: ${criteriaKeys.join(', ')}

Example format: {"cr_career": {"score": 3, "max": 4, "feedback": "You clearly identified electrician as your top choice and connected it to the motor wiring work — add one sentence on what specifically excites you about that day-to-day work."}, ...}

STUDENT SUBMISSION:
${docText}`;

  const apiKey = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set in Script Properties.');

  const response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    payload: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    }),
    muteHttpExceptions: true
  });

  const result = JSON.parse(response.getContentText());
  if (result.type === 'error') throw new Error('Claude: ' + result.error.message);
  const text = result.content[0].text;
  const first = text.indexOf('{');
  const last  = text.lastIndexOf('}');
  if (first === -1 || last === -1) throw new Error('No JSON in Claude response: ' + text.substring(0, 200));
  return JSON.parse(text.substring(first, last + 1));
}

// gradeDesignBriefWithClaude removed — D8/D9 claw project deliverables are no longer in the curriculum.
// D0 AI grading now calls gradeWithRubric directly from handleGradeDesignBrief.
// ============================================
// AI TUTOR FUNCTIONS
// ============================================

function getTutorProgress(email, lessonId) {
  if (!email || !lessonId) return { success: false, error: 'Missing email or lessonId' };
  const sheet = getOrCreateTutorSheet();
  const data  = sheet.getDataRange().getValues();
  for (let r = 1; r < data.length; r++) {
    if (data[r][0] === email && data[r][2] === lessonId) {
      return {
        success:      true,
        found:        true,
        step:         Number(data[r][3]) || 1,
        sessions:     Number(data[r][4]) || 0,
        lastActive:   data[r][5] ? data[r][5].toString() : '',
        teacherNotes: data[r][6] || ''
      };
    }
  }
  return { success: true, found: false, step: 1, sessions: 0 };
}

function saveTutorProgress(data) {
  const { email, name, lessonId, step, incrementSession } = data;
  if (!email || !lessonId) return { success: false, error: 'Missing email or lessonId' };
  const sheet = getOrCreateTutorSheet();
  const rows  = sheet.getDataRange().getValues();
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  for (let r = 1; r < rows.length; r++) {
    if (rows[r][0] === email && rows[r][2] === lessonId) {
      const sessions = (Number(rows[r][4]) || 0) + (incrementSession ? 1 : 0);
      sheet.getRange(r + 1, 4, 1, 3).setValues([[step, sessions, today]]);
      return { success: true };
    }
  }
  sheet.appendRow([email, name || email, lessonId, step, incrementSession ? 1 : 0, today, '']);
  return { success: true };
}

function chatWithTutor(data) {
  const { lessonId, message, step, history } = data;
  if (!lessonId || !message) return { success: false, error: 'Missing lessonId or message' };
  const lesson = TUTOR_LESSONS[lessonId];
  if (!lesson) return { success: false, error: 'Unknown lesson: ' + lessonId };

  const apiKey = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  if (!apiKey) return { success: false, error: 'ANTHROPIC_API_KEY not configured in Script Properties' };

  // Cap history at last 30 exchanges to keep payload size reasonable
  const trimmedHistory = (history || []).slice(-60);

  const fetchOpts = {
    method: 'post',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    payload: JSON.stringify({
      model:      'claude-sonnet-4-6',
      max_tokens: 1024,
      system:     buildTutorPrompt(lesson, Number(step) || 1),
      messages:   [...trimmedHistory, { role: 'user', content: message }]
    }),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', fetchOpts);
  const result   = JSON.parse(response.getContentText());
  if (result.type === 'error')          return { success: false, error: 'Claude: ' + result.error.message };
  if (result.stop_reason === 'max_tokens') return { success: false, error: 'Response truncated. Try a shorter question.' };
  return { success: true, reply: result.content[0].text };
}

function buildTutorPrompt(lesson, currentStep) {
  const stepList = lesson.steps.map((s, i) => {
    const n   = i + 1;
    const tag = n < currentStep ? '[DONE]' : n === currentStep ? '[CURRENT]' : '[AHEAD]';
    return `Step ${n} ${tag}: ${s.title}\n  Goal: ${s.detail}\n  Gate question: ${s.gateQuestion}`;
  }).join('\n\n');

  const cur = lesson.steps[currentStep - 1] || lesson.steps[lesson.steps.length - 1];

  return `You are a Socratic coding tutor for Applied Engineering & Robotics at Vicksburg High School.

LESSON: ${lesson.title}
UNIT: ${lesson.unit}
BOARD: ${lesson.board} | LANGUAGE: ${lesson.language}
OBJECTIVE: ${lesson.objective}

WORKING SOLUTION — CONFIDENTIAL. Never reproduce this directly. Use it only to understand what students are building toward:
\`\`\`cpp
${lesson.targetCode}
\`\`\`

STEP SEQUENCE:
${stepList}

THE STUDENT IS CURRENTLY ON STEP ${currentStep}: "${cur.title}"
Do not help them with any step beyond Step ${currentStep} until they demonstrate understanding of the current one.

YOUR ROLE: Socratic tutor — not a code generator. Guide students to discover answers through questions, not by providing answers.

RULES (follow strictly):
1. Never reproduce the target code or write complete functions. At most 3–4 lines as a hint, and only after a genuine student attempt.
2. Never advance past Step ${currentStep}. If they ask about a later step: "Let's lock in Step ${currentStep} first."
3. Always ask what the student has already tried before explaining anything. Don't explain what hasn't been attempted.
4. Vague prompts ("make it go forward") get redirected: help the student write a specific prompt, then ask them to try again.
5. When a step looks complete, ask the gate question before confirming they can move on.
6. If asked for the full solution: "That one's yours to build. Let's look at what you have right now."
7. Keep responses SHORT: 3–5 sentences, then ask a question back.
8. Be warm. Getting stuck is expected and normal.
9. When stuck: ask ONE guiding question — not a hint, a question.
10. For bugs: don't fix them. Ask "What do you think this line does? What did you expect?"`;
}

function getOrCreateTutorSheet() {
  const ss   = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName('Tutor Progress');
  if (!sheet) {
    sheet = ss.insertSheet('Tutor Progress');
    const headers = [['Email', 'Name', 'Lesson ID', 'Current Step', 'Sessions', 'Last Active', 'Teacher Notes']];
    sheet.getRange(1, 1, 1, 7).setValues(headers).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ============================================
// DIAGNOSTICS (run manually from editor)
// ============================================

function testDriveAccess() {
  try {
    const iter = DriveApp.getFiles();
    Logger.log('Drive scope OK. Has files: ' + iter.hasNext());
  } catch(e) {
    Logger.log('Drive scope FAILED: ' + e.message);
  }
}

function testDocAccess() {
  const docUrl = 'PASTE_DOC_URL_HERE';
  const match = docUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) { Logger.log('Bad URL'); return; }
  const docId = match[1];
  try {
    const name = DriveApp.getFileById(docId).getName();
    Logger.log('SUCCESS — file name: ' + name);
  } catch(e) {
    Logger.log('FAILED — ' + e.message);
  }
}
