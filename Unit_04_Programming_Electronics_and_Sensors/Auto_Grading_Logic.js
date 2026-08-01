/*
  AUTO-GRADING LOGIC FOR PRACTICAL TEST

  This function grades submitted Arduino code and returns a score out of 10 points.

  Checks performed:
  1. Serial.begin(9600) present - 2 points
  2. pinMode(9, OUTPUT) correct - 2 points
  3. Missing semicolon fixed / correct variable used - 2 points
  4. PWM values in valid range (0-255) - 2 points
  5. analogWrite() usage correct - 2 points
*/

function gradeCode(submittedCode) {
  let score = 0;
  let feedback = [];
  const maxScore = 10;

  // Clean up code for analysis (remove comments and extra whitespace)
  const cleanCode = submittedCode
    .replace(/\/\*[\s\S]*?\*\//g, '')  // Remove block comments
    .replace(/\/\/.*/g, '')             // Remove line comments
    .replace(/\s+/g, ' ')               // Normalize whitespace
    .trim();

  // ===== CHECK 1: Serial.begin(9600) - 2 points =====
  if (/Serial\.begin\s*\(\s*9600\s*\)/.test(cleanCode)) {
    score += 2;
    feedback.push('✓ Serial.begin(9600) present (2 pts)');
  } else {
    if (/Serial\.begin/.test(cleanCode)) {
      feedback.push('✗ Serial.begin() found but incorrect baud rate (0 pts) - Use 9600 as the baud rate to match the Serial Monitor');
    } else {
      feedback.push('✗ Serial.begin(9600) missing (0 pts) - You need to initialize Serial communication in setup() with Serial.begin(9600)');
    }
  }

  // ===== CHECK 2: pinMode(9, OUTPUT) - 2 points =====
  if (/pinMode\s*\(\s*9\s*,\s*OUTPUT\s*\)/.test(cleanCode)) {
    score += 2;
    feedback.push('✓ pinMode(9, OUTPUT) correct (2 pts)');
  } else {
    if (/pinMode\s*\(\s*9\s*,\s*INPUT\s*\)/.test(cleanCode)) {
      feedback.push('✗ pinMode(9, INPUT) found (0 pts) - Pin 9 should be set to OUTPUT, not INPUT, because we\'re sending PWM signals OUT to control a motor');
    } else if (/pinMode/.test(cleanCode)) {
      feedback.push('✗ pinMode() found but incorrect parameters (0 pts) - Should be pinMode(9, OUTPUT) to configure pin 9 as an output');
    } else {
      feedback.push('✗ pinMode(9, OUTPUT) missing (0 pts) - You must configure pin 9 as OUTPUT in setup() before using analogWrite()');
    }
  }

  // ===== CHECK 3: Variable usage & semicolons - 2 points =====
  // Check that pwmValue is used correctly in Serial.println
  const hasPwmValuePrint = /Serial\.println\s*\(\s*pwmValue\s*\)\s*;/.test(cleanCode);
  const hasMotorSpeedPrint = /Serial\.println\s*\(\s*motorSpeed\s*\)/.test(cleanCode);
  const hasProperSemicolons = !/(Serial\.print|Serial\.println)\s*\([^)]*\)\s*(?!;)/.test(cleanCode);

  if (hasPwmValuePrint && hasProperSemicolons) {
    score += 2;
    feedback.push('✓ Correct variable usage and semicolons (2 pts)');
  } else if (hasPwmValuePrint || hasProperSemicolons) {
    score += 1;
    feedback.push('⚠ Partial credit: variable or semicolon issues (1 pt)');
  } else {
    if (hasMotorSpeedPrint) {
      feedback.push('✗ Variable usage incorrect (0 pts) - You\'re printing "motorSpeed" which never changes! Print "pwmValue" instead to show the calculated speed values (0, 25, 50, etc.)');
    } else {
      feedback.push('✗ Variable usage or semicolons incorrect (0 pts) - Make sure to print the pwmValue variable and include semicolons after each statement');
    }
  }

  // ===== CHECK 4: PWM values in range (0-255) - 2 points =====
  // Check that 300 has been changed to 255
  const has300 = /analogWrite\s*\([^,]+,\s*300\s*\)/.test(cleanCode) ||
                 /println\s*\(\s*300\s*\)/.test(cleanCode);
  const has255 = /analogWrite\s*\([^,]+,\s*255\s*\)/.test(cleanCode) &&
                 /println\s*\(\s*255\s*\)/.test(cleanCode);

  if (!has300 && has255) {
    score += 2;
    feedback.push('✓ PWM values corrected to valid range (2 pts)');
  } else if (has255) {
    score += 1;
    feedback.push('⚠ PWM partially corrected (1 pt)');
  } else {
    if (has300) {
      feedback.push('✗ PWM values still out of range (0 pts) - The value 300 exceeds the maximum PWM value of 255. Change both analogWrite(9, 300) and Serial.println(300) to use 255 instead');
    } else {
      feedback.push('✗ PWM values incorrect (0 pts) - Missing the final analogWrite() and println() calls that should output 255 (the maximum PWM value)');
    }
  }

  // ===== CHECK 5: analogWrite() usage - 2 points =====
  const analogWriteCount = (cleanCode.match(/analogWrite\s*\(/g) || []).length;
  const hasLoopAnalogWrite = /analogWrite\s*\(\s*9\s*,\s*pwmValue\s*\)/.test(cleanCode);

  if (analogWriteCount >= 2 && hasLoopAnalogWrite) {
    score += 2;
    feedback.push('✓ analogWrite() used correctly (2 pts)');
  } else if (analogWriteCount >= 1) {
    score += 1;
    if (!hasLoopAnalogWrite) {
      feedback.push('⚠ analogWrite() partially correct (1 pt) - Found analogWrite(), but it should use "pwmValue" as the second parameter inside the for loop');
    } else {
      feedback.push('⚠ analogWrite() partially correct (1 pt) - You should have TWO analogWrite() calls: one inside the loop using pwmValue, and one after the loop');
    }
  } else {
    feedback.push('✗ analogWrite() usage incorrect (0 pts) - Missing analogWrite() function calls. You need to send PWM signals to pin 9');
  }

  return {
    score: score,
    maxScore: maxScore,
    percentage: Math.round((score / maxScore) * 100),
    feedback: feedback,
    passed: score >= 7  // 70% to pass
  };
}

// ===== EXAMPLE USAGE =====
/*
const studentCode = `
void setup() {
  Serial.begin(9600);
  pinMode(9, OUTPUT);
}

void loop() {
  int motorSpeed = 0;

  for (int i = 0; i <= 10; i++) {
    int pwmValue = i * 25;

    Serial.print("Motor Speed: ");
    Serial.println(pwmValue);

    analogWrite(9, pwmValue);
    delay(500);
  }

  analogWrite(9, 255);
  Serial.print("Motor Speed: ");
  Serial.println(255);

  delay(5000);
}
`;

const result = gradeCode(studentCode);
console.log('Score:', result.score + '/' + result.maxScore);
console.log('Percentage:', result.percentage + '%');
console.log('Passed:', result.passed);
console.log('Feedback:');
result.feedback.forEach(item => console.log('  ' + item));
*/
