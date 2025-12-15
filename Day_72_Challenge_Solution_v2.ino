/*
  Day 72 Challenge Solution
  Count from 1 to 100 using variables and Serial Monitor
  
  Requirements:
  - Declare variables with appropriate data types
  - Use Serial.begin() and Serial.println()
  - Count from 1 to 100
  
  NOTE: This solution uses ONLY concepts taught in Days 71-72:
  ✓ Variables (int)
  ✓ Serial.begin() and Serial.println()
  ✓ loop() running continuously
  ✓ Arithmetic operations (counter++)
  ✓ delay()
  
  ✗ We have NOT learned if/else yet (that's Day 73!)
  
  So the program counts continuously and students
  manually stop it after seeing 100.
*/

// ========================================
// MAIN SOLUTION
// ========================================

int counter = 1;           // Start at 1

void setup() {
  Serial.begin(9600);
  
  Serial.println("=== Counter Program ===");
  Serial.println("Counting from 1...");
  Serial.println();
}

void loop() {
  // Print the current number
  Serial.print("Count: ");
  Serial.println(counter);
  
  // Increase counter by 1
  counter++;               // Shorthand for: counter = counter + 1
  
  // Pause so we can read it
  delay(200);              // 200 milliseconds
  
  // Loop continues forever!
  // Watch it count past 100, then manually stop the program
}


/*
  ========================================
  BONUS CHALLENGE - Count Backwards
  ========================================
  
  To count DOWN from 100 to 1, change to:
  
  int counter = 100;       // Start at 100
  
  And in loop(), change to:
  
  counter--;               // Subtract 1 (same as: counter = counter - 1)
  
  It will count: 100, 99, 98, 97... 2, 1, 0, -1...
  Manually stop after seeing it reach 1!
*/


/*
  ========================================
  HOW TO USE
  ========================================
  
  1. Upload code to Arduino
  2. Open Serial Monitor (Tools → Serial Monitor or Ctrl+Shift+M)
  3. Make sure baud rate is set to 9600
  4. Watch it count!
  5. When you see it reach 100, stop the Serial Monitor
  6. Take a screenshot showing the count reached 100
  7. Submit your code + screenshot to Google Classroom
  
  ========================================
  EXPECTED OUTPUT
  ========================================
  
  === Counter Program ===
  Counting from 1...
  
  Count: 1
  Count: 2
  Count: 3
  Count: 4
  ...
  Count: 97
  Count: 98
  Count: 99
  Count: 100
  Count: 101  ← Keeps going! Stop manually
  Count: 102
  ...
*/


/*
  ========================================
  WHY DOESN'T IT STOP AT 100?
  ========================================
  
  Great question! To automatically stop at 100,
  we need an if/else statement like this:
  
  if (counter <= 100) {
    // Print the number
  } else {
    // Stop
  }
  
  But we haven't learned if/else yet!
  That's tomorrow's lesson (Day 73).
  
  For now, just manually stop the program
  when you see 100 go by.
  
  Tomorrow you'll learn how to make programs
  make decisions and stop automatically!
*/
