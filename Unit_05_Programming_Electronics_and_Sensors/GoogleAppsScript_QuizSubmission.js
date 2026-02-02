// ========================================================================
// Google Apps Script for Quiz Submission Handler
// ========================================================================
// This script receives quiz submissions from the HTML quiz page and
// writes them to a Google Sheet for grade tracking.
//
// SETUP INSTRUCTIONS:
// 1. Create a new Google Sheet
// 2. Click Extensions → Apps Script
// 3. Delete any default code and paste this entire file
// 4. Click "Deploy" → "New deployment"
// 5. Choose type: "Web app"
// 6. Execute as: "Me"
// 7. Who has access: "Anyone" (students don't need Google login for submission)
// 8. Click "Deploy"
// 9. Copy the Web App URL
// 10. Paste the URL into the HTML file where it says YOUR_GOOGLE_SCRIPT_URL_HERE
// ========================================================================

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);

    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // If this is the first submission, create headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Email',
        'Name',
        'Part A Score',
        'Part B Score',
        'Total Score',
        'Percentage',
        'Attempt #',
        'Q1', 'Q2', 'Q3', 'Q4', 'Q5',
        'Q6', 'Q7', 'Q8', 'Q9', 'Q10',
        'Q11', 'Q12', 'Q13', 'Q14', 'Q15',
        'Q16', 'Q17', 'Q18', 'Q19', 'Q20',
        'Code Feedback',
        'Submitted Code'
      ]);

      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, 30);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
    }

    // Parse the answers JSON
    const answers = JSON.parse(data.answers);
    const answerValues = new Array(20).fill(0);

    // Fill in the answer array (1 for correct, 0 for incorrect)
    answers.forEach(answer => {
      answerValues[answer.question - 1] = answer.correct;
    });

    // Parse code feedback
    const codeFeedback = JSON.parse(data.codeFeedback || '[]');
    const codeFeedbackText = codeFeedback.join('\n');

    // Create the row data
    const rowData = [
      data.timestamp,
      data.email,
      data.name,
      data.partAScore,
      data.partBScore,
      data.totalScore,
      data.percentage + '%',
      data.attemptNumber,
      ...answerValues,
      codeFeedbackText,
      data.submittedCode || ''
    ];

    // Append the data to the sheet
    sheet.appendRow(rowData);

    // Format the new row
    const lastRow = sheet.getLastRow();

    // Color code total score (column 6)
    const totalScoreCell = sheet.getRange(lastRow, 6);
    const totalScore = data.totalScore;
    const maxScore = 30;
    const percentage = (totalScore / maxScore) * 100;

    if (percentage >= 90) {
      totalScoreCell.setBackground('#d4edda'); // Green for excellent
    } else if (percentage >= 80) {
      totalScoreCell.setBackground('#fff3cd'); // Yellow for good
    } else if (percentage >= 70) {
      totalScoreCell.setBackground('#ffeaa7'); // Light orange for satisfactory
    } else {
      totalScoreCell.setBackground('#f8d7da'); // Red for needs review
    }

    // Color code Part A score (column 4)
    const partACell = sheet.getRange(lastRow, 4);
    if (data.partAScore >= 18) {
      partACell.setBackground('#d4edda');
    } else if (data.partAScore >= 16) {
      partACell.setBackground('#fff3cd');
    } else if (data.partAScore >= 14) {
      partACell.setBackground('#ffeaa7');
    } else {
      partACell.setBackground('#f8d7da');
    }

    // Color code Part B score (column 5)
    const partBCell = sheet.getRange(lastRow, 5);
    if (data.partBScore >= 9) {
      partBCell.setBackground('#d4edda');
    } else if (data.partBScore >= 8) {
      partBCell.setBackground('#fff3cd');
    } else if (data.partBScore >= 7) {
      partBCell.setBackground('#ffeaa7');
    } else {
      partBCell.setBackground('#f8d7da');
    }

    // Color code individual answers (green for correct, red for incorrect)
    for (let i = 0; i < 20; i++) {
      const answerCell = sheet.getRange(lastRow, 9 + i);  // Adjusted column offset
      if (answerValues[i] === 1) {
        answerCell.setBackground('#d4edda'); // Green
      } else {
        answerCell.setBackground('#f8d7da'); // Red
      }
    }

    // Auto-resize columns
    sheet.autoResizeColumns(1, 8);

    // Return success
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Quiz submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional - you can run this to test the script)
function testSubmission() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        email: 'test.student@vicksburgschools.org',
        name: 'Test Student',
        partAScore: 18,
        partBScore: 8,
        totalScore: 26,
        percentage: '86.7',
        timestamp: new Date().toLocaleString(),
        answers: JSON.stringify([
          {question: 1, correct: 1},
          {question: 2, correct: 1},
          {question: 3, correct: 1},
          {question: 4, correct: 1},
          {question: 5, correct: 1},
          {question: 6, correct: 1},
          {question: 7, correct: 1},
          {question: 8, correct: 1},
          {question: 9, correct: 1},
          {question: 10, correct: 1},
          {question: 11, correct: 1},
          {question: 12, correct: 1},
          {question: 13, correct: 1},
          {question: 14, correct: 1},
          {question: 15, correct: 1},
          {question: 16, correct: 1},
          {question: 17, correct: 1},
          {question: 18, correct: 1},
          {question: 19, correct: 0},
          {question: 20, correct: 0}
        ]),
        codeScore: 8,
        codeFeedback: JSON.stringify([
          '✓ Serial.begin(9600) present (2 pts)',
          '✓ pinMode(9, OUTPUT) correct (2 pts)',
          '✓ Correct variable and semicolons (2 pts)',
          '✓ PWM values corrected to 255 (2 pts)',
          '✗ analogWrite() incorrect (0 pts)'
        ]),
        submittedCode: 'void setup() {\n  Serial.begin(9600);\n  pinMode(9, OUTPUT);\n}\n\nvoid loop() {\n  // Student code here\n}',
        attemptNumber: 1
      })
    }
  };

  Logger.log(doPost(testData));
}
