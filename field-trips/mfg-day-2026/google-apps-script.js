/**
 * Manufacturing Day 2026 — Sign-Up Backend
 * Bound to: https://docs.google.com/spreadsheets/d/1P7hEMqoPUAIYky1sJ_y0y9bN1XgesMgLEfD1X4mshCQ
 *
 * Deploy as: Web app · Execute as Me · Access: Anyone
 */

var HEADERS = ['Timestamp', 'First Name', 'Last Name', 'Grade', 'Period', 'Parent Email'];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Write headers if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date().toLocaleString('en-US', { timeZone: 'America/Detroit' }),
      data.first     || '',
      data.last      || '',
      data.grade     || '',
      'Period ' + (data.period || ''),
      data.parentEmail || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** Test: run manually to verify sheet writes */
function testWrite() {
  doPost({ postData: { contents: JSON.stringify({
    first: 'Test', last: 'Student', grade: '11', period: '3',
    parentEmail: 'parent@example.com'
  })}});
}
