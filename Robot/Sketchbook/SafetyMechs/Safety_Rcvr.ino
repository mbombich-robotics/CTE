#include <WiFiNINA.h>


char ssid[] = "8126_AP"; // Your network SSID
char pass[] = "freakout"; // Your network password

#define LOOP_MS 20
#define COMM_LOST_STATE 0
#define COMM_GOOD_STATE 1
#define HALT_RCVD_STATE 2
#define MSG_MATCH_ADR 3
#define COMM_GOOD_MRK 15
#define GRN_FLSH_THRSH 50

const int grn_led = 4;
const int red_led = 5;
const int contact_cntl = 2;
int state = COMM_LOST_STATE;
int comm_cntr = 0;
int led_flash_tmr = 0;


int status = WL_IDLE_STATUS;

WiFiUDP Udp;

unsigned int Port = 2390; // local port to listen on



void setup() {


  Serial.begin(9600);
//  while (!Serial);
//  Serial.println("Serial debug/status port initialized.");


  pinMode(grn_led, OUTPUT);
  pinMode(red_led , OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(contact_cntl, OUTPUT);
  digitalWrite(grn_led, LOW);
  digitalWrite(red_led, LOW);
  digitalWrite(LED_BUILTIN, LOW);
  digitalWrite(contact_cntl, LOW);
  digitalWrite(LED_BUILTIN, LOW);


//  Serial.print("Attempting to create access point named: ");
//  Serial.println(ssid);

  // Create access point
  status = WiFi.beginAP(ssid, pass);
  if (status != WL_AP_LISTENING) {
//    Serial.println("Creating access point failed");
    while (true);
  }

  IPAddress ip = WiFi.localIP();

//  Serial.print("AP IP address: ");
//  Serial.println(ip);


  Udp.begin(Port);

//  Serial.print("Listening on port ");
//  Serial.println(localPort);
}

void loop() {
  char packetBuffer[255];
  IPAddress remoteIp;
  strcpy(packetBuffer, "NULL");
  int packetSize = Udp.parsePacket();
  if (packetSize) {

//    Serial.print("Received packet of size ");
//    Serial.println(packetSize);
//    Serial.print("From ");

    remoteIp = Udp.remoteIP();

//    Serial.print(remoteIp);
//    Serial.print(", port ");



    // Read the packet into a char array
    int len = Udp.read(packetBuffer, 255);
    if (len >= 0) {
      packetBuffer[len] = 0; // Null-terminate the string
    }
  }

  if (strcmp(packetBuffer, "8126 bot HALT") == 0) {
    state = HALT_RCVD_STATE;
    digitalWrite(contact_cntl, LOW);
    digitalWrite(LED_BUILTIN, LOW);
    digitalWrite(grn_led, LOW);
    digitalWrite(red_led, HIGH);
  }
  else if (state == COMM_LOST_STATE) {
    if (strcmp(packetBuffer, "8126 bot GOOD") == 0) {
      comm_cntr = comm_cntr + MSG_MATCH_ADR;
      if (comm_cntr >= COMM_GOOD_MRK) {
        comm_cntr = COMM_GOOD_MRK;
        state = COMM_GOOD_STATE;
        digitalWrite(grn_led, HIGH);
        digitalWrite(contact_cntl, HIGH);
        digitalWrite(LED_BUILTIN, HIGH);
        led_flash_tmr = 0;
      }
    }
    else if (state == COMM_LOST_STATE) {
      if (++led_flash_tmr >= GRN_FLSH_THRSH) {
        led_flash_tmr = 0;
        digitalWrite(grn_led, !digitalRead(grn_led));
      }
    }
  }
  else if (state == COMM_GOOD_STATE) {
    if (strcmp(packetBuffer, "8126 bot GOOD") == 0) {
      comm_cntr = comm_cntr + MSG_MATCH_ADR;
//      send_ack();
      if (comm_cntr >= COMM_GOOD_MRK) {
        comm_cntr = COMM_GOOD_MRK;
      }
    }
    else if (--comm_cntr <= 0) {
      state = COMM_LOST_STATE;
      digitalWrite(grn_led, LOW);
      digitalWrite(contact_cntl, LOW);
      digitalWrite(LED_BUILTIN, LOW);
      led_flash_tmr = 0;
    }
  }
  else if (state == HALT_RCVD_STATE) {  // should not ever see this line execute let alone be true
    digitalWrite(LED_BUILTIN, HIGH);
    digitalWrite(contact_cntl, LOW);
    digitalWrite(LED_BUILTIN, LOW);
    digitalWrite(grn_led, LOW);
    digitalWrite(red_led, HIGH);
  }
  else {  // invalid state error (this line should never execute as it means state is invalid)
    digitalWrite(LED_BUILTIN, HIGH);
    digitalWrite(contact_cntl, LOW);
    digitalWrite(LED_BUILTIN, LOW);
    digitalWrite(grn_led, LOW);
    digitalWrite(red_led, HIGH);
  }

//    Serial.println("Contents:");
//    Serial.println(packetBuffer);

  delay(LOOP_MS);
}
