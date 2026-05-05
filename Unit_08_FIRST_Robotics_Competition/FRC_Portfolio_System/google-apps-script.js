/**
 * FRC Portfolio - Google Apps Script Backend
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete the default code and paste this entire file
 * 4. Save the project (give it a name like "FRC Portfolio Backend")
 * 5. Click "Deploy" > "New deployment"
 * 6. Select "Web app" as the type
 * 7. Set "Execute as" to "Me"
 * 8. Set "Who has access" to "Anyone" (or "Anyone with Google account" for more security)
 * 9. Click "Deploy" and authorize when prompted
 * 10. Copy the Web App URL and paste it into app.js CONFIG.SHEETS_API_URL
 *
 * The script will automatically create the necessary sheets on first run.
 */

// ============================================
// CONFIGURATION
// ============================================
const BACKEND_VERSION = 'v2.9.25';

// Shared secret — must match CONFIG.TEACHER_TOKEN in teacher-portal.js
const TEACHER_TOKEN = 'rp-portal-teach-2026';

const SHEET_NAMES = {
  STUDENTS: 'Students',
  REFLECTIONS: 'Weekly Reflections',
  DELIVERABLES: 'Deliverables',
  EVIDENCE: 'Evidence',
  WEIGHT: 'Weight Sheet',
  CONFIG: 'Config',
  LOG: 'Activity Log'
};

// ============================================
// WEB APP ENDPOINTS
// ============================================

/**
 * Handle GET requests (load data)
 */
function doGet(e) {
  try {
    const action = e.parameter.action;

    switch (action) {
      case 'load':
        return jsonResponse(loadStudentData(e.parameter.email));

      case 'team':
        return jsonResponse(loadTeamData(e.parameter.team, e.parameter.period));

      case 'all':
        return jsonResponse(loadAllData());

      case 'getConfig':
        return jsonResponse(handleGetConfig());

      case 'repair':
        return jsonResponse(repairStudent(e.parameter.email));

      case 'export':
        return jsonResponse(exportAllData());

      default:
        return jsonResponse({ error: 'Unknown action', validActions: ['load', 'team', 'all', 'export'] });
    }
  } catch (error) {
    return jsonResponse({ error: error.toString() });
  }
}

/**
 * Handle POST requests (save data)
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    switch (action) {
      case 'setConfig':
        return jsonResponse(handleSetConfig(data));

      case 'sync':
        return jsonResponse(syncStudentData(data));

      case 'register':
        return jsonResponse(registerStudent(data.student));

      case 'submitReflection':
        return jsonResponse(submitReflection(data));

      case 'submitDeliverable':
        return jsonResponse(submitDeliverable(data));

      case 'saveGrades':
        return jsonResponse(saveGrades(data.grades));

      case 'recordDeliverableUrl':
        return jsonResponse(handleRecordDeliverableUrl(data));

      case 'sendReminders':
        return jsonResponse(sendRemindersWeb(data.semesterStart));

      case 'getAIFeedback':
        return jsonResponse(getAIFeedback(data));

      default:
        return jsonResponse({ error: 'Unknown action' });
    }
  } catch (error) {
    logActivity('ERROR', error.toString());
    return jsonResponse({ error: error.toString() });
  }
}

/**
 * Return JSON response
 */
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// CONFIG OPERATIONS
// ============================================

function handleGetConfig() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName(SHEET_NAMES.CONFIG);
  const config = { skipReflectionWeeks: [], skipDeliverableWeeks: [], expectedVersion: '', reflectionDueDates: {}, deliverableDueDates: {} };
  if (configSheet && configSheet.getLastRow() > 0) {
    configSheet.getDataRange().getValues().forEach(row => {
      try {
        if (row[0] === 'skipReflectionWeeks')  config.skipReflectionWeeks  = JSON.parse(row[1] || '[]');
        if (row[0] === 'skipDeliverableWeeks') config.skipDeliverableWeeks = JSON.parse(row[1] || '[]');
        if (row[0] === 'expectedVersion')       config.expectedVersion      = row[1] || '';
        if (row[0] === 'reflectionDueDates')    config.reflectionDueDates   = JSON.parse(row[1] || '{}');
        if (row[0] === 'deliverableDueDates')   config.deliverableDueDates  = JSON.parse(row[1] || '{}');
      } catch(e) {}
    });
  }
  return config;
}

function handleSetConfig(data) {
  if (data.token !== TEACHER_TOKEN) return { error: 'Unauthorized' };
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let configSheet = ss.getSheetByName(SHEET_NAMES.CONFIG);
  if (!configSheet) configSheet = ss.insertSheet(SHEET_NAMES.CONFIG);

  const existing = configSheet.getLastRow() > 0 ? configSheet.getDataRange().getValues() : [];
  const rowMap = {};
  existing.forEach((row, i) => { if (row[0]) rowMap[row[0]] = i + 1; });

  const updates = {
    skipReflectionWeeks:  JSON.stringify(data.skipReflectionWeeks  || []),
    skipDeliverableWeeks: JSON.stringify(data.skipDeliverableWeeks || []),
    expectedVersion:      data.expectedVersion || '',
    reflectionDueDates:   JSON.stringify(data.reflectionDueDates  || {}),
    deliverableDueDates:  JSON.stringify(data.deliverableDueDates || {})
  };

  Object.entries(updates).forEach(([key, value]) => {
    if (rowMap[key]) configSheet.getRange(rowMap[key], 2).setValue(value);
    else configSheet.appendRow([key, value]);
  });

  return { success: true };
}

// ============================================
// DATA OPERATIONS
// ============================================

/**
 * Initialize sheets if they don't exist
 */
function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Students sheet
  let studentsSheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  if (!studentsSheet) {
    studentsSheet = ss.insertSheet(SHEET_NAMES.STUDENTS);
    studentsSheet.getRange(1, 1, 1, 9).setValues([[
      'Email', 'Name', 'Team', 'Period', 'Created At', 'Last Sync', 'Total Points', 'Status', 'Full State JSON'
    ]]);
    studentsSheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#1a73e8').setFontColor('white');
    studentsSheet.setFrozenRows(1);
  }

  // Weekly Reflections sheet
  let reflectionsSheet = ss.getSheetByName(SHEET_NAMES.REFLECTIONS);
  if (!reflectionsSheet) {
    reflectionsSheet = ss.insertSheet(SHEET_NAMES.REFLECTIONS);
    reflectionsSheet.getRange(1, 1, 1, 14).setValues([[
      'Email', 'Name', 'Week', 'Contributions', 'Evidence Links', 'Challenges', 'Solutions', 'Goals', 'Submitted At', 'Points', 'Self Assessment', 'Grade', 'Feedback', 'Graded At'
    ]]);
    reflectionsSheet.getRange(1, 1, 1, 14).setFontWeight('bold').setBackground('#34a853').setFontColor('white');
    reflectionsSheet.setFrozenRows(1);
  } else {
    // Add missing columns if needed
    const headers = reflectionsSheet.getRange(1, 1, 1, reflectionsSheet.getLastColumn()).getValues()[0];
    if (!headers[10] || headers[10] !== 'Self Assessment') {
      reflectionsSheet.getRange(1, 11).setValue('Self Assessment');
      reflectionsSheet.getRange(1, 11).setFontWeight('bold').setBackground('#34a853').setFontColor('white');
    }
    if (!headers[11] || headers[11] !== 'Grade') {
      reflectionsSheet.getRange(1, 12).setValue('Grade');
      reflectionsSheet.getRange(1, 12).setFontWeight('bold').setBackground('#34a853').setFontColor('white');
    }
    if (!headers[12] || headers[12] !== 'Feedback') {
      reflectionsSheet.getRange(1, 13).setValue('Feedback');
      reflectionsSheet.getRange(1, 13).setFontWeight('bold').setBackground('#34a853').setFontColor('white');
    }
    if (headers.length < 14 || headers[13] !== 'Graded At') {
      reflectionsSheet.getRange(1, 14).setValue('Graded At');
      reflectionsSheet.getRange(1, 14).setFontWeight('bold').setBackground('#34a853').setFontColor('white');
    }
  }

  // Deliverables sheet
  let deliverablesSheet = ss.getSheetByName(SHEET_NAMES.DELIVERABLES);
  if (!deliverablesSheet) {
    deliverablesSheet = ss.insertSheet(SHEET_NAMES.DELIVERABLES);
    deliverablesSheet.getRange(1, 1, 1, 12).setValues([[
      'Email', 'Name', 'Deliverable ID', 'Title', 'Content', 'Links', 'Self Assessment', 'Status', 'Submitted At', 'Grade', 'Feedback', 'Graded At'
    ]]);
    deliverablesSheet.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#fbbc04').setFontColor('black');
    deliverablesSheet.setFrozenRows(1);
  }

  // Evidence sheet - supports both legacy base64 and new Drive-based storage
  let evidenceSheet = ss.getSheetByName(SHEET_NAMES.EVIDENCE);
  if (!evidenceSheet) {
    evidenceSheet = ss.insertSheet(SHEET_NAMES.EVIDENCE);
    evidenceSheet.getRange(1, 1, 1, 9).setValues([[
      'Email', 'Name', 'Week', 'Filename', 'Uploaded At', 'Image Data', 'Drive ID', 'Thumbnail Link', 'Web View Link'
    ]]);
    evidenceSheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#ea4335').setFontColor('white');
    evidenceSheet.setFrozenRows(1);
  } else {
    // Update existing sheet headers if Drive columns are missing
    const headers = evidenceSheet.getRange(1, 1, 1, 9).getValues()[0];
    if (!headers[6] || headers[6] !== 'Drive ID') {
      evidenceSheet.getRange(1, 7, 1, 3).setValues([['Drive ID', 'Thumbnail Link', 'Web View Link']]);
      evidenceSheet.getRange(1, 7, 1, 3).setFontWeight('bold').setBackground('#ea4335').setFontColor('white');
    }
  }

  // Weight Sheet (component mass inventory — populated by deliverable 6)
  let weightSheet = ss.getSheetByName(SHEET_NAMES.WEIGHT);
  if (!weightSheet) {
    weightSheet = ss.insertSheet(SHEET_NAMES.WEIGHT);
    weightSheet.getRange(1, 1, 1, 9).setValues([[
      'Email', 'Name', 'Subsystem', 'Component', 'Qty', 'Unit Mass (lbs)', 'Total Mass (lbs)', 'Notes', 'Submitted At'
    ]]);
    weightSheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#0d9488').setFontColor('white');
    weightSheet.setFrozenRows(1);
  }

  // Activity Log sheet
  let logSheet = ss.getSheetByName(SHEET_NAMES.LOG);
  if (!logSheet) {
    logSheet = ss.insertSheet(SHEET_NAMES.LOG);
    logSheet.getRange(1, 1, 1, 4).setValues([[
      'Timestamp', 'Type', 'Email', 'Details'
    ]]);
    logSheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#5f6368').setFontColor('white');
    logSheet.setFrozenRows(1);
  }

  return { success: true };
}

/**
 * Sync all student data
 */
function syncStudentData(data) {
  // Acquire a script-level lock to prevent concurrent syncs from the same student
  // (e.g. two browser tabs open) creating duplicate rows in the sheets.
  const lock = LockService.getScriptLock();
  lock.waitLock(15000); // wait up to 15s for the lock
  try {
    return _syncStudentDataLocked(data);
  } finally {
    lock.releaseLock();
  }
}

function _syncStudentDataLocked(data) {
  initializeSheets();

  // Update student record and store full state JSON in column 9
  updateStudentRecord(data.student);
  saveFullState(data.student.email, data);

  // Sync submitted reflections to teacher-visible sheet
  if (data.weeklyReflections) {
    Object.entries(data.weeklyReflections).forEach(([week, reflection]) => {
      if (reflection.submitted) {
        saveReflection(data.student, week, reflection);
      }
    });
  }

  // Sync completed deliverables to teacher-visible sheet
  if (data.deliverables) {
    Object.entries(data.deliverables).forEach(([id, deliverable]) => {
      if (deliverable.status === 'completed') {
        saveDeliverable(data.student, id, deliverable);
      }
    });
  }

  // Sync all evidence photos to Evidence sheet (one row per photo)
  if (data.evidence && data.evidence.length > 0) {
    data.evidence.forEach(evidence => {
      saveEvidence(data.student, evidence);
    });
  }

  // Sync weight inventory to Weight Sheet when deliverable 6 is submitted
  const d6 = data.deliverables && data.deliverables[6];
  if (d6 && d6.status === 'completed' && d6.weightData && d6.weightData.length > 0) {
    saveWeightData(data.student, d6.subsystemName || '', d6.weightData, d6.submittedAt);
  }

  logActivity('SYNC', data.student.email, `Synced at ${data.timestamp}`);

  return { success: true, timestamp: new Date().toISOString(), backendVersion: BACKEND_VERSION };
}

/**
 * Save full application state as JSON (column 9 of Students sheet)
 * This preserves drafts, code snippets — everything the student needs to restore.
 * Evidence photos are stored separately in the Evidence sheet to avoid cell size limits.
 */
function saveFullState(email, data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  const sheetData = sheet.getDataRange().getValues();

  for (let i = 1; i < sheetData.length; i++) {
    if (sheetData[i][0] === email) {
      // Read existing state and merge — never allow a partial save to overwrite complete data.
      // If the frontend sends an incomplete weeklyReflections (e.g. due to a race condition
      // or two tabs open), existing weeks not present in the incoming data are preserved.
      let existingReflections = {};
      let existingDeliverables = {};
      let existingCodeSnippets = [];
      let existingViewedFeedback = [];

      const existingJson = sheetData[i][8];
      if (existingJson && existingJson.trim()) {
        try {
          const existing = JSON.parse(existingJson);
          existingReflections = existing.weeklyReflections || {};
          existingDeliverables = existing.deliverables || {};
          existingCodeSnippets = existing.codeSnippets || [];
          existingViewedFeedback = existing.viewedFeedback || [];
        } catch (e) {
          // Existing JSON is corrupt — start fresh from incoming data
        }
      }

      // Merge: incoming data wins for any weeks/deliverables it includes;
      // existing data is preserved for anything the incoming payload is missing.
      const mergedReflections = Object.assign({}, existingReflections, data.weeklyReflections || {});
      const mergedDeliverables = Object.assign({}, existingDeliverables, data.deliverables || {});

      const stateJson = JSON.stringify({
        student: data.student,
        weeklyReflections: mergedReflections,
        deliverables: mergedDeliverables,
        codeSnippets: (data.codeSnippets && data.codeSnippets.length > 0) ? data.codeSnippets : existingCodeSnippets,
        viewedFeedback: (data.viewedFeedback && data.viewedFeedback.length > 0) ? data.viewedFeedback : existingViewedFeedback,
        lastSynced: data.timestamp || new Date().toISOString()
      });

      sheet.getRange(i + 1, 9).setValue(stateJson);
      return;
    }
  }
}

/**
 * Update or create student record
 */
function updateStudentRecord(student) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  const data = sheet.getDataRange().getValues();

  // Find existing row
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === student.email) {
      rowIndex = i + 1;
      break;
    }
  }

  const now = new Date().toISOString();

  if (rowIndex > 0) {
    // Update existing
    sheet.getRange(rowIndex, 6).setValue(now); // Last Sync
  } else {
    // Create new
    sheet.appendRow([
      student.email,
      student.name,
      student.team,
      student.period,
      student.createdAt || now,
      now,
      0,
      'Active'
    ]);
  }
}

/**
 * Save weekly reflection
 */
function saveReflection(student, week, reflection) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.REFLECTIONS);
  const data = sheet.getDataRange().getValues();

  // Check if reflection already exists
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === student.email && data[i][2] == week) {
      rowIndex = i + 1;
      break;
    }
  }

  const contributions = (reflection.contributions || [])
    .map(c => `${c.date}: ${c.task}`)
    .join('\n');

  const goals = (reflection.goals || []).join('\n');

  // Calculate rubric total if available
  const rubricTotal = reflection.rubric ?
    (reflection.rubric.detail || 0) + (reflection.rubric.evidence || 0) +
    (reflection.rubric.problemSolving || 0) + (reflection.rubric.goals || 0) : '';

  const rowData = [
    student.email,
    student.name,
    week,
    contributions,
    reflection.evidenceLinks || '',
    reflection.challenges || '',
    reflection.solutions || '',
    goals,
    reflection.submittedAt || new Date().toISOString(),
    20, // Points for weekly reflection
    rubricTotal // Self-assessment score (column K)
  ];

  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
}

/**
 * Save deliverable
 */
function saveDeliverable(student, id, deliverable) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.DELIVERABLES);
  const data = sheet.getDataRange().getValues();

  // Deliverable titles
  const titles = {
    1: 'Game Analysis Report',
    2: 'Subsystem Research Report',
    3: 'Design Contribution',
    4: 'Design Decision Matrix',
    5: 'Prototype Documentation',
    6: 'Testing & Iteration Log',
    7: 'Robot Readiness Contributions',
    8: 'Technical Contribution Summary',
    9: 'Engineer Portfolio Entry',
    10: 'Final Presentation'
  };

  // Check if deliverable already exists
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === student.email && data[i][2] == id) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex > 0) {
    // Update content columns (A-I) but PRESERVE grade, feedback, and graded-at columns
    const contentData = [
      student.email,
      student.name,
      id,
      titles[id] || `Deliverable ${id}`,
      deliverable.content || '',
      deliverable.links || '',
      deliverable.selfAssessment || '',
      deliverable.status,
      deliverable.submittedAt || new Date().toISOString()
    ];
    sheet.getRange(rowIndex, 1, 1, contentData.length).setValues([contentData]);
  } else {
    sheet.appendRow([
      student.email,
      student.name,
      id,
      titles[id] || `Deliverable ${id}`,
      deliverable.content || '',
      deliverable.links || '',
      deliverable.selfAssessment || '',
      deliverable.status,
      deliverable.submittedAt || new Date().toISOString(),
      '' // Grade (teacher fills in)
    ]);
  }
}

/**
 * Teacher records a student's email-submitted deliverable.
 * Creates (or updates) a Deliverables row marked completed with the URL
 * pasted by the teacher. Grade and Feedback columns are preserved if the
 * row already exists.
 */
function handleRecordDeliverableUrl(data) {
  if (data.token !== TEACHER_TOKEN) return { error: 'Unauthorized' };
  if (!data.email || !data.deliverableId) return { error: 'Missing email or deliverableId' };

  initializeSheets();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const studentsSheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  const studentsData  = studentsSheet.getDataRange().getValues();
  let studentName = '';
  for (let i = 1; i < studentsData.length; i++) {
    if (studentsData[i][0] === data.email) { studentName = studentsData[i][1]; break; }
  }
  if (!studentName) return { error: 'Student not found: ' + data.email };

  const titles = {
    1: 'Game Analysis Report',
    2: 'Subsystem Research Report',
    3: 'Design Contribution',
    4: 'Design Decision Matrix',
    5: 'Prototype Documentation',
    6: 'Testing & Iteration Log',
    7: 'Robot Readiness Contributions',
    8: 'Technical Contribution Summary',
    9: 'Engineer Portfolio Entry',
    10: 'Final Presentation'
  };

  const sheet = ss.getSheetByName(SHEET_NAMES.DELIVERABLES);
  const sheetData = sheet.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 1; i < sheetData.length; i++) {
    if (sheetData[i][0] === data.email && sheetData[i][2] == data.deliverableId) {
      rowIndex = i + 1;
      break;
    }
  }

  const now = new Date().toISOString();
  if (rowIndex > 0) {
    const contentData = [
      data.email,
      studentName,
      data.deliverableId,
      titles[data.deliverableId] || `Deliverable ${data.deliverableId}`,
      'Submitted by email — recorded by teacher',
      data.url || '',
      '',
      'completed',
      now
    ];
    sheet.getRange(rowIndex, 1, 1, contentData.length).setValues([contentData]);
  } else {
    sheet.appendRow([
      data.email,
      studentName,
      data.deliverableId,
      titles[data.deliverableId] || `Deliverable ${data.deliverableId}`,
      'Submitted by email — recorded by teacher',
      data.url || '',
      '',
      'completed',
      now,
      ''
    ]);
  }

  logActivity('TEACHER_SUBMIT', data.email, 'Recorded email submission for deliverable ' + data.deliverableId);
  return { success: true };
}

/**
 * Save evidence photo (one row per photo in Evidence sheet)
 * Supports both legacy base64 and new Drive-based storage
 */
function saveEvidence(student, evidence) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.EVIDENCE);
  const data = sheet.getDataRange().getValues();

  // Check if this evidence item already exists
  // For Drive-based: match by email + driveId (most reliable)
  // For legacy base64: match by email + filename + uploadedAt
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === student.email) {
      // Drive-based: check driveId (column 7, index 6)
      if (evidence.driveId && data[i][6] === evidence.driveId) {
        rowIndex = i + 1;
        break;
      }
      // Legacy base64: check filename + uploadedAt
      if (!evidence.driveId && data[i][3] === evidence.filename && data[i][4] === evidence.uploadedAt) {
        rowIndex = i + 1;
        break;
      }
    }
  }

  const rowData = [
    student.email,
    student.name,
    evidence.week || '',
    evidence.filename || '',
    evidence.uploadedAt || new Date().toISOString(),
    evidence.data || '',           // Base64 image data (legacy)
    evidence.driveId || '',        // Google Drive file ID
    evidence.thumbnailLink || '',  // Drive thumbnail URL
    evidence.webViewLink || ''     // Drive web view URL
  ];

  if (rowIndex > 0) {
    // Update existing
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    // Append new
    sheet.appendRow(rowData);
  }
}

/**
 * Load student data
 */
/**
 * Repair a student's data by clearing the stale fullState JSON and rebuilding
 * it immediately from the individual sheets (Reflections, Deliverables, Evidence).
 * Called by the teacher portal when a student's work isn't loading after an outage.
 */
function repairStudent(email) {
  if (!email) return { success: false, error: 'No email provided' };
  initializeSheets();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const studentsSheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  const studentsData = studentsSheet.getDataRange().getValues();

  let studentRow = -1;
  for (let i = 1; i < studentsData.length; i++) {
    if (studentsData[i][0] === email) {
      studentRow = i + 1; // 1-indexed for getRange
      break;
    }
  }

  if (studentRow < 0) {
    return { success: false, error: 'Student not found: ' + email };
  }

  // Clear the stale fullState JSON so loadStudentData falls back to sheet-based rebuild
  studentsSheet.getRange(studentRow, 9).setValue('');
  logActivity('REPAIR', email, 'Teacher initiated data repair — fullState cleared');

  // loadStudentData will now take the fallback path and rebuild from individual sheets
  const rebuilt = loadStudentData(email);

  if (rebuilt && !rebuilt.error) {
    // Write the freshly rebuilt state back to column 9 so it's cached for future loads
    studentsSheet.getRange(studentRow, 9).setValue(JSON.stringify(rebuilt));
    const reflCount = Object.keys(rebuilt.weeklyReflections || {}).length;
    const delCount = Object.keys(rebuilt.deliverables || {}).length;
    const evCount = (rebuilt.evidence || []).length;
    logActivity('REPAIR', email, 'Rebuilt: ' + reflCount + ' reflections, ' + delCount + ' deliverables, ' + evCount + ' evidence items');
    return {
      success: true,
      email: email,
      recovered: { reflections: reflCount, deliverables: delCount, evidence: evCount }
    };
  }

  return { success: false, error: 'Failed to rebuild data for ' + email };
}

function loadStudentData(email) {
  initializeSheets();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const studentsSheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  const studentsData = studentsSheet.getDataRange().getValues();

  // Find student row and check for full state JSON (column 9)
  for (let i = 1; i < studentsData.length; i++) {
    if (studentsData[i][0] === email) {
      // If full state JSON exists, return it with merged teacher grades/feedback
      if (studentsData[i][8] && studentsData[i][8].trim()) {
        try {
          const fullState = JSON.parse(studentsData[i][8]);

          // Merge in submitted reflections from the Reflections sheet.
          // This both restores teacher grades/feedback AND recovers any weeks that
          // were accidentally lost from the fullState JSON (data loss recovery).
          const reflectionsSheet = ss.getSheetByName(SHEET_NAMES.REFLECTIONS);
          const reflectionsData = reflectionsSheet.getDataRange().getValues();

          if (!fullState.weeklyReflections) fullState.weeklyReflections = {};

          for (let j = 1; j < reflectionsData.length; j++) {
            if (reflectionsData[j][0] === email) {
              const week = reflectionsData[j][2];

              if (fullState.weeklyReflections[week]) {
                // Week exists in fullState — just merge teacher grades/feedback
                fullState.weeklyReflections[week].teacherGrade = reflectionsData[j][11] || undefined;
                fullState.weeklyReflections[week].teacherFeedback = reflectionsData[j][12] || '';
              } else {
                // Week is missing from fullState — reconstruct from Reflections sheet (data recovery)
                const contributionLines = (reflectionsData[j][3] || '').split('\n').filter(function(l) { return l.trim(); });
                const contributions = contributionLines.map(function(line) {
                  var colonIdx = line.indexOf(': ');
                  if (colonIdx > 0) {
                    return { date: line.substring(0, colonIdx), task: line.substring(colonIdx + 2) };
                  }
                  return { date: '', task: line };
                });

                const goals = (reflectionsData[j][7] || '').split('\n').filter(function(g) { return g.trim(); });

                fullState.weeklyReflections[week] = {
                  week: week,
                  contributions: contributions,
                  evidenceLinks: reflectionsData[j][4] || '',
                  challenges: reflectionsData[j][5] || '',
                  solutions: reflectionsData[j][6] || '',
                  goals: goals,
                  submitted: true,
                  submittedAt: reflectionsData[j][8] || '',
                  teacherGrade: reflectionsData[j][11] || undefined,
                  teacherFeedback: reflectionsData[j][12] || '',
                  _recoveredFromSheet: true
                };
              }
            }
          }

          // Merge deliverable grades/feedback — and recover any deliverables missing from fullState JSON
          const deliverablesSheet = ss.getSheetByName(SHEET_NAMES.DELIVERABLES);
          const deliverablesData = deliverablesSheet.getDataRange().getValues();

          if (!fullState.deliverables) fullState.deliverables = {};

          for (let j = 1; j < deliverablesData.length; j++) {
            if (deliverablesData[j][0] === email) {
              const id = deliverablesData[j][2];
              if (fullState.deliverables[id]) {
                // Deliverable exists in fullState — just merge teacher grades/feedback
                fullState.deliverables[id].teacherGrade    = deliverablesData[j][9]  || undefined;
                fullState.deliverables[id].teacherFeedback = deliverablesData[j][10] || '';
              } else {
                // Deliverable is missing from fullState — reconstruct from Deliverables sheet (data recovery)
                fullState.deliverables[id] = {
                  content:         deliverablesData[j][4]  || '',
                  links:           deliverablesData[j][5]  || '',
                  selfAssessment:  deliverablesData[j][6]  || '',
                  status:          deliverablesData[j][7]  || 'completed',
                  submittedAt:     deliverablesData[j][8]  || '',
                  teacherGrade:    deliverablesData[j][9]  || undefined,
                  teacherFeedback: deliverablesData[j][10] || ''
                };
              }
            }
          }

          // Load evidence photos from Evidence sheet
          // Supports both legacy base64 and new Drive-based storage
          const evidenceSheet = ss.getSheetByName(SHEET_NAMES.EVIDENCE);
          const evidenceData = evidenceSheet.getDataRange().getValues();
          fullState.evidence = [];

          for (let j = 1; j < evidenceData.length; j++) {
            if (evidenceData[j][0] === email) {
              const evidenceItem = {
                type: 'weekly',
                week: evidenceData[j][2],
                filename: evidenceData[j][3],
                uploadedAt: evidenceData[j][4],
                data: evidenceData[j][5] || ''  // Base64 image data (legacy)
              };
              // Add Drive fields if they exist (columns 7-9)
              if (evidenceData[j][6]) evidenceItem.driveId = evidenceData[j][6];
              if (evidenceData[j][7]) evidenceItem.thumbnailLink = evidenceData[j][7];
              if (evidenceData[j][8]) evidenceItem.webViewLink = evidenceData[j][8];
              fullState.evidence.push(evidenceItem);
            }
          }

          return fullState;
        } catch (e) {
          // JSON parse failed — fall through to sheet-based load
        }
      }

      // Fallback: reconstruct from individual sheets (submitted/completed only)
      const student = {
        email: studentsData[i][0],
        name: studentsData[i][1],
        team: studentsData[i][2],
        period: studentsData[i][3],
        createdAt: studentsData[i][4],
        totalPoints: studentsData[i][6]
      };

      const reflectionsSheet = ss.getSheetByName(SHEET_NAMES.REFLECTIONS);
      const reflectionsData = reflectionsSheet.getDataRange().getValues();
      const weeklyReflections = {};

      for (let j = 1; j < reflectionsData.length; j++) {
        if (reflectionsData[j][0] === email) {
          const week = reflectionsData[j][2];
          // Parse contributions back into array format
          const contribLines = (reflectionsData[j][3] || '').split('\n').filter(l => l.trim());
          const contributions = contribLines.map(line => {
            const colonIdx = line.indexOf(':');
            return colonIdx > 0
              ? { date: line.substring(0, colonIdx).trim(), task: line.substring(colonIdx + 1).trim() }
              : { date: '', task: line.trim() };
          });
          // Parse goals back into array
          const goals = (reflectionsData[j][7] || '').split('\n').filter(l => l.trim());

          weeklyReflections[week] = {
            week: parseInt(week),
            contributions,
            evidenceLinks: reflectionsData[j][4] || '',
            challenges: reflectionsData[j][5] || '',
            solutions: reflectionsData[j][6] || '',
            goals,
            submittedAt: reflectionsData[j][8],
            submitted: true,
            // Grade in column L (index 11), Feedback in column M (index 12)
            teacherGrade: reflectionsData[j][11] || undefined,
            teacherFeedback: reflectionsData[j][12] || ''
          };
        }
      }

      const deliverablesSheet = ss.getSheetByName(SHEET_NAMES.DELIVERABLES);
      const deliverablesData = deliverablesSheet.getDataRange().getValues();
      const deliverables = {};

      for (let j = 1; j < deliverablesData.length; j++) {
        if (deliverablesData[j][0] === email) {
          const id = deliverablesData[j][2];
          deliverables[id] = {
            content: deliverablesData[j][4],
            links: deliverablesData[j][5],
            selfAssessment: deliverablesData[j][6],
            status: deliverablesData[j][7],
            submittedAt: deliverablesData[j][8],
            // Grade in column J (index 9), Feedback in column K (index 10)
            grade: deliverablesData[j][9],
            teacherFeedback: deliverablesData[j][10] || ''
          };
        }
      }

      // Load evidence photos from Evidence sheet
      // Supports both legacy base64 and new Drive-based storage
      const evidenceSheet = ss.getSheetByName(SHEET_NAMES.EVIDENCE);
      const evidenceData = evidenceSheet.getDataRange().getValues();
      const evidence = [];

      for (let j = 1; j < evidenceData.length; j++) {
        if (evidenceData[j][0] === email) {
          const evidenceItem = {
            type: 'weekly',
            week: evidenceData[j][2],
            filename: evidenceData[j][3],
            uploadedAt: evidenceData[j][4],
            data: evidenceData[j][5] || ''  // Base64 image data (legacy)
          };
          // Add Drive fields if they exist (columns 7-9)
          if (evidenceData[j][6]) evidenceItem.driveId = evidenceData[j][6];
          if (evidenceData[j][7]) evidenceItem.thumbnailLink = evidenceData[j][7];
          if (evidenceData[j][8]) evidenceItem.webViewLink = evidenceData[j][8];
          evidence.push(evidenceItem);
        }
      }

      return { student, weeklyReflections, deliverables, evidence };
    }
  }

  // Student not found at all
  return { error: 'Student not found' };
}

/**
 * Load team data
 */
function loadTeamData(team, period) {
  initializeSheets();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const studentsSheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  const reflectionsSheet = ss.getSheetByName(SHEET_NAMES.REFLECTIONS);
  const deliverablesSheet = ss.getSheetByName(SHEET_NAMES.DELIVERABLES);

  const studentsData = studentsSheet.getDataRange().getValues();
  const reflectionsData = reflectionsSheet.getDataRange().getValues();
  const deliverablesData = deliverablesSheet.getDataRange().getValues();

  const members = [];

  for (let i = 1; i < studentsData.length; i++) {
    if (studentsData[i][2] === team && studentsData[i][3] === period) {
      const email = studentsData[i][0];

      // Count reflections
      let reflectionCount = 0;
      for (let j = 1; j < reflectionsData.length; j++) {
        if (reflectionsData[j][0] === email) reflectionCount++;
      }

      // Count deliverables
      let deliverableCount = 0;
      for (let j = 1; j < deliverablesData.length; j++) {
        if (deliverablesData[j][0] === email && deliverablesData[j][7] === 'completed') {
          deliverableCount++;
        }
      }

      // Calculate points
      let points = reflectionCount * 20;
      const pointValues = { 1: 50, 2: 50, 3: 75, 4: 50, 5: 75, 6: 50, 7: 50, 8: 75, 9: 100, 10: 100 };
      for (let j = 1; j < deliverablesData.length; j++) {
        if (deliverablesData[j][0] === email && deliverablesData[j][7] === 'completed') {
          const id = deliverablesData[j][2];
          points += pointValues[id] || 0;
        }
      }

      members.push({
        name: studentsData[i][1],
        initials: studentsData[i][1].split(' ').map(n => n[0]).join('').toUpperCase(),
        reflections: reflectionCount,
        deliverables: deliverableCount,
        points: points
      });
    }
  }

  const teamNames = {
    'drivetrain': 'Drivetrain',
    'intake': 'Intake/Collector',
    'shooter': 'Shooter/Launcher',
    'climber': 'Climber',
    'autonomous': 'Autonomous/Vision',
    'integration': 'Integration/Electrical'
  };

  const totalPossible = 900;
  const avgPoints = members.length > 0
    ? Math.round(members.reduce((sum, m) => sum + m.points, 0) / members.length)
    : 0;

  return {
    teamName: teamNames[team] || team,
    members: members,
    totalProgress: Math.round((avgPoints / totalPossible) * 100)
  };
}

/**
 * Load all data (for teacher dashboard)
 * Wrapped in try/catch so a single sheet failure doesn't crash the entire load.
 * Each sheet is loaded independently — partial data is returned if one sheet fails.
 */
function loadAllData() {
  initializeSheets();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  function safeGetSheet(name) {
    try {
      const sheet = ss.getSheetByName(name);
      if (!sheet) return [[]];
      return sheet.getDataRange().getValues();
    } catch (e) {
      logActivity('ERROR', 'system', 'loadAllData failed for sheet: ' + name + ' — ' + e.toString());
      return [[]];
    }
  }

  const students     = safeGetSheet(SHEET_NAMES.STUDENTS);
  const reflections  = safeGetSheet(SHEET_NAMES.REFLECTIONS);
  const deliverables = safeGetSheet(SHEET_NAMES.DELIVERABLES);
  const evidence     = safeGetSheet(SHEET_NAMES.EVIDENCE);

  return {
    students:     students.slice(1),
    reflections:  reflections.slice(1),
    deliverables: deliverables.slice(1),
    evidence:     evidence.slice(1),
    summary: {
      totalStudents:      Math.max(0, students.length - 1),
      totalReflections:   Math.max(0, reflections.length - 1),
      totalDeliverables:  Math.max(0, deliverables.length - 1)
    }
  };
}

/**
 * Export all data as formatted report
 */
function exportAllData() {
  const data = loadAllData();

  // Group by student
  const studentReports = {};

  data.students.forEach(s => {
    studentReports[s[0]] = {
      name: s[1],
      team: s[2],
      period: s[3],
      reflections: [],
      deliverables: []
    };
  });

  data.reflections.forEach(r => {
    if (studentReports[r[0]]) {
      studentReports[r[0]].reflections.push({
        week: r[2],
        contributions: r[3],
        submittedAt: r[8]
      });
    }
  });

  data.deliverables.forEach(d => {
    if (studentReports[d[0]]) {
      studentReports[d[0]].deliverables.push({
        title: d[3],
        status: d[7],
        submittedAt: d[8],
        grade: d[9]
      });
    }
  });

  return {
    exportedAt: new Date().toISOString(),
    reports: studentReports
  };
}

/**
 * Save grades and feedback from teacher portal
 */
function saveGrades(grades) {
  initializeSheets();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  grades.forEach(gradeData => {
    const { email, type, assignmentId, grade, feedback } = gradeData;

    const gradedAt = new Date().toISOString();

    if (type === 'reflection') {
      const sheet = ss.getSheetByName(SHEET_NAMES.REFLECTIONS);
      const data = sheet.getDataRange().getValues();

      // Ensure we have grade, feedback, and graded at columns
      const headerRow = data[0];
      if (headerRow.length < 13 || headerRow[11] !== 'Grade') {
        sheet.getRange(1, 12).setValue('Grade');
      }
      if (headerRow.length < 13 || headerRow[12] !== 'Feedback') {
        sheet.getRange(1, 13).setValue('Feedback');
      }
      if (headerRow.length < 14 || headerRow[13] !== 'Graded At') {
        sheet.getRange(1, 14).setValue('Graded At');
      }

      // Find the reflection row
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === email && data[i][2] == assignmentId) {
          if (grade !== '') sheet.getRange(i + 1, 12).setValue(parseFloat(grade));
          if (feedback !== '') sheet.getRange(i + 1, 13).setValue(feedback);
          if (grade !== '' || feedback !== '') sheet.getRange(i + 1, 14).setValue(gradedAt);
          break;
        }
      }
    } else if (type === 'deliverable') {
      const sheet = ss.getSheetByName(SHEET_NAMES.DELIVERABLES);
      const data = sheet.getDataRange().getValues();

      // Ensure we have feedback and graded at columns
      const headerRow = data[0];
      if (headerRow.length < 11 || headerRow[10] !== 'Feedback') {
        sheet.getRange(1, 11).setValue('Feedback');
      }
      if (headerRow.length < 12 || headerRow[11] !== 'Graded At') {
        sheet.getRange(1, 12).setValue('Graded At');
      }

      // Find and update all matching deliverable rows (handles duplicates)
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === email && data[i][2] == assignmentId) {
          if (grade !== '') sheet.getRange(i + 1, 10).setValue(parseFloat(grade));
          if (feedback !== '') sheet.getRange(i + 1, 11).setValue(feedback);
          if (grade !== '' || feedback !== '') sheet.getRange(i + 1, 12).setValue(gradedAt);
        }
      }
    }
  });

  logActivity('GRADES', 'teacher', `Saved ${grades.length} grades`);
  return { success: true, count: grades.length };
}

/**
 * Save component weight inventory to Weight Sheet (deliverable 6)
 * Replaces all existing rows for this student so re-submissions stay current.
 */
function saveWeightData(student, subsystemName, weightItems, submittedAt) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.WEIGHT);
  if (!sheet) return;

  // Remove all existing rows for this student (iterate backwards to avoid index shift)
  const data = sheet.getDataRange().getValues();
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][0] === student.email) {
      sheet.deleteRow(i + 1);
    }
  }

  // Append one row per component
  const now = submittedAt || new Date().toISOString();
  weightItems.forEach(function(item) {
    if (item.component && item.component.trim()) {
      sheet.appendRow([
        student.email,
        student.name,
        subsystemName || '',
        item.component,
        item.qty || 0,
        item.unitMass || 0,
        item.totalMass || 0,
        item.notes || '',
        now
      ]);
    }
  });

  logActivity('WEIGHT', student.email, 'Weight data saved: ' + weightItems.length + ' components, subsystem: ' + subsystemName);
}

/**
 * Log activity
 */
function logActivity(type, email, details) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAMES.LOG);
    if (sheet) {
      sheet.appendRow([
        new Date().toISOString(),
        type,
        email || '',
        details || ''
      ]);
    }
  } catch (e) {
    console.error('Failed to log activity:', e);
  }
}

// ============================================
// TEACHER UTILITIES
// ============================================

/**
 * Create a summary report
 * Run this from Apps Script editor to generate a summary
 */
function generateSummaryReport() {
  const data = loadAllData();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Create or get summary sheet
  let summarySheet = ss.getSheetByName('Summary Report');
  if (summarySheet) {
    summarySheet.clear();
  } else {
    summarySheet = ss.insertSheet('Summary Report');
  }

  // Header
  summarySheet.getRange(1, 1).setValue('FRC Portfolio Summary Report');
  summarySheet.getRange(1, 1).setFontSize(18).setFontWeight('bold');
  summarySheet.getRange(2, 1).setValue(`Generated: ${new Date().toLocaleString()}`);

  // Stats
  summarySheet.getRange(4, 1, 1, 2).setValues([['Total Students', data.summary.totalStudents]]);
  summarySheet.getRange(5, 1, 1, 2).setValues([['Total Reflections', data.summary.totalReflections]]);
  summarySheet.getRange(6, 1, 1, 2).setValues([['Total Deliverables', data.summary.totalDeliverables]]);

  // Student progress table
  summarySheet.getRange(8, 1).setValue('Student Progress');
  summarySheet.getRange(8, 1).setFontWeight('bold');

  const headers = ['Name', 'Team', 'Period', 'Reflections', 'Deliverables', 'Est. Points'];
  summarySheet.getRange(9, 1, 1, headers.length).setValues([headers]);
  summarySheet.getRange(9, 1, 1, headers.length).setFontWeight('bold').setBackground('#e8eaed');

  let row = 10;
  data.students.forEach(student => {
    const email = student[0];
    const reflectionCount = data.reflections.filter(r => r[0] === email).length;
    const deliverableCount = data.deliverables.filter(d => d[0] === email && d[7] === 'completed').length;

    // Estimate points
    const pointValues = { 1: 50, 2: 50, 3: 75, 4: 50, 5: 75, 6: 50, 7: 50, 8: 75, 9: 100, 10: 100 };
    let points = reflectionCount * 20;
    data.deliverables.filter(d => d[0] === email && d[7] === 'completed').forEach(d => {
      points += pointValues[d[2]] || 0;
    });

    summarySheet.getRange(row, 1, 1, 6).setValues([[
      student[1], // Name
      student[2], // Team
      student[3], // Period
      reflectionCount,
      deliverableCount,
      points
    ]]);
    row++;
  });

  // Auto-resize columns
  summarySheet.autoResizeColumns(1, 6);

  SpreadsheetApp.getUi().alert('Summary report generated! Check the "Summary Report" sheet.');
}

/**
 * Send reminder emails via web request (called from teacher portal)
 */
function sendRemindersWeb(semesterStart) {
  const data = loadAllData();
  const startDate = semesterStart ? new Date(semesterStart) : new Date('2026-02-02');
  const diffTime = new Date() - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const currentWeek = Math.floor(diffDays / 7) + 1;
  let emailsSent = 0;
  const emailedStudents = [];

  // Read skip config from Config sheet
  const cfg = handleGetConfig();
  const skipReflectionWeeks  = cfg.skipReflectionWeeks  || [];
  const skipDeliverableWeeks = cfg.skipDeliverableWeeks || [];

  // FRC Deliverable titles by ID — omit any that are optional
  const deliverableTitles = {
    1: 'Game Analysis Report',
    2: 'Subsystem Research Report',
    3: 'Design Contribution',
    4: 'Design Decision Matrix',
    5: 'Prototype Documentation',
    6: 'Testing & Iteration Log',
    7: 'Robot Readiness Contributions',
    8: 'Technical Contribution Summary',
    9: 'Engineer Portfolio Entry',
    10: 'Final Presentation'
  };

  data.students.forEach(student => {
    const email = student[0];
    const name = student[1];

    // Check missing reflections — only weeks whose Friday 3pm deadline has passed
    const submittedWeeks = data.reflections
      .filter(r => r[0] === email)
      .map(r => r[2]);

    const now = new Date();
    const missingReflections = [];
    for (let w = 1; w <= currentWeek; w++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(weekStart.getDate() + (w - 1) * 7);
      const fridayDeadline = new Date(weekStart);
      fridayDeadline.setDate(fridayDeadline.getDate() + 4);
      fridayDeadline.setHours(15, 0, 0, 0);
      if (now > fridayDeadline && !skipReflectionWeeks.includes(w) && !submittedWeeks.includes(w)) {
        missingReflections.push(w);
      }
    }

    // Check missing deliverables — only past-deadline weeks, skip optional/skipped
    const completedDeliverables = data.deliverables
      .filter(d => d[0] === email && d[7] === 'completed')
      .map(d => d[2]);

    const missingDeliverables = [];
    for (let id = 1; id <= currentWeek && id <= 10; id++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(weekStart.getDate() + (id - 1) * 7);
      const fridayDeadline = new Date(weekStart);
      fridayDeadline.setDate(fridayDeadline.getDate() + 4);
      fridayDeadline.setHours(15, 0, 0, 0);
      if (now > fridayDeadline && deliverableTitles[id] && !skipDeliverableWeeks.includes(id) && !completedDeliverables.includes(id)) {
        missingDeliverables.push(deliverableTitles[id]);
      }
    }

    if (missingReflections.length > 0 || missingDeliverables.length > 0) {
      let body = `Hi ${name},\n\nYou have missing portfolio work:\n`;
      if (missingReflections.length > 0) {
        body += `\nMissing Reflections: Weeks ${missingReflections.join(', ')}`;
      }
      if (missingDeliverables.length > 0) {
        body += `\nMissing Deliverables:\n- ${missingDeliverables.join('\n- ')}`;
      }
      body += `\n\nPlease submit them as soon as possible.\n\nPortfolio: https://mbombich-robotics.github.io/lessons/Unit_08_FIRST_Robotics_Competition/FRC_Portfolio_System/index.html\n\nMr. B`;

      MailApp.sendEmail({
        to: email,
        subject: 'FRC Portfolio Reminder - Missing Work',
        body: body
      });

      emailsSent++;
      emailedStudents.push({ name, email, missingReflections, missingDeliverables });
    }
  });

  logActivity('REMINDERS', 'teacher', `Sent ${emailsSent} reminder emails via portal`);
  return { success: true, emailsSent, emailedStudents };
}

/**
 * Send reminder emails to students with missing work
 * Customize and run from Apps Script editor
 */
function sendReminderEmails() {
  // This is a template - customize before using
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Send Reminders',
    'This will send reminder emails to students with missing work. Continue?',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) return;

  const data = loadAllData();
  const currentWeek = Math.ceil((new Date() - new Date('2026-02-02')) / (1000 * 60 * 60 * 24 * 7));
  let emailsSent = 0;

  data.students.forEach(student => {
    const email = student[0];
    const name = student[1];

    // Check for missing reflections
    const submittedWeeks = data.reflections
      .filter(r => r[0] === email)
      .map(r => r[2]);

    const missingWeeks = [];
    for (let w = 1; w <= currentWeek; w++) {
      if (!submittedWeeks.includes(w)) {
        missingWeeks.push(w);
      }
    }

    if (missingWeeks.length > 0) {
      MailApp.sendEmail({
        to: email,
        subject: 'FRC Portfolio Reminder - Missing Reflections',
        body: `Hi ${name},\n\nYou have missing weekly reflections for weeks: ${missingWeeks.join(', ')}.\n\nPlease submit them as soon as possible.\n\nPortfolio: https://mbombich-robotics.github.io/lessons/Unit_08_FIRST_Robotics_Competition/FRC_Portfolio_System/index.html\n\nMr. B`
      });

      console.log(`Emailed ${email}: Missing weeks ${missingWeeks.join(', ')}`);
      emailsSent++;
    }
  });

  ui.alert(`Sent ${emailsSent} reminder emails. Check the execution log for details.`);
}

// ============================================
// AI FEEDBACK (Gemini)
// ============================================

/**
 * Get AI feedback on a student submission using Gemini API.
 * Requires GEMINI_API_KEY to be set in Script Properties:
 *   File > Project Settings > Script Properties > Add: GEMINI_API_KEY = your_key
 */
function getAIFeedback(data) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) {
    return { error: 'AI feedback is not configured. Set GEMINI_API_KEY in Script Properties.' };
  }

  const { type, content, title, week, rubricScores } = data;

  // Build the prompt based on submission type
  let submissionText = '';
  if (type === 'reflection') {
    const contributions = content.contributions || [];
    const contribText = contributions.map(c => `  ${c.date}: ${c.task}`).join('\n');
    submissionText = [
      `WEEKLY REFLECTION - Week ${week}`,
      '',
      'Daily Contributions:',
      contribText || '  (none provided)',
      '',
      'Challenges: ' + (content.challenges || '(not provided)'),
      'Solutions: ' + (content.solutions || '(not provided)'),
      '',
      'Goals for Next Week:',
      (content.goals || []).map(g => `  - ${g}`).join('\n') || '  (none provided)'
    ].join('\n');
  } else if (type === 'deliverable') {
    submissionText = [
      `DELIVERABLE: ${title || 'Untitled'}`,
      '',
      content.text || content || ''
    ].join('\n');
  }

  const selfAssessment = rubricScores ? `\nStudent self-assessment: ${JSON.stringify(rubricScores)}` : '';

  const prompt = `You are a supportive FRC (FIRST Robotics Competition) engineering teacher reviewing a high school student's portfolio submission. Your goal is to help them improve their submission by one quality level.

SUBMISSION:
${submissionText}
${selfAssessment}

EVALUATION CRITERIA:
- Specificity: Does the student mention specific tools, components, code functions, or technical details? (e.g., "designed the intake roller spacing in OnShape" vs "worked on the robot")
- Detail: Is the description thorough enough to understand what was accomplished?
- Completeness: Are all sections addressed with meaningful content?
- Insight: Does the student show genuine reflection, problem-solving thinking, and learning?

RESPONSE FORMAT - You MUST respond with valid JSON only, no markdown:
{
  "level": "A" or "B" or "C" or "D",
  "summary": "One sentence overall assessment",
  "scores": {
    "specificity": 1-4,
    "detail": 1-4,
    "completeness": 1-4,
    "insight": 1-4
  },
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["specific actionable suggestion 1", "specific actionable suggestion 2", "specific actionable suggestion 3"],
  "example": "Take one weak part of their submission and rewrite it to show what a stronger version looks like"
}

TONE GUIDELINES:
- If the submission is minimal or vague (D-level): Be warm and encouraging. Focus on easy, concrete wins. Example: "You mentioned working on the robot - try adding which specific part you worked on and what tool you used."
- If the submission shows effort but lacks depth (C-level): Be supportive but direct. Point out exactly where more detail would strengthen it.
- If the submission is solid but could be polished (B-level): Be professional. Highlight what makes it good and suggest refinements for excellence.
- If the submission is strong (A-level): Affirm the quality. Suggest minor polish only.

Remember: respond with ONLY the JSON object, no other text.`;

  try {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey;

    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024
        }
      }),
      muteHttpExceptions: true
    });

    const result = JSON.parse(response.getContentText());

    if (result.error) {
      return { error: 'Gemini API error: ' + result.error.message };
    }

    const aiText = result.candidates[0].content.parts[0].text;

    // Parse the JSON response (strip markdown code fences if present)
    const cleanJson = aiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const feedback = JSON.parse(cleanJson);

    logActivity('AI_FEEDBACK', data.email || 'unknown', `${type} week ${week || ''}: Level ${feedback.level}`);

    return { success: true, feedback };
  } catch (error) {
    logActivity('AI_ERROR', data.email || 'unknown', error.toString());
    return { error: 'Failed to get AI feedback: ' + error.toString() };
  }
}

/**
 * Create menu when spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('FRC Portfolio')
    .addItem('Initialize Sheets', 'initializeSheets')
    .addItem('Generate Summary Report', 'generateSummaryReport')
    .addItem('Send Reminder Emails', 'sendReminderEmails')
    .addToUi();
}
