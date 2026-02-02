/*
  GOOGLE APPS SCRIPT FOR HOMEWORK SUBMISSIONS

  This script receives homework submissions from students and organizes them
  into separate sheets based on which lesson the homework is for.

  SETUP INSTRUCTIONS:
  1. Create a new Google Sheet called "Unit 5 Homework Submissions"
  2. Click Extensions → Apps Script
  3. Delete any default code and paste this entire file
  4. Click "Deploy" → "New deployment"
  5. Choose type: "Web app"
  6. Execute as: "Me"
  7. Who has access: "Anyone"
  8. Click "Deploy"
  9. Copy the Web App URL
  10. Replace 'YOUR_GOOGLE_SCRIPT_URL_HERE' in each homework HTML file
*/

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);

    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Determine which sheet to use based on lesson
    const sheetName = data.lesson || 'Lesson 2'; // Default to Lesson 2
    let sheet = ss.getSheetByName(sheetName);

    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);

      // Add headers for new sheet
      sheet.appendRow([
        'Timestamp',
        'Student Email',
        'Student Name',
        'Assignment',
        'Code Submitted',
        'Notes',
        'Status',
        'Grade',
        'Feedback'
      ]);

      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');

      // Set column widths
      sheet.setColumnWidth(1, 150); // Timestamp
      sheet.setColumnWidth(2, 200); // Email
      sheet.setColumnWidth(3, 150); // Name
      sheet.setColumnWidth(4, 200); // Assignment
      sheet.setColumnWidth(5, 400); // Code
      sheet.setColumnWidth(6, 300); // Notes
      sheet.setColumnWidth(7, 100); // Status
      sheet.setColumnWidth(8, 80);  // Grade
      sheet.setColumnWidth(9, 300); // Feedback
    }

    // Check for duplicate submission (same email + assignment)
    const existingData = sheet.getDataRange().getValues();
    let isDuplicate = false;
    let duplicateRow = -1;

    for (let i = 1; i < existingData.length; i++) {
      if (existingData[i][1] === data.email && existingData[i][3] === data.assignment) {
        isDuplicate = true;
        duplicateRow = i + 1;
        break;
      }
    }

    // Prepare row data
    const rowData = [
      data.timestamp,
      data.email,
      data.name,
      data.assignment,
      data.code,
      data.notes || '',
      'Submitted',
      '', // Grade - to be filled by teacher
      ''  // Feedback - to be filled by teacher
    ];

    if (isDuplicate) {
      // Update existing submission
      sheet.getRange(duplicateRow, 1, 1, 9).setValues([rowData]);

      // Highlight as resubmission
      sheet.getRange(duplicateRow, 1, 1, 9).setBackground('#fff3cd');

      // Add note in status
      sheet.getRange(duplicateRow, 7).setValue('Resubmitted');

    } else {
      // New submission
      sheet.appendRow(rowData);

      // Get the row number of the new submission
      const lastRow = sheet.getLastRow();

      // Color code status
      sheet.getRange(lastRow, 7).setBackground('#d4edda'); // Green for submitted
    }

    // Auto-resize columns for code and notes
    sheet.autoResizeColumn(5); // Code column
    sheet.autoResizeColumn(6); // Notes column

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Homework submitted successfully',
      isDuplicate: isDuplicate
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function - you can run this to test the script
function testSubmission() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        lesson: 'Lesson 2',
        assignment: 'Three Blink Patterns',
        email: 'test.student@vicksburgschools.org',
        name: 'Test Student',
        code: 'void setup() {\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  // Heartbeat\n  digitalWrite(13, HIGH);\n  delay(200);\n  digitalWrite(13, LOW);\n  delay(200);\n  digitalWrite(13, HIGH);\n  delay(200);\n  digitalWrite(13, LOW);\n  delay(1000);\n}',
        notes: 'I had fun creating the heartbeat pattern!',
        timestamp: new Date().toLocaleString(),
        dueDate: 'Tuesday by Noon'
      })
    }
  };

  Logger.log(doPost(testData));
}

/*
  GOOGLE SHEET STRUCTURE:

  Each lesson gets its own tab (sheet):
  - Lesson 2
  - Lesson 3
  - Lesson 4
  - Lesson 5

  Columns in each sheet:
  A: Timestamp - When the homework was submitted
  B: Student Email - For identification
  C: Student Name - Display name
  D: Assignment - Name of the homework task
  E: Code Submitted - The Arduino code
  F: Notes - Optional student comments
  G: Status - Submitted/Resubmitted/Graded
  H: Grade - Teacher fills this in
  I: Feedback - Teacher comments

  COLOR CODING:
  - Green (#d4edda): Submitted
  - Yellow (#fff3cd): Resubmitted (student submitted again)
  - Blue (#cfe2ff): Graded (teacher filled in grade)
*/
