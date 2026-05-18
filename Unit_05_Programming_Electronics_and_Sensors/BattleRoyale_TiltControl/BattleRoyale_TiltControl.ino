// =============================================================================
//  VHS Robotics — Battle Royale Tilt Controller
//  Board: Arduino Nano RP2040 Connect  (or Nano 33 IoT)
//  Library: WiFiNINA  (install via Library Manager if missing)
//
//  Setup:
//    1. Set ROBOT_ID below (unique number per robot)
//    2. Upload to robot
//    3. Connect phone to Wi-Fi "Robot-X"  password: vhs8126
//    4. Open browser → 192.168.4.1
//       iPhone  → tap "Enable Tilt" once
//       Android → use Firefox (Chrome blocks tilt on plain HTTP)
//    5. Tilt phone to drive
//
//  Tilt mapping:
//    Tilt away from you  → forward
//    Tilt toward you     → backward
//    Tilt left / right   → steer
//    Phone flat          → stop (dead zone)
// =============================================================================

#include <SPI.h>
#include <WiFiNINA.h>

// ── CHANGE THIS FOR EACH ROBOT ──────────────────────────────────────────────
#define ROBOT_ID  "Mr_Bombich"       // unique label: "1" … "24"
#define WIFI_PASS "bombich1"

// ── PIN MAP  (matches Robot_Master_RP2040.ino — do not change) ──────────────
#undef A4        // throw away WiFiNINA's definition of A4
#define A4 18    // redefine it as the plain integer 18 (the actual pin number)

const uint8_t MTR_R_INA = 6,  MTR_R_INB = 4,  MTR_R_PWM = 3;
const uint8_t MTR_L_INA = 8,  MTR_L_INB = 7,  MTR_L_PWM = 5;

// ── TUNING ───────────────────────────────────────────────────────────────────
const int   DEAD_ZONE = 10;   // degrees of tilt ignored — prevents drift when phone is flat
const int   MAX_TILT  = 40;   // degrees at which full speed is reached
const float EXPO      = 1.6;  // response curve: 1.0 = linear, 2.0 = very gentle near center

// ── GLOBALS ──────────────────────────────────────────────────────────────────
WiFiServer server(80);
unsigned long lastCmd = 0;    // watchdog timestamp

// ── SETUP ────────────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);

  pinMode(MTR_R_INA, OUTPUT); pinMode(MTR_R_INB, OUTPUT); pinMode(MTR_R_PWM, OUTPUT);
  pinMode(MTR_L_INA, OUTPUT); pinMode(MTR_L_INB, OUTPUT); pinMode(MTR_L_PWM, OUTPUT);
  stopMotors();

  WiFi.beginAP("Robot-" ROBOT_ID, WIFI_PASS);
  delay(1000);
  server.begin();

  Serial.print("AP ready.  Connect to: Robot-"); Serial.println(ROBOT_ID);
  Serial.print("Open browser to:       "); Serial.println(WiFi.localIP());
}

// ── MAIN LOOP ────────────────────────────────────────────────────────────────
void loop() {
  // Watchdog: stop motors if no command arrives within 600 ms
  // (handles phone tab closed, Wi-Fi drop, browser navigated away)
  if (lastCmd > 0 && millis() - lastCmd > 600) {
    stopMotors();
    lastCmd = 0;
  }

  WiFiClient client = server.available();
  if (!client) return;

  // Read the first line of the HTTP request
  String req = "";
  unsigned long start = millis();
  while (client.connected() && millis() - start < 300) {
    if (client.available()) {
      char c = client.read();
      if (c == '\n') break;
      req += c;
    }
  }
  while (client.available()) client.read(); // drain remaining headers

  // Route the request
  if (req.indexOf("GET /drive") >= 0) {
    int fwd  = extractParam(req, "fwd");
    int turn = extractParam(req, "turn");
    applyTilt(fwd, turn);
    lastCmd = millis();
    client.print(F("HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: 2\r\n\r\nOK"));

  } else if (req.indexOf("GET /stop") >= 0) {
    stopMotors();
    lastCmd = 0;
    client.print(F("HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: 2\r\n\r\nOK"));

  } else {
    serveControlPage(client);
  }

  client.stop();
}

// ── TILT → MOTOR SPEED ───────────────────────────────────────────────────────
void applyTilt(int fwd, int turn) {
  // Dead zone — phone sitting flat should not drift
  if (abs(fwd)  < DEAD_ZONE) fwd  = 0;
  if (abs(turn) < DEAD_ZONE) turn = 0;

  // Normalize to -1.0 … +1.0, clamped at MAX_TILT degrees
  float f = constrain((float)fwd  / MAX_TILT, -1.0f, 1.0f);
  float t = constrain((float)turn / MAX_TILT, -1.0f, 1.0f);

  // Exponential curve: gentle near center, aggressive at the edges
  f = (f >= 0 ? 1.0f : -1.0f) * pow(abs(f), EXPO);
  t = (t >= 0 ? 1.0f : -1.0f) * pow(abs(t), EXPO);

  int spd   = (int)(f * 255);   // forward/back component
  int steer = (int)(t * 130);   // left/right component

  setMotorsBidi(spd - steer, spd + steer);
}

// ── MOTOR PRIMITIVES ─────────────────────────────────────────────────────────
void setMotorsBidi(int L, int R) {
  L = constrain(L, -255, 255);
  R = constrain(R, -255, 255);

  digitalWrite(MTR_L_INA, L >= 0 ? LOW  : HIGH);
  digitalWrite(MTR_L_INB, L >= 0 ? HIGH : LOW);
  analogWrite(MTR_L_PWM, abs(L));

  digitalWrite(MTR_R_INA, R >= 0 ? LOW  : HIGH);
  digitalWrite(MTR_R_INB, R >= 0 ? HIGH : LOW);
  analogWrite(MTR_R_PWM, abs(R));
}

void stopMotors() {
  digitalWrite(MTR_L_INA, LOW); digitalWrite(MTR_L_INB, LOW); analogWrite(MTR_L_PWM, 0);
  digitalWrite(MTR_R_INA, LOW); digitalWrite(MTR_R_INB, LOW); analogWrite(MTR_R_PWM, 0);
}

// ── HTTP QUERY PARAM PARSER ───────────────────────────────────────────────────
int extractParam(const String& req, const String& key) {
  int idx = req.indexOf(key + "=");
  if (idx < 0) return 0;
  int start = idx + key.length() + 1;
  int end = start;
  while (end < (int)req.length() && (isDigit(req[end]) || req[end] == '-')) end++;
  return req.substring(start, end).toInt();
}

// ── HTML CONTROL PAGE ─────────────────────────────────────────────────────────
// Sent once when the phone browser first connects.
// The page then polls /drive every 100 ms with the current tilt angles.
void serveControlPage(WiFiClient& client) {
  client.print(F("HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n"));

  // ── HEAD & STYLES ──
  client.print(F(
    "<!DOCTYPE html><html><head>"
    "<meta charset='UTF-8'>"
    "<meta name='viewport' content='width=device-width,initial-scale=1,user-scalable=no'>"
    "<title>Robot-" ROBOT_ID "</title>"
    "<style>"
      "*{margin:0;padding:0;box-sizing:border-box}"
      "body{background:#111;color:#fff;font-family:system-ui,sans-serif;"
           "display:flex;flex-direction:column;align-items:center;"
           "justify-content:center;height:100vh;gap:0;overflow:hidden}"
      "h1{font-size:1.6rem;font-weight:900;letter-spacing:.08em;color:#e81929;margin-bottom:4px}"
      ".sub{font-size:.7rem;color:#444;letter-spacing:.12em;text-transform:uppercase;margin-bottom:22px}"
      "#arena{width:200px;height:200px;border:2px solid #2a2a2a;border-radius:50%;"
             "position:relative;background:#181818;margin-bottom:18px;flex-shrink:0}"
      "#crossH,#crossV{position:absolute;background:#222}"
      "#crossH{top:50%;left:10%;width:80%;height:1px;margin-top:-.5px}"
      "#crossV{left:50%;top:10%;height:80%;width:1px;margin-left:-.5px}"
      "#dot{width:32px;height:32px;border-radius:50%;background:#e81929;"
           "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"
           "transition:top .07s,left .07s;box-shadow:0 0 12px #e8192988}"
      "#vals{font-size:.75rem;color:#444;font-family:monospace;margin-bottom:14px}"
      "#status{font-size:.72rem;padding:5px 14px;border-radius:20px;"
              "background:#1c1c1c;color:#555;margin-bottom:18px;transition:all .3s}"
      "#status.live{background:#0d2e0d;color:#4caf50}"
      "#status.lost{background:#2e0d0d;color:#e57373}"
      "#permBtn{display:none;padding:14px 32px;background:#e81929;color:#fff;"
               "border:none;border-radius:10px;font-size:1rem;font-weight:700;cursor:pointer;"
               "letter-spacing:.05em}"
      ".hint{font-size:.65rem;color:#333;margin-top:18px;text-align:center;line-height:1.8}"
      ".hint b{color:#555}"
    "</style></head>"
  ));

  // ── BODY ──
  client.print(F("<body>"));
  client.print(F("<h1>ROBOT-" ROBOT_ID "</h1>"));
  client.print(F(
    "<p class='sub'>VHS Control Freaks &mdash; Battle Royale</p>"
    "<div id='arena'>"
      "<div id='crossH'></div><div id='crossV'></div>"
      "<div id='dot'></div>"
    "</div>"
    "<div id='vals'>fwd: &mdash; &nbsp; turn: &mdash;</div>"
    "<div id='status'>waiting for tilt&hellip;</div>"
    "<button id='permBtn' onclick='requestTilt()'>&#127755; Enable Tilt</button>"
    "<p class='hint'>"
      "<b>Tilt away</b> = forward &nbsp; <b>Tilt toward</b> = back<br>"
      "<b>Lean left/right</b> = steer &nbsp; <b>Flat</b> = stop<br>"
      "iPhone: tap Enable Tilt &bull; Android: use Firefox"
    "</p>"
  ));

  // ── JAVASCRIPT ──
  client.print(F(
    "<script>"
    "const DEAD=10,MAX=40,INTERVAL=100;"
    "const dot=document.getElementById('dot');"
    "const statusEl=document.getElementById('status');"
    "const valsEl=document.getElementById('vals');"
    "const btn=document.getElementById('permBtn');"

    // Store latest tilt; the interval loop sends it
    "let curFwd=0,curTurn=0,sending=false;"

    "function applyDead(v,d){return Math.abs(v)<d?0:v;}"
    "function clamp(v,lo,hi){return Math.max(lo,Math.min(hi,v));}"

    // Move the indicator dot inside the circle (0-100% coords)
    "function moveDot(fwd,turn){"
      "let x=clamp(50+turn/MAX*40,8,92);"
      "let y=clamp(50-fwd /MAX*40,8,92);" // y inverted: forward = dot moves up
      "dot.style.left=x+'%';dot.style.top=y+'%';"
    "}"

    // DeviceOrientation handler — updates state but does NOT fetch directly
    "function onTilt(e){"
      "curFwd =applyDead(Math.round(e.beta ||0),DEAD);"
      "curTurn=applyDead(Math.round(e.gamma||0),DEAD);"
      "valsEl.innerHTML='fwd: '+curFwd+' &nbsp; turn: '+curTurn;"
      "moveDot(curFwd,curTurn);"
      "statusEl.textContent='LIVE ●';statusEl.className='status live';"
    "}"

    // Poll loop: send tilt to robot every INTERVAL ms
    // Uses a 'sending' flag to prevent piling up requests
    "setInterval(()=>{"
      "if(sending)return;"
      "sending=true;"
      "fetch('/drive?fwd='+curFwd+'&turn='+curTurn)"
        ".then(()=>{sending=false;})"
        ".catch(()=>{"
          "sending=false;"
          "statusEl.textContent='CONNECTION LOST';statusEl.className='status lost';"
        "});"
    "},INTERVAL);"

    // iOS 13+: DeviceOrientationEvent.requestPermission() must be triggered by user gesture
    "function requestTilt(){"
      "if(typeof DeviceOrientationEvent.requestPermission==='function'){"
        "DeviceOrientationEvent.requestPermission()"
          ".then(r=>{"
            "if(r==='granted'){window.addEventListener('deviceorientation',onTilt);}"
            "btn.style.display='none';"
          "}).catch(console.error);"
      "}else{"
        "window.addEventListener('deviceorientation',onTilt);"
        "btn.style.display='none';"
      "}"
    "}"

    // Auto-attach on non-iOS; show button on iOS
    "if(typeof DeviceOrientationEvent!=='undefined'&&"
       "typeof DeviceOrientationEvent.requestPermission==='function'){"
      "btn.style.display='block';" // iOS — needs button tap first
    "}else{"
      "window.addEventListener('deviceorientation',onTilt);" // Android/desktop
    "}"

    // Send stop when the tab is hidden (phone locked, app switched)
    "document.addEventListener('visibilitychange',()=>{"
      "if(document.hidden)fetch('/stop').catch(()=>{});"
    "});"
    "</script></body></html>"
  ));
}
