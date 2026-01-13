// Google Apps Script for Unit 5 Quiz - Access Logging and Submission Tracking
// Deploy this as a Web App with "Anyone" access

// CONFIGURATION
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with your Google Sheets ID
const ACCESS_LOG_SHEET_NAME = 'Access Log';
const SUBMISSIONS_SHEET_NAME = 'Quiz Submissions';

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Get the spreadsheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // Route to appropriate handler based on action type
    if (data.action === 'access') {
      return logQuizAccess(ss, data);
    } else if (data.action === 'submit') {
      return logQuizSubmission(ss, data);
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Invalid action type'
      })).setMimeType(ContentService.MimeType.JSON);
    }

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function logQuizAccess(ss, data) {
  // Get or create Access Log sheet
  let sheet = ss.getSheetByName(ACCESS_LOG_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(ACCESS_LOG_SHEET_NAME);
    // Add headers
    sheet.appendRow([
      'Timestamp',
      'Student Name',
      'Email',
      'Current Attempts Used',
      'Action'
    ]);

    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, 5);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#00d4ff');
    headerRange.setFontColor('#0a0e27');
  }

  // Add access log entry
  sheet.appendRow([
    data.timestamp,
    data.name,
    data.email,
    data.currentAttempts,
    'Viewed Quiz'
  ]);

  // Auto-resize columns
  sheet.autoResizeColumns(1, 5);

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Access logged'
  })).setMimeType(ContentService.MimeType.JSON);
}

function logQuizSubmission(ss, data) {
  // Get or create Submissions sheet
  let sheet = ss.getSheetByName(SUBMISSIONS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SUBMISSIONS_SHEET_NAME);
    // Add headers
    sheet.appendRow([
      'Timestamp',
      'Student Name',
      'Email',
      'Score',
      'Max Score',
      'Percentage',
      'Attempt Number',
      'Detailed Answers'
    ]);

    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, 8);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#ff9500');
    headerRange.setFontColor('#ffffff');
  }

  // Add submission entry
  sheet.appendRow([
    data.timestamp,
    data.name,
    data.email,
    data.totalScore,
    data.maxScore,
    data.percentage + '%',
    data.attemptNumber,
    data.answers
  ]);

  // Color code based on score percentage
  const lastRow = sheet.getLastRow();
  const scoreCell = sheet.getRange(lastRow, 6); // Percentage column
  const percentage = parseFloat(data.percentage);

  if (percentage >= 90) {
    scoreCell.setBackground('#50fa7b'); // Green
    scoreCell.setFontColor('#0a0e27');
  } else if (percentage >= 80) {
    scoreCell.setBackground('#00d4ff'); // Blue
    scoreCell.setFontColor('#0a0e27');
  } else if (percentage >= 70) {
    scoreCell.setBackground('#ffaa00'); // Orange
    scoreCell.setFontColor('#0a0e27');
  } else {
    scoreCell.setBackground('#ff5555'); // Red
    scoreCell.setFontColor('#ffffff');
  }

  // Auto-resize columns
  sheet.autoResizeColumns(1, 7);

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Submission recorded'
  })).setMimeType(ContentService.MimeType.JSON);
}

// Test function to verify spreadsheet access
function testConnection() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    Logger.log('Connected to: ' + ss.getName());
    return true;
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return false;
  }
}
