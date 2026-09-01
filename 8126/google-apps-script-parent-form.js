// VCS Robotics — Parent Info Form Backend
// Deploy as: Web app → Execute as: Me → Who has access: Anyone
// Paste the deployment URL into parent_form.html as SCRIPT_URL

const SHEET_NAME = 'Parent Submissions';
const BACKEND_VERSION = '1.0.0';

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', version: BACKEND_VERSION }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    const parent = data.parent || {};
    const children = data.children || [];
    const submittedAt = data.submittedAt || new Date().toISOString();

    if (children.length === 0) {
      throw new Error('No children included in submission');
    }

    // One row per child (parent info repeated for easy filtering)
    children.forEach(function(child) {
      sheet.appendRow([
        submittedAt,
        parent.firstName || '',
        parent.lastName || '',
        parent.email    || '',
        parent.phone    || '',
        child.name      || '',
        child.grade     || '',
        child.shirtSize || '',
        (child.roles || []).join(', ')
      ]);
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Submitted At', 'Parent First', 'Parent Last', 'Email', 'Phone',
      'Child Name', 'Grade', 'Shirt Size', 'Interested Roles'
    ]);
    sheet.setFrozenRows(1);
    // Widen columns for readability
    sheet.setColumnWidth(1, 180); // timestamp
    sheet.setColumnWidth(4, 220); // email
  }
  return sheet;
}
