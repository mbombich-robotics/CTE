// Lesson 7: IR Sensor Fundamentals and Reading
// Starter Code for Lab Exercises

// IR sensor pin definitions
const int IR_1 = A2;             // IR 1 sensor input
const int IR_2 = 0;              // IR 2 sensor input
const int IR_3 = 2;              // IR 3 sensor input
const int IR_4 = 1;              // IR 4 sensor input
const int IR_5 = A3;             // IR 5 sensor input

void setup() {
  Serial.begin(9600);
  Serial.println("IR Sensor Test Starting...");

  // Set IR sensor pins as inputs
  pinMode(IR_1, INPUT);
  pinMode(IR_2, INPUT);
  pinMode(IR_3, INPUT);
  pinMode(IR_4, INPUT);
  pinMode(IR_5, INPUT);
}

void loop() {
  // Read and print IR sensors as a 5-bit pattern (IR5 IR4 IR3 IR2 IR1)
  // Open Serial Monitor (9600 baud) to see sensor values
  if (digitalRead(IR_5) == HIGH) {
    Serial.print("1");
  } else {
    Serial.print("0");
  }

  if (digitalRead(IR_4) == HIGH) {
    Serial.print("1");
  } else {
    Serial.print("0");
  }

  if (digitalRead(IR_3) == HIGH) {
    Serial.print("1");
  } else {
    Serial.print("0");
  }

  if (digitalRead(IR_2) == HIGH) {
    Serial.print("1");
  } else {
    Serial.print("0");
  }

  if (digitalRead(IR_1) == HIGH) {
    Serial.println("1");
  } else {
    Serial.println("0");
  }

  delay(500);
}
