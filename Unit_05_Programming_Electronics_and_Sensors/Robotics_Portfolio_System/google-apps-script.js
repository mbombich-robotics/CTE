/**
 * Robotics Portfolio - Google Apps Script Backend
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete the default code and paste this entire file
 * 4. Save the project (give it a name like "Robotics Portfolio Backend")
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
const BACKEND_VERSION = 'v2.9.45';

// Shared secret — must match CONFIG.TEACHER_TOKEN in teacher-portal.js
const TEACHER_TOKEN = 'rp-portal-teach-2026';

const SHEET_NAMES = {
  STUDENTS: 'Students',
  REFLECTIONS: 'Weekly Reflections',
  DELIVERABLES: 'Deliverables',
  EVIDENCE: 'Evidence',
  CONFIG: 'Config',
  LOG: 'Activity Log',
  QUIZ: 'Claw Quiz'
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

      case 'checkQuiz':
        return jsonResponse(handleCheckQuiz(e));

      case 'getQuizMeta':
        return jsonResponse(handleGetQuizMeta(e));

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

      case 'submitQuiz':
        return jsonResponse(handleSubmitQuiz(data));

      case 'regradeQuiz':
        return jsonResponse(handleRegradeQuiz(data));

      case 'saveQuizGrade':
        return jsonResponse(handleSaveQuizGrade(data));

      case 'gradeDesignBrief':
        return jsonResponse(handleGradeDesignBrief(data));

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
  const config = { skipReflectionWeeks: [], skipDeliverableWeeks: [], expectedVersion: '', quizEnabled: false, reflectionDueDates: {}, deliverableDueDates: {} };
  if (configSheet && configSheet.getLastRow() > 0) {
    configSheet.getDataRange().getValues().forEach(row => {
      try {
        if (row[0] === 'skipReflectionWeeks')  config.skipReflectionWeeks  = JSON.parse(row[1] || '[]');
        if (row[0] === 'skipDeliverableWeeks') config.skipDeliverableWeeks = JSON.parse(row[1] || '[]');
        if (row[0] === 'expectedVersion')       config.expectedVersion      = row[1] || '';
        if (row[0] === 'quizEnabled')           config.quizEnabled          = row[1] === true || row[1] === 'true';
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
    quizEnabled:          data.quizEnabled === true ? true : false,
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
  try {
    saveFullState(data.student.email, data);
  } catch (fsError) {
    // Log but do not abort — individual row writes below must still run
    logActivity('ERROR', data.student.email, 'saveFullState threw: ' + fsError.toString());
  }

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

      const fullCodeSnippets = (data.codeSnippets && data.codeSnippets.length > 0) ? data.codeSnippets : existingCodeSnippets;
      const fullViewedFeedback = (data.viewedFeedback && data.viewedFeedback.length > 0) ? data.viewedFeedback : existingViewedFeedback;

      const buildJson = (includeSnippets) => JSON.stringify({
        student: data.student,
        weeklyReflections: mergedReflections,
        deliverables: mergedDeliverables,
        codeSnippets: includeSnippets ? fullCodeSnippets : [],
        viewedFeedback: fullViewedFeedback,
        lastSynced: data.timestamp || new Date().toISOString(),
        _codeSnippetsStripped: !includeSnippets
      });

      // Google Sheets cells cap at 50,000 characters. Try full state first,
      // then fall back to stripping code snippets. Never throw — a failed
      // fullState write must not block the individual deliverable row writes.
      const CELL_LIMIT = 49500;
      let stateJson = buildJson(true);
      if (stateJson.length > CELL_LIMIT) {
        stateJson = buildJson(false);
        logActivity('WARN', email, `Full state too large (stripped code snippets): ${stateJson.length} chars`);
      }
      try {
        sheet.getRange(i + 1, 9).setValue(stateJson.substring(0, CELL_LIMIT));
      } catch (cellError) {
        logActivity('ERROR', email, 'saveFullState cell write failed: ' + cellError.toString());
      }
      return;
    }
  }
}

/**
 * Register a new student (or update if already exists)
 */
function registerStudent(student) {
  initializeSheets();
  updateStudentRecord(student);
  logActivity('REGISTER', student.email, 'Student registered: ' + student.name);
  return { success: true };
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

  // Deliverable titles for Robotics class
  const titles = {
    1: 'Line Following Practical #1',
    2: 'Line Following Practical #2',
    3: 'Ultrasonic Sensor Lab Report',
    4: 'Scanner Assembly',
    5: 'Scanning Practical',
    6: 'Wall Following Robot',
    7: 'Motor Functions & PWM Values',
    8: 'Claw Practical',
    9: 'Final Robot Demonstration'
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

  // Look up student name
  const studentsSheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  const studentsData  = studentsSheet.getDataRange().getValues();
  let studentName = '';
  for (let i = 1; i < studentsData.length; i++) {
    if (studentsData[i][0] === data.email) { studentName = studentsData[i][1]; break; }
  }
  if (!studentName) return { error: 'Student not found: ' + data.email };

  const titles = {
    1: 'Line Following Practical #1',
    2: 'Line Following Practical #2',
    3: 'Ultrasonic Sensor Lab Report',
    4: 'Scanner Assembly',
    5: 'Scanning Practical',
    6: 'Wall Following Robot',
    7: 'Motor Functions & PWM Values',
    8: 'Claw Practical',
    9: 'Final Robot Demonstration'
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
    // Update content columns A-I; preserve Grade (J), Feedback (K), Graded At (L)
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
      '' // Grade (teacher fills in)
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

/**
 * Load student data
 */
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

          // Also merge deliverable grades/feedback
          const deliverablesSheet = ss.getSheetByName(SHEET_NAMES.DELIVERABLES);
          const deliverablesData = deliverablesSheet.getDataRange().getValues();

          for (let j = 1; j < deliverablesData.length; j++) {
            if (deliverablesData[j][0] === email) {
              const id = deliverablesData[j][2];
              if (fullState.deliverables && fullState.deliverables[id]) {
                // Grade in column J (index 9), Feedback in column K (index 10)
                fullState.deliverables[id].teacherGrade = deliverablesData[j][9] || undefined;
                fullState.deliverables[id].teacherFeedback = deliverablesData[j][10] || '';
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

      return { student, weeklyReflections, deliverables, evidence, codeSnippets: [] };
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
  const quiz         = safeGetSheet(SHEET_NAMES.QUIZ);

  return {
    students:     students.slice(1),
    reflections:  reflections.slice(1),
    deliverables: deliverables.slice(1),
    evidence:     evidence.slice(1),
    quiz:         quiz.slice(1),
    summary: {
      totalStudents:     Math.max(0, students.length - 1),
      totalReflections:  Math.max(0, reflections.length - 1),
      totalDeliverables: Math.max(0, deliverables.length - 1)
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
  summarySheet.getRange(1, 1).setValue('Robotics Portfolio Summary Report');
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

  // Deliverable titles by ID — optional deliverables are excluded from reminders
  const deliverableTitles = {
    1: 'Line Following Practical #1',
    2: 'Line Following Final Practical',
    3: 'Ultrasonic Sensor Lab Report',
    4: 'Scanner Assembly',
    5: 'Scanning Practical',
    7: 'Motor Functions & PWM Values',
    8: 'Claw Practical',
    9: 'Final Robot Demonstration'
    // 6 (Wall Following Robot) intentionally omitted — optional deliverable
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
    for (let id = 1; id <= currentWeek && id <= 9; id++) {
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
      body += `\n\nPlease submit them as soon as possible.\n\nPortfolio: https://mbombich-robotics.github.io/lessons/Unit_05_Programming_Electronics_and_Sensors/Robotics_Portfolio_System/index.html\n\nMr. B`;

      MailApp.sendEmail({
        to: email,
        subject: 'Robotics Portfolio Reminder - Missing Work',
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
        subject: 'Robotics Portfolio Reminder - Missing Reflections',
        body: `Hi ${name},\n\nYou have missing weekly reflections for weeks: ${missingWeeks.join(', ')}.\n\nPlease submit them as soon as possible.\n\nPortfolio: https://mbombich-robotics.github.io/lessons/Unit_05_Programming_Electronics_and_Sensors/Robotics_Portfolio_System/index.html\n\nMr. B`
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

  const prompt = `You are a supportive robotics engineering teacher reviewing a high school student's portfolio submission. Your goal is to help them improve their submission by one quality level.

SUBMISSION:
${submissionText}
${selfAssessment}

EVALUATION CRITERIA:
- Specificity: Does the student mention specific tools, components, code functions, or technical details? (e.g., "adjusted PID constants" vs "worked on the robot")
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

// ============================================
// QUIZ INFRASTRUCTURE
// ============================================
//
// Quiz questions and rubrics are stored in a SEPARATE file called quiz-content.js
// which is NOT tracked in git (see .gitignore) to keep questions private from students.
//
// To set up: in the Apps Script editor, create a second script file named quiz-content.js
// and paste the contents from your local copy (ask Mr. Bombich if you need it).
//
// quiz-content.js must define:
//   const QUIZ_REGISTRY = {
//     claw: { name, sheetName, maxPoints, context, questions: [{id, label, maxPts, question, rubric}, ...] }
//   };

// Helper — returns questions array for a quiz ID (falls back to [] if registry not loaded)
function quizQuestions(quizId) {
  if (typeof QUIZ_REGISTRY !== 'undefined' && QUIZ_REGISTRY[quizId]) {
    return QUIZ_REGISTRY[quizId].questions;
  }
  return [];
}

// Helper — returns the sheet name for a quiz ID
function quizSheetName(quizId) {
  if (typeof QUIZ_REGISTRY !== 'undefined' && QUIZ_REGISTRY[quizId]) {
    return QUIZ_REGISTRY[quizId].sheetName;
  }
  return SHEET_NAMES.QUIZ; // fallback to legacy constant
}

function handleGetQuizMeta(e) {
  const quizId = (e.parameter.quizId || 'claw').trim();
  if (typeof QUIZ_REGISTRY === 'undefined' || !QUIZ_REGISTRY[quizId]) {
    return { error: 'Quiz registry not loaded or quiz not found: ' + quizId };
  }
  const quiz = QUIZ_REGISTRY[quizId];
  return {
    quizId,
    name: quiz.name,
    maxPoints: quiz.maxPoints,
    questions: quiz.questions.map(q => ({ id: q.id, label: q.label, pts: q.maxPts, text: q.question }))
  };
}

// Legacy constant name kept for any code that still references it directly
// (actual data lives in quiz-content.js via QUIZ_REGISTRY)
const QUIZ_QUESTIONS = [
  { id: 'q1', maxPts: 4, label: 'Q1 – PWM',
    question: 'In your own words, what is PWM? How does the pulse width physically cause the servo to move to a different position?',
    rubric: `Award 0–4:
1 pt – Identifies PWM as Pulse Width Modulation (or describes on/off pulses at fixed frequency).
1 pt – Explains duty cycle: ratio of on-time to total period.
1 pt – Connects duty cycle/pulse width to a specific servo angle.
1 pt – Explanation is in the student's own words showing real understanding, not a copy-paste.` },
  { id: 'q2', maxPts: 4, label: 'Q2 – Contact Detection',
    question: 'Describe in plain English how your code knows the claw has touched an object without being able to see it. Why is this better than just closing the claw all the way every time?',
    rubric: `Award 0–4:
2 pts – Explains that the potentiometer ADC reading stalls/stops changing when the claw contacts resistance. Code detects contact when the value stops increasing despite the motor still trying to close.
2 pts – Explains why better than full-close: prevents crushing fragile objects, adapts to different sizes, avoids motor stall damage.` },
  { id: 'q3', maxPts: 4, label: 'Q3 – Code Reading (abs)',
    question: 'Given: if (abs(currentFeedback - holdFeedback) > 15) — a) What does abs() do and why is it needed here? b) What real-world event does this line detect?',
    rubric: `Award 0–4 (2 per part):
Part a: abs() returns absolute value. Needed because feedback could increase OR decrease depending on slip direction — we need the magnitude regardless of sign.
Part b: Detects an object slipping in the grip. Object movement shifts the claw ADC value more than 15 units from its hold position.` },
  { id: 'q4', maxPts: 4, label: 'Q4 – Rate of Closure',
    question: 'What controls how fast your claw closes? Point to the specific line, value, or variable responsible, and explain what would happen if you changed it.',
    rubric: `Award 0–4:
2 pts – Identifies something specific: a delay() value between servo steps, a step-size increment, or a millis() interval. Vague "the loop" answers earn 0–1.
2 pts – Correctly explains effect of changing it: larger delay/smaller step = slower; smaller delay/larger step = faster.` },
  { id: 'q5', maxPts: 4, label: 'Q5 – Object Detection Line',
    question: 'Which specific line(s) in your code read the potentiometer and compare against your contact threshold? Write the line out and explain what each part does.',
    rubric: `Award 0–4:
1 pt – Includes analogRead() call.
1 pt – Stores/uses the returned value correctly.
1 pt – Includes a comparison against a threshold (>, >=, etc.).
1 pt – Can explain what each part does (what analogRead returns, what the threshold represents).` },
  { id: 'q6', maxPts: 6, label: 'Q6 – Blocking Code',
    question: 'What is blocking code? Using delay() as an example, explain why a blocking approach would have made it impossible to close the claw and check for contact at the same time — and describe how your program avoided this problem.',
    rubric: `Award 0–6:
2 pts – Correctly defines blocking code: halts all execution until finished (delay(1000) = CPU does nothing for 1 second).
2 pts – Explains the specific problem: delay() between servo steps would prevent analogRead() contact checks from running, so contact could be missed entirely.
2 pts – Describes their non-blocking solution: small servo increments each loop() pass, checking ADC every iteration, using millis() instead of delay(), or similar. Must be specific to their code.` },
  { id: 'bonus', maxPts: 2, label: 'Bonus – Active-Low LED',
    question: 'What does "active low" mean for the RGB LED on the RP2040 Connect? Why does it matter when you write code to turn on a specific color?',
    rubric: `Award 0–2:
1 pt – Active-low means LED turns ON when pin is driven LOW (0V), not HIGH.
1 pt – Practical consequence: to turn a color ON you write LOW (0) to that pin — opposite of what most expect. Writing HIGH turns it OFF.` }
];

function getOrCreateQuizSheet(quizId) {
  quizId = quizId || 'claw';
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sName = quizSheetName(quizId);
  let sheet = ss.getSheetByName(sName);
  if (!sheet) {
    sheet = ss.insertSheet(sName);
    const questions = quizQuestions(quizId).length ? quizQuestions(quizId) : QUIZ_QUESTIONS;
    const headers = ['Timestamp', 'Email', 'Name'];
    questions.forEach(q => {
      headers.push(q.label + ' Answer', q.label + ' AI Score', q.label + ' AI Feedback');
    });
    headers.push('AI Total', 'Teacher Final Score');
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    let col = 4;
    questions.forEach(() => {
      sheet.setColumnWidth(col,     320);
      sheet.setColumnWidth(col + 1, 80);
      sheet.setColumnWidth(col + 2, 260);
      col += 3;
    });
    sheet.setColumnWidth(col, 80);
    sheet.setColumnWidth(col + 1, 120);
  }
  return sheet;
}

function quizEmailSubmitted(sheet, email) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).toLowerCase().trim() === email.toLowerCase().trim()) return i + 1; // 1-based row
  }
  return 0;
}

function handleCheckQuiz(e) {
  const email = (e.parameter.email || '').trim();
  if (!email) return { error: 'Missing email' };
  const quizId = (e.parameter.quizId || 'claw').trim();
  const sheet = getOrCreateQuizSheet(quizId);
  const row = quizEmailSubmitted(sheet, email);
  if (!row) return { submitted: false };

  const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  const questions = quizQuestions(quizId).length ? quizQuestions(quizId) : QUIZ_QUESTIONS;
  const grades = {};
  let col = 3; // 0-based: col 0=timestamp, 1=email, 2=name, 3=first answer
  questions.forEach(q => {
    grades[q.id] = { answer: rowData[col], score: rowData[col + 1], feedback: rowData[col + 2] };
    col += 3;
  });
  const aiTotal = rowData[col];
  return { submitted: true, grades, aiTotal };
}

function handleSubmitQuiz(data) {
  if (data.token !== TEACHER_TOKEN && !data.email) return { error: 'Unauthorized' };
  const email = (data.email || '').trim();
  if (!email) return { error: 'Missing email' };
  const quizId = (data.quizId || 'claw').trim();
  const questions = quizQuestions(quizId).length ? quizQuestions(quizId) : QUIZ_QUESTIONS;

  const sheet = getOrCreateQuizSheet(quizId);
  if (quizEmailSubmitted(sheet, email)) return { success: false, error: 'already_submitted' };

  let gradeMap = {};
  let gradingError = null;
  try {
    gradeMap = gradeQuiz(quizId, data);
  } catch(err) {
    gradingError = err.toString();
    logActivity('QUIZ_GRADE_ERROR', email, gradingError);
    questions.forEach(q => {
      gradeMap[q.id] = { score: null, feedback: 'AI grading unavailable — Mr. Bombich will grade manually.' };
    });
  }

  let aiTotal = gradingError ? null : 0;
  if (!gradingError) {
    questions.forEach(q => {
      const g = gradeMap[q.id] || { score: 0 };
      aiTotal += Math.min(Number(g.score) || 0, q.maxPts);
    });
  }

  const row = [data.timestamp || new Date().toLocaleString(), email, data.name || ''];
  questions.forEach(q => {
    const g = gradeMap[q.id] || { score: null, feedback: '' };
    const score = g.score === null ? '' : Math.min(Number(g.score) || 0, q.maxPts);
    row.push((data[q.id] || '').trim(), score, g.feedback || '');
  });
  row.push(aiTotal !== null ? aiTotal : '', '');
  sheet.appendRow(row);

  questions.forEach(q => { if (gradeMap[q.id]) gradeMap[q.id].answer = (data[q.id] || '').trim(); });

  const maxPts = (typeof QUIZ_REGISTRY !== 'undefined' && QUIZ_REGISTRY[quizId]) ? QUIZ_REGISTRY[quizId].maxPoints : 26;
  logActivity('QUIZ_SUBMIT', email, gradingError ? 'AI grading failed — saved for manual grading' : `AI Total: ${aiTotal}/${maxPts}`);
  return { success: true, grades: gradeMap, aiTotal, gradingPending: !!gradingError, gradingErrorMessage: gradingError || null };
}

function handleRegradeQuiz(data) {
  if (data.token !== TEACHER_TOKEN) return { error: 'Unauthorized' };
  const email = (data.email || '').trim();
  if (!email) return { error: 'Missing email' };
  const quizId = (data.quizId || 'claw').trim();
  const questions = quizQuestions(quizId).length ? quizQuestions(quizId) : QUIZ_QUESTIONS;

  const sheet = getOrCreateQuizSheet(quizId);
  const rowNum = quizEmailSubmitted(sheet, email);
  if (!rowNum) return { error: 'No submission found for ' + email };

  const rowData = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).getValues()[0];
  const answers = {};
  let col = 3;
  questions.forEach(q => { answers[q.id] = rowData[col]; col += 3; });

  let gradeMap, gradingError = null;
  try {
    gradeMap = gradeQuiz(quizId, answers);
  } catch(err) {
    gradingError = err.toString();
    logActivity('QUIZ_REGRADE_ERROR', email, gradingError);
    return { success: false, error: gradingError };
  }

  let aiTotal = 0;
  col = 3;
  questions.forEach(q => {
    const g = gradeMap[q.id] || { score: 0, feedback: '' };
    const score = Math.min(Number(g.score) || 0, q.maxPts);
    aiTotal += score;
    sheet.getRange(rowNum, col + 2).setValue(score);
    sheet.getRange(rowNum, col + 3).setValue(g.feedback || '');
    col += 3;
  });
  sheet.getRange(rowNum, col + 1).setValue(aiTotal);

  const maxPts = (typeof QUIZ_REGISTRY !== 'undefined' && QUIZ_REGISTRY[quizId]) ? QUIZ_REGISTRY[quizId].maxPoints : 26;
  logActivity('QUIZ_REGRADE', email, `AI Total: ${aiTotal}/${maxPts}`);
  return { success: true, grades: gradeMap, aiTotal };
}

function handleSaveQuizGrade(data) {
  if (data.token !== TEACHER_TOKEN) return { error: 'Unauthorized' };
  const email = (data.email || '').trim();
  if (!email) return { error: 'Missing email' };
  const quizId = (data.quizId || 'claw').trim();
  const questions = quizQuestions(quizId).length ? quizQuestions(quizId) : QUIZ_QUESTIONS;
  const sheet = getOrCreateQuizSheet(quizId);
  const rowNum = quizEmailSubmitted(sheet, email);
  if (!rowNum) return { error: 'No submission found' };
  // Teacher Final Score column: 1-indexed = 3(fixed cols) + N*3(question cols) + 1(aiTotal) + 1 = N*3 + 5
  // But Apps Script setRange is 1-indexed: col 1 = timestamp, so offset by 1
  // 0-indexed: col = 3 + N*3 + 1 = N*3+4; 1-indexed: N*3+5
  const teacherFinalCol = questions.length * 3 + 5;
  sheet.getRange(rowNum, teacherFinalCol).setValue(data.score);
  logActivity('QUIZ_GRADE_SAVED', email, 'Teacher final: ' + data.score);
  return { success: true };
}

function gradeQuiz(quizId, answers) {
  const questions = quizQuestions(quizId).length ? quizQuestions(quizId) : QUIZ_QUESTIONS;
  if (!questions.length) throw new Error('No questions found for quiz: ' + quizId);

  const context = (typeof QUIZ_REGISTRY !== 'undefined' && QUIZ_REGISTRY[quizId])
    ? (QUIZ_REGISTRY[quizId].context || 'robotics and programming')
    : 'robotics and programming';

  const apiKey = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set in Script Properties.');

  const responseTemplate = questions.map(q => `  "${q.id}": {"score": <int 0-${q.maxPts}>, "feedback": "<1-2 sentences>"}`).join(',\n');
  let prompt = `You are grading a high school robotics quiz about ${context}.
Grade each answer using only its rubric. Be fair but strict. Award partial credit for partial understanding.

Respond with ONLY a valid JSON object — no markdown fences, no other text:
{\n${responseTemplate}\n}

`;

  questions.forEach(q => {
    const answer = (answers[q.id] || '').trim() || '(no answer)';
    prompt += `---\nid: ${q.id} | max: ${q.maxPts}\nQuestion: ${q.question}\nRubric: ${q.rubric}\nStudent answer: "${answer.replace(/"/g, "'").substring(0, 800)}"\n\n`;
  });

  const url = 'https://api.anthropic.com/v1/messages';
  const fetchOpts = {
    method: 'post',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    payload: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    }),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, fetchOpts);
  const result = JSON.parse(response.getContentText());
  if (result.type === 'error') throw new Error('Claude: ' + result.error.message);

  const text = result.content[0].text;
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Create menu when spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Robotics Portfolio')
    .addItem('Initialize Sheets', 'initializeSheets')
    .addItem('Generate Summary Report', 'generateSummaryReport')
    .addItem('Send Reminder Emails', 'sendReminderEmails')
    .addToUi();
}

// ============================================
// DESIGN BRIEF AI GRADING
// ============================================

function handleGradeDesignBrief(data) {
  if (data.token !== TEACHER_TOKEN) return { error: 'Unauthorized' };
  const docUrl = (data.docUrl || '').trim();
  if (!docUrl) return { error: 'Missing docUrl' };
  const deliverableId = Number(data.deliverableId);
  if (deliverableId !== 8 && deliverableId !== 9) return { error: 'Only deliverables 8 and 9 support Design Brief grading' };

  const idMatch = docUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!idMatch) return { error: 'Could not extract Google Doc ID from URL' };
  const docId = idMatch[1];

  // Fetch the doc via Drive API using the script owner's OAuth token. The
  // anonymous /export?format=html URL fails with 401 unless sharing is "Anyone
  // with the link"; this path uses the executing user's credentials (Mr.
  // Bombich, since the web app is "Execute as: Me") so any doc shared with
  // him — including domain-shared "Vicksburg" docs — works.
  //
  // The DriveApp.getFileById call does two things: it verifies the executing
  // user actually has access (gives a clean error if not), AND it tells Apps
  // Script's static analyzer to include the Drive scope in the OAuth token.
  let docHtml;
  try {
    try {
      DriveApp.getFileById(docId).getName();
    } catch(driveErr) {
      return { error: 'Cannot open the document. The student needs to share their Google Doc with mbombich@vicksburgschools.org (or set link sharing to "Anyone at Vicksburg Schools").' };
    }

    const exportUrl = 'https://www.googleapis.com/drive/v3/files/' + docId + '/export?mimeType=text/html';
    const resp = UrlFetchApp.fetch(exportUrl, {
      headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
      muteHttpExceptions: true
    });
    const code = resp.getResponseCode();
    if (code !== 200) {
      return { error: 'Drive API export failed: HTTP ' + code + ' — ' + resp.getContentText().substring(0, 200) };
    }
    docHtml = resp.getContentText();
  } catch(e) {
    return { error: 'Failed to fetch document: ' + e.message };
  }

  try {
    const grades = gradeDesignBriefWithClaude(docHtml, deliverableId);
    return { success: true, grades };
  } catch(e) {
    return { success: false, error: e.message };
  }
}

function gradeDesignBriefWithClaude(docHtml, deliverableId) {
  // Extract external hyperlink URLs before stripping HTML
  const urls = [];
  const hrefRe = /href="([^"]+)"/g;
  let m;
  while ((m = hrefRe.exec(docHtml)) !== null) {
    const u = m[1];
    if (u.startsWith('http') && !u.includes('docs.google.com/document') && !u.includes('accounts.google.com') && !u.includes('drive.google.com')) {
      urls.push(u);
    }
  }

  // Strip HTML to plain text
  let docText = docHtml
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (docText.length > 50000) docText = docText.substring(0, 50000) + '\n[...document truncated...]';

  const urlNote = urls.length > 0
    ? 'External hyperlinks found in document: ' + urls.slice(0, 20).join(' | ')
    : 'No external hyperlinks detected in document.';

  const rubricD8 = `RUBRIC — DELIVERABLE 8 CHECKPOINT (50 pts):

Section 1 — Project Overview:
s1_purpose (max 3): Clearly states what the project is, what the system does (grip/classify/slip detection), and WHY it is useful. Written in student's own voice (2-4 sentences, NOT AI-sounding). 3=all present, own voice; 2=vague/incomplete; 1=AI-paste, no personal voice; 0=missing.
s1_goals (max 3): Lists 2-3 SPECIFIC learning goals (e.g. "I will learn how PWM controls servo position" not "I will learn programming"). 3=2-3 specific; 2=generic; 1=one vague; 0=missing.

Section 2 — Bill of Materials:
s2_completeness (max 4): All major components listed: microcontroller, servo, potentiometer, LED, resistor, claw hardware, power supply. 4=all; 2-3=1-2 missing; 1=fewer than half; 0=absent.
s2_links (max 4): Hyperlinks to datasheets for servo, potentiometer, and at least one other component. Use the "External hyperlinks" list — if 3+ URLs found, give full credit. 4=3+ URLs; 2-3=2 URLs; 1=1 URL; 0=no URLs.

Section 3 — Hardware Setup:
s3_pins (max 5): Pin table with all components, pin number/name, wire color, signal type. 5=complete; 3-4=minor errors; 1-2=significant errors; 0=absent.
s3_diagram (max 3): Wiring diagram or photo. You CANNOT see images — if document text references a diagram, image, or figure, give score=2 and note manual verification needed. Otherwise score=null. NEVER give 0 if the section text mentions any visual.

Section 4 — Key Concepts (highest weight):
s4_pwm (max 6): Explains in OWN WORDS: what PWM stands for, what duty cycle means, how it controls servo position, includes analogy or example. PENALIZE AI-sounding text with no personal voice. 6=complete, own voice, analogy; 3-5=mostly correct but incomplete or AI-sounding; 1-2=definition only, no servo connection; 0=missing.
s4_adc (max 6): Explains in OWN WORDS: what ADC does, what 0-1023 means, how potentiometer ADC values detect claw position/contact. 6=full, own voice, project connection; 3-5=mostly correct, missing pot connection or AI-sounding; 1-2=surface definition; 0=missing.
s4_additional (max 6): At least one additional concept explained accurately (e.g. control loop, threshold logic, serial communication, map(), slip detection algorithm). 6=accurate, own words; 3-5=shallow; 1-2=names without explaining; 0=none.

Section 8 — AI Conversation Log:
s8_prompts (max 5): At least 3 prompts logged covering DIFFERENT topics, matching real project work. 5=3+ varied real; 3-4=2 or 3 very similar; 1-2=1 or fabricated; 0=none.
s8_reflection (max 5): For each prompt: what AI got right, what it missed, what student did with output. At least one critical entry. 5=full reflection each entry, at least one critical; 3-4=partial reflection or all positive; 1-2=just lists prompts; 0=none.`;

  const rubricD9 = `RUBRIC — DELIVERABLE 9 FINAL BRIEF SECTIONS (25 pts):

Section 5 — Algorithm:
s5_flowchart (max 4): Flowchart or pseudocode showing main loop: open→read ADC→check contact→classify→set LED→check slip→repeat. Format may be a diagram OR a numbered/bulleted list. IMPORTANT: if the student's code (visible below) correctly implements the full control flow, a high-level description that covers all major steps in the right order earns 3/4 — do NOT penalize for omitting decision notation that is already proven correct in the code. Reserve 2/4 for descriptions that are vague, out of order, or missing major steps. 4=written algorithm itself contains explicit decision branches; 3=correct sequence of major steps with working code as evidence; 2=vague or incomplete; 1=major gaps; 0=absent.
s5_clarity (max 2): Another student could follow the algorithm without reading the code. 2=clear enough to follow; 1=understandable with effort but missing specific details; 0=unclear.

Section 6 — Annotated Code:
s6_annotations (max 5): Functions and key blocks have comments explaining WHAT and WHY in student's own words. NOT AI boilerplate. 5=most code annotated with genuine explanations, not just code restatements; 4=well annotated with a few unexplained calculation lines; 3=most functions annotated, some just restate code; 1-2=sparse; 0=none or no code.
s6_accuracy (max 3): Code is complete with no unexplained placeholders. 3=appears complete; 2=minor gaps; 1=incomplete; 0=no code or clearly not student's work.

Section 7 — Testing Results:
s7_table (max 3): Table with object test data including name, estimated size, ADC at contact, classified size, correct?. Real data (not suspiciously round numbers). 3=3+ objects with all required columns and real data; 2=3+ objects but missing 1-2 columns; 1=fewer than 3 objects or data appears fabricated; 0=absent.
s7_analysis (max 2): Reflects honestly on results and identifies at least one specific issue. 2=identifies a specific observation with either a cause or a proposed improvement (does not require both); 1=notes something went wrong but stays vague; 0=none.

Section 9 — Challenges & Solutions:
s9_challenges (max 3): At least 2 SPECIFIC challenges (not generic). Good example: "ADC readings fluctuated ±30 at rest, causing false contact triggers." 3=2+ specific; 2=1 specific + 1 vague; 1=generic only; 0=absent.
s9_solutions (max 3): For each challenge: solution tried and whether it worked. Unresolved challenges noted honestly. 3=tied to each challenge, honest; 2=present but vague/disconnected; 1=missing some; 0=none.`;

  const rubric = deliverableId === 8 ? rubricD8 : rubricD9;
  const criteriaKeys = deliverableId === 8
    ? ['s1_purpose','s1_goals','s2_completeness','s2_links','s3_pins','s3_diagram','s4_pwm','s4_adc','s4_additional','s8_prompts','s8_reflection']
    : ['s5_flowchart','s5_clarity','s6_annotations','s6_accuracy','s7_table','s7_analysis','s9_challenges','s9_solutions'];

  const prompt = `You are grading a high school robotics student's Claw Project Design Brief.

SCORING PHILOSOPHY:
Award points generously when the student demonstrates genuine effort and understanding of the concept, even if their explanation is brief or imperfectly worded. Reserve scores of 0-1 for sections that are truly absent or fundamentally misunderstood. If a student shows real engagement with a concept — even partially — award at least 60-70% of available points for that criterion. A strong, hardworking student should score in the 85-95% range overall.

FEEDBACK TONE:
Write feedback in an encouraging but specific voice — you are a supportive teacher, not a critic. Speak directly to the student using "you." Lead with what they did well in that section, then give one specific, actionable suggestion for improvement. Never use empty praise ("Great job!"). Be concrete: instead of "missing detail," say "Add a sentence explaining how duty cycle percentage maps to servo angle in degrees."

${rubric}

${urlNote}

Return ONLY a valid JSON object — no markdown fences, no explanation. Use null for scores requiring manual image verification. Feedback must be 1-2 specific sentences per criterion.

Required keys: ${criteriaKeys.join(', ')}

Example format: {"s1_purpose": {"score": 2, "max": 3, "feedback": "You clearly described what the claw does — add one sentence on why grip detection matters in real robotics applications to complete this section."}, ...}

STUDENT DOCUMENT:
${docText}`;

  const apiKey = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set in Script Properties.');

  const url = 'https://api.anthropic.com/v1/messages';
  const fetchOpts = {
    method: 'post',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    payload: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }]
    }),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, fetchOpts);
  const result = JSON.parse(response.getContentText());
  if (result.type === 'error') throw new Error('Claude: ' + result.error.message);
  if (result.stop_reason === 'max_tokens') throw new Error('Claude response was cut off (max_tokens reached at 8192). Brief may be too long.');

  const text = result.content[0].text;
  try {
    const first = text.indexOf('{');
    const last = text.lastIndexOf('}');
    if (first === -1 || last === -1) throw new Error('no JSON object found');
    return JSON.parse(text.substring(first, last + 1));
  } catch(e) {
    throw new Error('Could not parse Claude response: ' + text.substring(0, 300));
  }
}

// ============================================
// DIAGNOSTICS (run manually from editor)
// ============================================

function testDriveAccess() {
  try {
    const iter = DriveApp.getFiles();
    Logger.log('Drive scope OK. Has files: ' + iter.hasNext());
  } catch(e) {
    Logger.log('Drive scope FAILED: ' + e.message);
  }
}

function testDocAccess() {
  const docUrl = 'PASTE_DOC_URL_HERE';
  const match = docUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) { Logger.log('Bad URL'); return; }
  const docId = match[1];
  try {
    const name = DriveApp.getFileById(docId).getName();
    Logger.log('SUCCESS — file name: ' + name);
  } catch(e) {
    Logger.log('FAILED — ' + e.message);
  }
}
