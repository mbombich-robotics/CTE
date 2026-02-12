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
const BACKEND_VERSION = 'v2.9.12a';

const SHEET_NAMES = {
  STUDENTS: 'Students',
  REFLECTIONS: 'Weekly Reflections',
  DELIVERABLES: 'Deliverables',
  EVIDENCE: 'Evidence',
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
  initializeSheets();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

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

  const stateJson = JSON.stringify({
    student: data.student,
    weeklyReflections: data.weeklyReflections || {},
    deliverables: data.deliverables || {},
    codeSnippets: data.codeSnippets || [],
    viewedFeedback: data.viewedFeedback || [],
    lastSynced: data.timestamp || new Date().toISOString()
  });

  for (let i = 1; i < sheetData.length; i++) {
    if (sheetData[i][0] === email) {
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

  // Deliverable titles for Robotics class
  const titles = {
    1: 'Line Following Practical #1',
    2: 'Line Following Practical #2',
    3: 'Ultrasonic Sensor Lab Report',
    4: 'Scanner Assembly',
    5: 'Scanning Practical',
    6: 'Claw Design Document',
    7: 'Claw Control Code',
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

  const rowData = [
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
  ];

  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
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

          // Merge in teacher grades/feedback from the sheets
          const reflectionsSheet = ss.getSheetByName(SHEET_NAMES.REFLECTIONS);
          const reflectionsData = reflectionsSheet.getDataRange().getValues();

          for (let j = 1; j < reflectionsData.length; j++) {
            if (reflectionsData[j][0] === email) {
              const week = reflectionsData[j][2];
              if (fullState.weeklyReflections && fullState.weeklyReflections[week]) {
                // Grade in column L (index 11), Feedback in column M (index 12)
                fullState.weeklyReflections[week].teacherGrade = reflectionsData[j][11] || undefined;
                fullState.weeklyReflections[week].teacherFeedback = reflectionsData[j][12] || '';
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

  const students = ss.getSheetByName(SHEET_NAMES.STUDENTS).getDataRange().getValues();
  const reflections = ss.getSheetByName(SHEET_NAMES.REFLECTIONS).getDataRange().getValues();
  const deliverables = ss.getSheetByName(SHEET_NAMES.DELIVERABLES).getDataRange().getValues();
  const evidence = ss.getSheetByName(SHEET_NAMES.EVIDENCE).getDataRange().getValues();

  return {
    students: students.slice(1), // Remove header
    reflections: reflections.slice(1),
    deliverables: deliverables.slice(1),
    evidence: evidence.slice(1),
    summary: {
      totalStudents: students.length - 1,
      totalReflections: reflections.length - 1,
      totalDeliverables: deliverables.length - 1
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

      // Find the deliverable row
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === email && data[i][2] == assignmentId) {
          if (grade !== '') sheet.getRange(i + 1, 10).setValue(parseFloat(grade));
          if (feedback !== '') sheet.getRange(i + 1, 11).setValue(feedback);
          if (grade !== '' || feedback !== '') sheet.getRange(i + 1, 12).setValue(gradedAt);
          break;
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

  // Deliverable titles by ID (each corresponds to its week number)
  const deliverableTitles = {
    1: 'Line Following Practical #1',
    2: 'Line Following Final Practical',
    3: 'Ultrasonic Sensor Lab Report',
    4: 'Scanner Assembly',
    5: 'Scanning Practical',
    6: 'Claw Design Document',
    7: 'Claw Control Code',
    8: 'Claw Practical',
    9: 'Final Robot Demonstration'
  };

  data.students.forEach(student => {
    const email = student[0];
    const name = student[1];

    // Check missing reflections
    const submittedWeeks = data.reflections
      .filter(r => r[0] === email)
      .map(r => r[2]);

    const missingReflections = [];
    for (let w = 1; w <= currentWeek; w++) {
      if (!submittedWeeks.includes(w)) {
        missingReflections.push(w);
      }
    }

    // Check missing deliverables (each deliverable ID matches its due week)
    const completedDeliverables = data.deliverables
      .filter(d => d[0] === email && d[7] === 'completed')
      .map(d => d[2]);

    const missingDeliverables = [];
    for (let id = 1; id <= currentWeek && id <= 9; id++) {
      if (!completedDeliverables.includes(id)) {
        missingDeliverables.push(deliverableTitles[id] || `Deliverable ${id}`);
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
