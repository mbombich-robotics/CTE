// Lesson 11: Ultrasonic Sensor - Basic Distance Reading
// Starter Code for Lab Exercises

// HC-SR04 pin definitions
const int trigPin = 9;
const int echoPin = 10;

void setup() {
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.println("Ultrasonic Sensor Ready!");
}

void loop() {
  long distance = getDistance();

  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  delay(100);
}

long getDistance() {
  // Send trigger pulse
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Read echo pulse duration
  long duration = pulseIn(echoPin, HIGH);

  // Convert to distance in cm
  long distance = duration / 58;

  return distance;
}
