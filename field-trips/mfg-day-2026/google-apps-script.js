/**
 * Manufacturing Day 2026 — Sign-Up & Parent Permission Backend
 * Bound to: https://docs.google.com/spreadsheets/d/1P7hEMqoPUAIYky1sJ_y0y9bN1XgesMgLEfD1X4mshCQ
 *
 * Deploy as: Web app · Execute as Me · Access: Anyone
 *
 * Sheet columns:
 *   A  Timestamp
 *   B  First Name
 *   C  Last Name
 *   D  Grade
 *   E  Parent Email
 *   F  Parent Full Name
 *   G  Parent Phone
 *   H  Permission Granted
 *   I  Permission Date
 */

var SHEET_ID = '1P7hEMqoPUAIYky1sJ_y0y9bN1XgesMgLEfD1X4mshCQ';
var HEADERS  = ['Timestamp', 'First Name', 'Last Name', 'Grade', 'Parent Email',
                'Parent Full Name', 'Parent Phone', 'Permission Granted', 'Permission Date'];

// ── Column index constants (1-based) ──────────────────────────────────────────
var COL = { TS: 1, FIRST: 2, LAST: 3, GRADE: 4, PEMAIL: 5,
            PNAME: 6, PPHONE: 7, PERMISSION: 8, PDATE: 9 };

// ── Roster read (GET) ────────────────────────────────────────────────────────
function doGet(e) {
  try {
    var ss    = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheets()[0];
    var data  = sheet.getDataRange().getValues();
    var rows  = data.slice(1).filter(function(r) { return r[1]; }).map(function(r) {
      return {
        first:       r[1], last:       r[2], grade:      r[3],
        parentEmail: r[4], parentName: r[5], parentPhone: r[6],
        permission:  r[7], permDate:   r[8]
      };
    });
    return ContentService
      .createTextOutput(JSON.stringify(rows))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var data  = JSON.parse(e.postData.contents);
    var ss    = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheets()[0];
    ensureHeaders(sheet);

    var result = data.action === 'parentPermission'
      ? handleParentPermission(sheet, data)
      : handleStudentSignup(sheet, data);

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Student sign-up ───────────────────────────────────────────────────────────
function handleStudentSignup(sheet, data) {
  sheet.appendRow([
    new Date().toLocaleString('en-US', { timeZone: 'America/Detroit' }),
    data.first       || '',
    data.last        || '',
    data.grade       || '',
    data.parentEmail || '',
    '', '', '', ''   // parent columns filled when parent responds
  ]);
  return { success: true };
}

// ── Parent permission ─────────────────────────────────────────────────────────
function handleParentPermission(sheet, data) {
  var first    = norm(data.studentFirst);
  var last     = norm(data.studentLast);
  var lastRow  = sheet.getLastRow();
  var permDate = new Date().toLocaleString('en-US', { timeZone: 'America/Detroit' });

  // Find the student row and update it
  for (var i = 2; i <= lastRow; i++) {
    var rFirst = norm(sheet.getRange(i, COL.FIRST).getValue());
    var rLast  = norm(sheet.getRange(i, COL.LAST).getValue());
    if (rFirst === first && rLast === last) {
      sheet.getRange(i, COL.PNAME).setValue(data.parentName  || '');
      sheet.getRange(i, COL.PPHONE).setValue(data.parentPhone || '');
      sheet.getRange(i, COL.PERMISSION).setValue('✓ Yes');
      sheet.getRange(i, COL.PDATE).setValue(permDate);
      return { success: true, matched: true };
    }
  }

  // Student row not found — append a standalone parent response row
  sheet.appendRow([
    permDate,
    data.studentFirst || '',
    data.studentLast  || '',
    '(parent response)',
    '',
    data.parentName  || '',
    data.parentPhone || '',
    '✓ Yes',
    permDate
  ]);
  return { success: true, matched: false };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function norm(s) { return String(s || '').toLowerCase().trim(); }

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    return;
  }
  // Add any missing columns to the right
  var existing = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  for (var i = existing.length; i < HEADERS.length; i++) {
    sheet.getRange(1, i + 1).setValue(HEADERS[i]).setFontWeight('bold');
  }
}

/** Run from the editor to verify a student signup write */
function testSignup() {
  doPost({ postData: { contents: JSON.stringify({
    action: 'signup',
    first: 'Test', last: 'Student', grade: '11', parentEmail: 'parent@example.com'
  })}});
}

/** Run from the editor to verify a parent permission write */
function testParentPermission() {
  doPost({ postData: { contents: JSON.stringify({
    action: 'parentPermission',
    studentFirst: 'Test', studentLast: 'Student',
    parentName: 'Jane Parent', parentPhone: '269-555-0100'
  })}});
}
