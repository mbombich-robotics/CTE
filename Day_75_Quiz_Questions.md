# Day 75: Arduino Fundamentals Quiz
## Google Classroom Quiz Question Bank

**Total Questions:** 20 (5 from each day)  
**Format:** Multiple Choice  
**Coverage:** Days 71-74 (Arduino Introduction through Analog Input & PWM)

---

## Day 71: Arduino Introduction (Questions 1-5)

### Question 1: Code Structure
**Which function runs continuously in Arduino?**
- A) setup()
- B) loop() ✓
- C) main()
- D) run()

**Answer:** B - loop()  
**Explanation:** The loop() function runs continuously after setup() completes, allowing your Arduino to repeatedly execute code.

---

### Question 2: pinMode()
**What must you do before using digitalWrite()?**
- A) Nothing
- B) Set pinMode to OUTPUT ✓
- C) Call Serial.begin()
- D) Add a delay

**Answer:** B - Set pinMode to OUTPUT  
**Explanation:** You must configure a pin as OUTPUT using pinMode() before you can write to it with digitalWrite().

---

### Question 3: delay() Function
**What does delay(1000) do?**
- A) Wait 1 second ✓
- B) Wait 1000 seconds
- C) Wait 1 minute
- D) Blink LED

**Answer:** A - Wait 1 second  
**Explanation:** delay() takes milliseconds as a parameter. 1000 milliseconds = 1 second.

---

### Question 4: digitalWrite() Values
**What are the two possible values for digitalWrite()?**
- A) 0 and 1
- B) ON and OFF
- C) HIGH and LOW ✓
- D) True and False

**Answer:** C - HIGH and LOW  
**Explanation:** digitalWrite() accepts HIGH (5V) or LOW (0V) as parameters.

---

### Question 5: Semicolons
**What happens if you forget a semicolon at the end of a statement?**
- A) Nothing
- B) Compile error ✓
- C) Warning only
- D) Arduino crashes

**Answer:** B - Compile error  
**Explanation:** Missing semicolons cause the Arduino IDE to fail compilation with an error message.

---

## Day 72: Variables & Serial Monitor (Questions 6-10)

### Question 6: Variable Declaration
**Which is the correct way to declare an integer variable?**
- A) var x = 5;
- B) int x = 5; ✓
- C) integer x = 5;
- D) x = 5;

**Answer:** B - int x = 5;  
**Explanation:** Arduino uses 'int' as the keyword for integer variables, followed by the variable name and optional initial value.

---

### Question 7: Data Types
**Which data type stores decimal numbers?**
- A) int
- B) boolean
- C) float ✓
- D) char

**Answer:** C - float  
**Explanation:** float (floating-point) data type stores decimal numbers, while int only stores whole numbers.

---

### Question 8: Serial.begin()
**What is the most common default baud rate used with Serial.begin()?**
- A) 300
- B) 9600 ✓
- C) 115200
- D) 57600

**Answer:** B - 9600  
**Explanation:** While any baud rate can work if both Serial.begin() and the Serial Monitor match, 9600 is the standard default used in most Arduino examples and tutorials.

---

### Question 9: Serial.print vs Serial.println
**What's the difference between print() and println()?**
- A) No difference
- B) println adds a newline ✓
- C) print is faster
- D) println is deprecated

**Answer:** B - println adds a newline  
**Explanation:** Serial.println() automatically adds a newline character after printing, while Serial.print() does not.

---

### Question 10: Variable Scope
**Where should you declare a variable used in both setup() and loop()?**
- A) In setup()
- B) In loop()
- C) Before setup() (globally) ✓
- D) Anywhere

**Answer:** C - Before setup() (globally)  
**Explanation:** Global variables (declared before setup()) can be accessed by both setup() and loop().

---

## Day 73: Digital Input & Control Structures (Questions 11-15)

### Question 11: INPUT_PULLUP Behavior
**With INPUT_PULLUP, what state is the pin when the button is NOT pressed?**
- A) LOW
- B) HIGH ✓
- C) Random/Floating
- D) 0

**Answer:** B - HIGH  
**Explanation:** INPUT_PULLUP uses an internal resistor to pull the pin HIGH when nothing is connected. Pressing the button connects it to ground (LOW).

---

### Question 12: Comparison Operators
**What symbol means "equals" in an if statement?**
- A) =
- B) == ✓
- C) ===
- D) !=

**Answer:** B - ==  
**Explanation:** Single = is assignment, double == is comparison. Use == in if statements to test equality.

---

### Question 13: digitalRead() Return Value
**What does digitalRead() return?**
- A) 0-1023
- B) HIGH or LOW ✓
- C) A voltage value
- D) True or False

**Answer:** B - HIGH or LOW  
**Explanation:** digitalRead() returns either HIGH (5V) or LOW (0V), representing the digital state of the pin.

---

### Question 14: else Statement
**When does the else block execute?**
- A) Always
- B) When if condition is false ✓
- C) When if condition is true
- D) Never

**Answer:** B - When if condition is false  
**Explanation:** The else block only runs when the if condition evaluates to false.

---

### Question 15: Button Wiring
**When using INPUT_PULLUP, how should you wire the button?**
- A) Pin to 5V
- B) Pin to Ground ✓
- C) Between 5V and Ground
- D) No connection needed

**Answer:** B - Pin to Ground  
**Explanation:** With INPUT_PULLUP, one side of the button connects to the pin, the other to ground. Pressing connects pin to ground (LOW).

---

## Day 74: Analog Input & PWM (Questions 16-20)

### Question 16: analogRead() Range
**What range does analogRead() return?**
- A) 0-255
- B) 0-1023 ✓
- C) 0-1024
- D) 0-5

**Answer:** B - 0-1023  
**Explanation:** Arduino's 10-bit ADC provides 1024 possible values (2^10), numbered 0-1023.

---

### Question 17: analogWrite() Range
**What range does analogWrite() accept?**
- A) 0-255 ✓
- B) 0-1023
- C) 0-100
- D) LOW or HIGH

**Answer:** A - 0-255  
**Explanation:** PWM output uses 8-bit resolution, giving 256 levels (0-255).

---

### Question 18: PWM Pins
**Which pins support PWM on Arduino Uno?**
- A) All digital pins
- B) Pins 3, 5, 6, 9, 10, 11 ✓
- C) Only pin 13
- D) Pins A0-A5

**Answer:** B - Pins 3, 5, 6, 9, 10, 11  
**Explanation:** Only pins marked with ~ (tilde) support PWM on the Arduino Uno.

---

### Question 19: map() Function
**What does map(512, 0, 1023, 0, 255) return?**
- A) 512
- B) 255
- C) 127 ✓
- D) 0

**Answer:** C - 127  
**Explanation:** map() converts 512 (middle of 0-1023) proportionally to the middle of 0-255, which is approximately 127.

---

### Question 20: PWM Concept
**What does PWM stand for?**
- A) Power Width Modulation
- B) Pulse Width Modulation ✓
- C) Pin Wave Mode
- D) Programmable Wave Method

**Answer:** B - Pulse Width Modulation  
**Explanation:** PWM (Pulse Width Modulation) rapidly switches a digital signal on and off to simulate analog output.

---

## Quiz Administration Tips

### Google Classroom Setup:
1. Create a new "Quiz assignment"
2. Set point value (suggested: 20 points, 1 per question)
3. Import questions from this document
4. Set as "Quiz" type for auto-grading
5. Randomize question order (optional)
6. Set time limit if desired (suggested: 25-30 minutes)

### Grading:
- 18-20 correct: Excellent (90-100%)
- 16-17 correct: Good (80-89%)
- 14-15 correct: Satisfactory (70-79%)
- Below 14: Needs review (below 70%)

### Study Resources Students Should Review:
- All four lesson slide presentations
- Interactive demos and simulations
- Daily assignments completed
- Expandable "Deep Dive" sections
- Code examples from each lesson

---

## Question Distribution by Topic

### Code Structure & Syntax (5 questions)
- Q1: loop() function
- Q2: pinMode() requirement
- Q3: delay() timing
- Q5: Semicolons
- Q12: Comparison operators

### Variables & Data (3 questions)
- Q6: Variable declaration
- Q7: Data types
- Q10: Variable scope

### Serial Communication (2 questions)
- Q8: Baud rate
- Q9: print vs println

### Digital I/O (4 questions)
- Q4: digitalWrite values
- Q11: INPUT_PULLUP behavior
- Q13: digitalRead return
- Q15: Button wiring

### Analog I/O & PWM (4 questions)
- Q16: analogRead range
- Q17: analogWrite range
- Q18: PWM pins
- Q20: PWM definition

### Control Structures (1 question)
- Q14: else statement

### Functions & Conversions (1 question)
- Q19: map() function

---

## Answer Key (Quick Reference)

1. B  |  6. B   |  11. B  |  16. B
2. B  |  7. C   |  12. B  |  17. A
3. A  |  8. B   |  13. B  |  18. B
4. C  |  9. B   |  14. B  |  19. C
5. B  | 10. C   |  15. B  |  20. B

