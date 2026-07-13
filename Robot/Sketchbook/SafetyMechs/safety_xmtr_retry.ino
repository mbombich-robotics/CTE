#include <WiFiNINA.h>
#include <WiFiUdp.h>
#include <string.h>

char ssid[] = "8126_AP"; // Your network SSID (same as AP)
char pass[] = "freakout"; // Your network password (same as AP)

#define LOOP_MS 50
#define WDT_TIME_MS 4000

const int grn_led = 4;
const int red_led = 5;
const int estop_button = 3;
int estop_btn_state = HIGH;
bool udpActive = false;
const unsigned long REJOIN_MIN_DELAY_MS = 1000;  // min backoff
const unsigned long REJOIN_MAX_DELAY_MS = 15000; // max backoff
unsigned long lastReconnectAttempt = 0;

#define RUN_STATE 0
#define ESTOP_STATE 1
#define CONSEC_GOOD 4

int state = RUN_STATE;                 // start out on the RUN_STATE no valid estop debounced

int estop_consec = 0;         // keep track of consective key button hits to leave state

int status = WL_IDLE_STATUS;
IPAddress remoteIP(192, 168, 4, 1); // IP address of the AP (usually 192.168.4.1 for AP mode)
unsigned int remotePort = 2390; // Port the AP is listening on

WiFiUDP Udp;

void stopUDP() {
  if (udpActive) {
    Udp.stop();
    udpActive = false;
    Serial.println("[UDP] Stopped.");
  }
}

bool startUDP() {
  stopUDP();
  if (Udp.begin(remotePort) == 1) {
    udpActive = true;
    Serial.print("[UDP] Started on remote port "); 
    Serial.println(remotePort);
    return true;
  } else {
    Serial.println("[UDP] Failed to bind local port.");
    udpActive = false;
    return false;
  }
}

void fullDisconnect() {
  stopUDP();
  // Ensure WiFi stack is fully reset (helps after AP resets)
  Serial.println("WiFi Disconnect");
  WiFi.disconnect();   // drop current connection
  Serial.println("WiFi End");
  WiFi.end();          // reset driver state
  delay(200);
}

bool connectWiFi() {
  Serial.print("[WiFi] Connecting to ");
  Serial.println(ssid);

  // Optional: shorter connect timeout so loop stays responsive
  WiFi.setTimeout(10000); // 10s

  int status;
  unsigned long t0 = millis();
  // Try until connected or timeout (we'll handle backoff outside)
  do {
    status = WiFi.begin(ssid, pass);
    if (status == WL_CONNECTED) break;

    // Some statuses return immediately; give radio time
    delay(1000);
    digitalWrite(grn_led, !digitalRead(grn_led));
  } while ((millis() - t0) < 6000);

  if (status == WL_CONNECTED) {
    Serial.println("[WiFi] Connected.");
      // Re-bind UDP socket after WiFi is up
    if (!startUDP()) {
      // If UDP can't bind, treat as failure so we retry later
      Serial.println(F("[WiFi] UDP bind failed after connect."));
      return false;
    }
    return true;
  }

  Serial.println(F("[WiFi] Connect attempt timed out/failed."));
  return false;
}


bool isWiFiHealthy() {
  // Primary indicator
  if (WiFi.status() != WL_CONNECTED) return false;

  // Optional: actively verify reachability to gateway or server.
  // Not all firmware supports ping; if your core supports it, uncomment:
  // if ((millis() - lastPingCheck) >= PING_AP_MS) {
  //   lastPingCheck = millis();
  //   int pingMs = WiFi.ping(WiFi.gatewayIP()); // or remoteIP
  //   if (pingMs < 0) {
  //     Serial.println(F("[WiFi] Ping failed; treating link as unhealthy."));
  //     return false;
  //   }
  // }
  //
  // Another good option would be to have the access point node respond with
  // an ACK message on every properly received message from this client. This
  // could be used to verify to the client that the AP was receiving valid 
  // messages. It is not clear what action the client would be best in taking
  // if it integrarted the lack the missing ACK messages and determined there
  // was not a reliable full duplex link.  Options (not exclusive) are 1) Give
  // a visual indicator to the user of the transmitter client to indicate that
  // safety override may not be working and as such the bot should be manually
  // shut down/taking out of operation. 2) Start sending HALT message to the 
  // reciever with the hope that comm messages are getting to the AP and will
  // remotely bring down the bot due to a questionable link. 3) Try to stop
  // and the reestablis the link to the AP, prefferably after the HALT messages
  // had already been sent out.
  //
  // The ACK message approach was given some effort, but it was given up to
  // future enhancements as there was difficulty getting the messages from the
  // AP back to the client.  Better to get an some independent safety shut down 
  // circuit in play, then wait for the ACK feature. (tpuvogel)

  return true;
}

void setup() {
  Serial.begin(9600);
//  while (!Serial);

  pinMode(grn_led, OUTPUT);
  pinMode(red_led , OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(estop_button, INPUT);
  digitalWrite(grn_led, LOW);
  digitalWrite(red_led, LOW);
  connectWiFi();
}

void loop() {
  int x = 0;
  int y = 0;
  char packetBuffer[255];
  while (!isWiFiHealthy()) {
    digitalWrite(grn_led, !digitalRead(grn_led));
    delay(1000);
    digitalWrite(grn_led, !digitalRead(grn_led));
    if (!isWiFiHealthy()) {
      Serial.println(F("[WiFi] Link unhealthy; tearing down and scheduling reconnect."));
      fullDisconnect();
      if (connectWiFi()) {
        digitalWrite(grn_led, HIGH);
        break;
      }
    }
  }
  String message = "8126 bot HALT";
  estop_btn_state = digitalRead(estop_button);          // read estop button each loop cycle

  if (state == RUN_STATE) {
    if (estop_btn_state == LOW) {
      state = ESTOP_STATE;
      digitalWrite(red_led, HIGH);
      estop_consec = 0;
    }
    else {
      digitalWrite(red_led, LOW);
      message = "8126 bot GOOD";
    }
  }
  else {
    if (estop_btn_state == HIGH) {
      if (++estop_consec >= CONSEC_GOOD) {
        estop_consec = 0;
        state = RUN_STATE;
        digitalWrite(red_led, LOW);
        String message = "8126 bot GOOD";

      }
    }
    else {
      estop_consec = 0;
    }
  }
  
  y = 0;
  if (Udp.beginPacket(remoteIP, remotePort) == 0) {
//    Serial.println("Udp.beginPacket error");
    y = 1;
  }
  Udp.print(message);
  x = Udp.endPacket();
  if (x == 0) {
    Serial.println("Udp.endPacket error");
    y = 1;
  }
  if (y == 1) {
    digitalWrite(grn_led, LOW);
  }
  else {
    digitalWrite(grn_led, HIGH);
  }

  delay(LOOP_MS);
}