// Lesson 7: IR Sensor Fundamentals and Reading
// Starter Code for Lab Exercises

// IR Sensor pin definitions
const int SENSOR_1 = 6;   // Far left
const int SENSOR_2 = 7;   // Left
const int SENSOR_3 = 8;   // Center
const int SENSOR_4 = 9;   // Right
const int SENSOR_5 = 10;  // Far right

void setup() {
  // Set all sensor pins as inputs
  pinMode(SENSOR_1, INPUT);
  pinMode(SENSOR_2, INPUT);
  pinMode(SENSOR_3, INPUT);
  pinMode(SENSOR_4, INPUT);
  pinMode(SENSOR_5, INPUT);

  // Start serial communication for debugging
  Serial.begin(9600);
  Serial.println("IR Sensor Test Starting...");
}

void loop() {
  // TODO: Read all sensors
  // TODO: Print sensor values to Serial Monitor
  // TODO: Add your code here!

  delay(200);  // Small delay for readability
}
