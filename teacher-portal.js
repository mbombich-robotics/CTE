// Teacher Portal - Dashboard for viewing student portfolios
// Tracks: HS AE&R (hsaer), 8th Grade AE&R (8aer), Design & Build Lab (dbl)

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    // App version - update when deploying changes
    VERSION: 'v2.9.53',

    // Google OAuth Client ID (same as student portals)
    GOOGLE_CLIENT_ID: '1002661691088-8g0dskdehhmgc8jigbua15l3ih7td4ka.apps.googleusercontent.com',

    // Teacher email(s) - add your email here
    TEACHER_EMAILS: [
        'mbombich@vicksburgschools.org',
        // Add more teacher emails as needed
    ],

    // Course configurations
    COURSES: {
        hsaer: {
            name: 'HS Applied Engineering & Robotics',
            apiUrl: 'https://script.google.com/macros/s/AKfycbxKkugJxRzBOUzSF52btnOa8PmE_B87Fi0vJSA8s-L179KWlA71jUgUhjdUMzNomRgE/exec',
            currentAppVersion: 'v2.14.35',
            hasTeams: false,
            totalDeliverables: 10,
            totalPoints: 755,
            deliverablePoints: { 0: 20, 10: 10, 1: 50, 2: 75, 3: 40, 4: 50, 5: 75, 6: 50, 7: 50, 8: 50, 9: 75 },
            deliverableWeeks: { 8: 10, 9: 11 },
            quizzes: [
                { id: 'claw',       name: 'Claw Quiz',  questionCount: 7,  maxPoints: 28 },
                { id: 'final_exam', name: 'Final Exam', questionCount: 41, maxPoints: 41 }
            ]
        },
        '8aer': {
            name: '8th Grade Applied Engineering & Robotics',
            apiUrl: 'https://script.google.com/macros/s/AKfycbz9JkbfmqlgDdcpCBSIiEifnTu6HK1Q1-KJi0KYdB16u-UnLVZZdxeDPqeHQErrvE-y/exec',
            currentAppVersion: 'v2.14.35',
            hasTeams: false,
            totalDeliverables: 10,   // TODO: trim when 8th grade pacing is finalized
            totalPoints: 755,        // TODO: update when pacing is finalized
            deliverablePoints: { 0: 20, 10: 10, 1: 50, 2: 75, 3: 40, 4: 50, 5: 75, 6: 50, 7: 50, 8: 50, 9: 75 },
            deliverableWeeks: { 8: 10, 9: 11 },
            quizzes: [
                { id: 'claw',       name: 'Claw Quiz',  questionCount: 7,  maxPoints: 28 },
                { id: 'final_exam', name: 'Final Exam', questionCount: 41, maxPoints: 41 }
            ]
        },
        dbl: {
            name: 'Design & Build Lab',
            apiUrl: 'https://script.google.com/macros/s/AKfycbxdoDufO0qoot1SekT6O8l8pPCCQLcOY49vxnb0SnNqd4ebtrRYgOyb-LLmk0-Tj-BCfw/exec',
            currentAppVersion: 'v2.14.35',
            hasTeams: false,
            totalDeliverables: 7,    // TODO: update when D&B Lab deliverables are defined
            totalPoints: 0,          // TODO: update when D&B Lab grading is defined
            deliverablePoints: { 10: 10 },
            deliverableWeeks: {},
            quizzes: []
        }
    },

    // Semester start date
    SEMESTER_START: new Date('2026-08-31'),

    // Shared secret for writing config to the backend (must match TEACHER_TOKEN in both Apps Scripts)
    TEACHER_TOKEN: 'rp-portal-teach-2026'
};

// ============================================
// TRACK DELIVERABLES
// ============================================
const TRACK_DELIVERABLES = {
    // ── HS AE&R ─────────────────────────────────────────────────────────
    hsaer: [
        { id:  0, label: 'D0  — Career Ready Practices',               week: null },
        { id: 10, label: 'D10 — Signed Syllabus & Safety Contract',    week: 1  },
        { id: 11, label: 'D11 — Design Brief',                         week: 1  },
        // Unit 2: Component deliverables (Google Doc template)
        { id: 21, label: 'D21 — C1: Wheel Hub',                        week: 3  },
        { id: 22, label: 'D22 — C2: Wheel Hub Cap',                    week: 4  },
        { id: 23, label: 'D23 — C3: Motor Sleeve Mount',               week: 4  },
        { id: 25, label: 'D25 — C5: Omni Wheel Mount',                 week: 6  },
        { id: 26, label: 'D26 — C6: IR Sensor Mount',                  week: 7  },
        { id: 27, label: 'D27 — C7: Ultrasonic Sensor Mount',          week: 7  },
        { id: 24, label: 'D24 — C4: Robot Deck (Final)',                week: 8  },
        // Unit 3
        { id: 31, label: 'D31 — Tool Safety Certifications',           week: 10 },
        // Unit 4: Programming & sensors
        { id: 41, label: 'D4.1 — Programming Basics: Lessons 4.1–4.3', week: 13 },
        { id: 42, label: 'D4.2 — Programming Basics: Lessons 4.4–4.6', week: 15 },
        { id: 43, label: 'D4.3 — IMU Navigation',                      week: 18 },
        { id: 44, label: 'D4.4 — Ultrasonic: Obstacle & Wall Following', week: 21 },
        { id: 52, label: 'D4.5 — Line Following Practical',             week: 23 },
        // Unit 5: AI & ML
        { id: 54, label: 'D5.1 — Teachable Machine Project',           week: 24 },
        // Unit 7: Electrical Systems
        { id: 71, label: 'D7.1 — Multimeter Lab',                      week: 25 },
        { id: 72, label: 'D7.2 — LED Circuit: Schematic + Build + Calculations', week: 26 },
        // Unit 8: Mechanisms
        { id: 86, label: 'D8.1 — Simple Machines + Pulleys: IMA Calculations', week: 28 },
        { id: 87, label: 'D8.2 — Tug of War: Design + Results + Reflection',   week: 29 },
        { id: 88, label: 'D8.3 — Fix Fran\'s Farm: Problem + Pitch',           week: 30 },
        // Unit 8: Servo Build
        { id: 55, label: 'D8.4 — Servo Design Brief',                  week: 31 },
        { id: 53, label: 'D8.5 — Servo Mechanism Project',             week: 33 },
        // Unit 9: Capstone
        { id: 91, label: 'D9.1 — Capstone Design Brief',               week: 34 },
        { id: 92, label: 'D9.2 — Capstone Progress Check',             week: 36 },
        { id: 93, label: 'D9.3 — Capstone Presentation + Final Portfolio', week: 37 },
    ],
    // ── 8th Grade AE&R ──────────────────────────────────────────────────
    '8aer': [
        { id:  0, label: 'D0  — Career Ready Practices',          week: null },
        { id: 10, label: 'D10 — Signed Syllabus & Safety Contract', week: 1  },
        { id: 11, label: 'D11 — Design Brief',                     week: 2  },
        // Unit 2: Component deliverables
        { id: 21, label: 'D21 — C1: Wheel Hub',                    week: 3  },
        { id: 22, label: 'D22 — C2: Wheel Hub Cap',                 week: 4  },
        { id: 89, label: 'D2.3 — Robot Assembly',                  week: 5  },
        // Unit 3: Safety
        { id: 31, label: 'D3.1 — Tool Safety Certifications',      week: 6  },
        // Unit 4: Programming
        { id: 90, label: 'D4.1 — Blink (A4.1)',                   week: 9  },
        { id: 94, label: 'D4.2 — SOS with Functions',              week: 10 },
        { id: 95, label: 'D4.3 — Robot Drives a Square',           week: 11 },
        { id: 96, label: 'D4.4 — Robot Driving Challenge',         week: 12 },
        // Unit 8: Mechanisms (weeks 14–18)
        { id: 81, label: 'D81 — Gear Ratio Calculation Sheet',     week: 14 },
        { id: 82, label: 'D82 — Mechanism CAD Housing + Reflection', week: 15 },
        { id: 83, label: 'D83 — Holiday 3D Print',                 week: 16 },
        { id: 84, label: 'D84 — Pulley System — Ratio & CAD',      week: 17 },
        { id: 85, label: 'D85 — Mechanism Showcase — Portfolio Evidence', week: 18 },
    ],
    // ── Design & Build Lab ───────────────────────────────────────────────
    dbl: [
        { id:  10, label: 'D1.0 — Signed Syllabus & Safety Contract',     week: 1  },
        { id:  11, label: 'D1.1 — Design Brief',                           week: 2  },
        // Unit 2: CAD — Fidget Spinner (P1)
        { id: 421, label: 'D2.1 — C1: Bearing Model + Key Dimensions',    week: 3  },
        { id: 422, label: 'D2.2 — Spinner Body CAD File',                  week: 4  },
        { id: 423, label: 'D2.3 — Spinner Assembly',                       week: 5  },
        { id: 431, label: 'D3.1 — Tool Cert Card',                         week: 6  },
        { id: 424, label: 'D2.4 — Completed Spinner + Portfolio Photo',    week: 8  },
        // Unit 7: Electrical Systems
        { id: 471, label: 'D7.1 — Unit 7 Lab Results',                     week: 11 },
        // Project 2: Christmas Ornament / Gift
        { id: 482, label: 'P2.1 — Design Brief + LED Model Screenshot',    week: 12 },
        { id: 483, label: 'P2.2 — F360 Model + Bambu Studio Screenshot',  week: 14 },
        { id: 484, label: 'P2.3 — Completed Ornament + S1 Portfolio',      week: 16 },
        // Project 3: LED Sign / Wall Art
        { id: 491, label: 'P3.1 — P3 Design Brief',                        week: 17 },
        { id: 492, label: 'P3.2 — Design File Approved',                   week: 18 },
        { id: 493, label: 'P3.3 — Wired LED Strip Demo',                   week: 20 },
        { id: 494, label: 'P3.4 — Completed Sign + Portfolio Photo',       week: 21 },
        // Project 4: Silicone Mold Making
        { id: 501, label: 'P4.1 — Design Brief + Partner Review',          week: 22 },
        { id: 502, label: 'P4.2 — F360 Model + Cavity Volume Screenshot',  week: 23 },
        { id: 503, label: 'P4.3 — Mold + Cast Product + Reflection',       week: 25 },
        // Unit 8: Mechanisms
        { id: 481, label: 'D8.1 — Fix Fran\'s Farm',                       week: 29 },
        // Project 5: Useless Box
        { id: 511, label: 'P5.1 — Design Brief + Concept Sketch',          week: 30 },
        { id: 512, label: 'P5.2 — CAD Files Approved',                     week: 31 },
        { id: 513, label: 'P5.3 — Working Useless Box + Portfolio Photo',  week: 32 },
        // Project 6: Capstone
        { id: 521, label: 'P6.1 — Project Idea Pitch',                     week: 33 },
        { id: 522, label: 'P6.2 — Design Brief + CAD Approved',            week: 34 },
        { id: 523, label: 'P6.3 — Progress Check',                         week: 35 },
        { id: 524, label: 'P6.4 — Capstone Complete',                      week: 36 },
        { id: 525, label: 'P6.5 — Capstone Presentation + Final Portfolio', week: 37 },
    ],
};

// ============================================
// GRADING RUBRICS
// ============================================
const RUBRICS = {
    hsaer: {
        4: {
            categories: [
                { name: 'Customized CAD Model', points: 20 },
                { name: 'CAD Assembly Screenshot', points: 15 },
                { name: 'Sweep Code', points: 15 }
            ]
        }
    },
    frc: {
        4: {
            categories: [
                { name: 'Pugh Matrix', points: 25 },
                { name: 'Justification', points: 15 },
                { name: 'Personal Contribution', points: 10 }
            ]
        }
    }
};

// Criteria definitions for Design Brief AI grading
const BRIEF_CRITERIA = {
    0: [
        { id: 'cr_career',    label: 'Career Interest & Class Connection', max: 4 },
        { id: 'cr_education', label: 'Education / Training Path',          max: 4 },
        { id: 'cr_financial', label: 'Financial Literacy',                 max: 4 },
        { id: 'cr_goal',      label: 'Financial Goal Specificity',         max: 4 },
        { id: 'cr_skills',    label: 'Career Ready Skills',                max: 4 },
    ],
    8: [
        { id: 's1_purpose',      label: 'S1 — Purpose & Context',    max: 3 },
        { id: 's1_goals',        label: 'S1 — Learning Goals',        max: 3 },
        { id: 's2_completeness', label: 'S2 — BOM Completeness',      max: 4 },
        { id: 's2_links',        label: 'S2 — Datasheet Links',       max: 4 },
        { id: 's3_pins',         label: 'S3 — Pin Table',             max: 5 },
        { id: 's3_diagram',      label: 'S3 — Diagram / Photo',       max: 3 },
        { id: 's4_pwm',          label: 'S4 — PWM Explanation',       max: 6 },
        { id: 's4_adc',          label: 'S4 — ADC Explanation',       max: 6 },
        { id: 's4_additional',   label: 'S4 — Additional Concept',    max: 6 },
        { id: 's8_prompts',      label: 'S8 — AI Log: Prompts',       max: 5 },
        { id: 's8_reflection',   label: 'S8 — AI Log: Reflection',    max: 5 },
    ],
    9: [
        { id: 's5_flowchart',    label: 'S5 — Flowchart/Pseudocode',  max: 4 },
        { id: 's5_clarity',      label: 'S5 — Clarity',               max: 2 },
        { id: 's6_annotations',  label: 'S6 — Annotation Quality',    max: 5 },
        { id: 's6_accuracy',     label: 'S6 — Code Accuracy',         max: 3 },
        { id: 's7_table',        label: 'S7 — Testing Data Table',    max: 3 },
        { id: 's7_analysis',     label: 'S7 — Analysis',              max: 2 },
        { id: 's9_challenges',   label: 'S9 — Challenges',            max: 3 },
        { id: 's9_solutions',    label: 'S9 — Solutions',             max: 3 },
    ]
};

function renderGradeSection(courseKey, deliverableId, maxPoints, existingGrade, existingFeedback, email) {
    const rubric = RUBRICS[courseKey]?.[deliverableId];
    const gradeInputHtml = `
        <input type="number" class="grade-input" data-type="deliverable" data-id="${deliverableId}" data-email="${email}"
               value="${existingGrade}" min="0" max="${maxPoints}" step="1"
               style="width: 60px; padding: 4px 8px; border: 1px solid var(--gray-300); border-radius: 4px;">
        <span style="color: var(--gray-500); font-size: 12px;">/ ${maxPoints} pts</span>`;

    const feedbackHtml = `
        <textarea class="feedback-input" data-type="deliverable" data-id="${deliverableId}" data-email="${email}"
                  placeholder="Feedback for student..."
                  style="width: 100%; padding: 8px; border: 1px solid var(--gray-300); border-radius: 4px; font-size: 13px; resize: vertical; min-height: 60px;">${existingFeedback}</textarea>`;

    if (!rubric) {
        return `
            <div class="grade-section" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--gray-200);">
                <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 8px;">
                    <label style="font-size: 13px; font-weight: 500;">Grade:</label>
                    ${gradeInputHtml}
                </div>
                ${feedbackHtml}
            </div>`;
    }

    const uid = `rubric-${courseKey}-${deliverableId}-${email.replace(/[^a-z0-9]/gi, '')}`;
    const categoryRows = rubric.categories.map((cat, i) => `
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="flex: 1; font-size: 13px;">${cat.name}</span>
            <input type="number" class="rubric-cat-input" data-uid="${uid}" min="0" max="${cat.points}" step="1"
                   placeholder="—"
                   style="width: 50px; padding: 3px 6px; border: 1px solid var(--gray-300); border-radius: 4px; text-align: center; font-size: 13px;"
                   oninput="tallyRubric('${uid}', ${deliverableId}, '${email}')">
            <span style="font-size: 12px; color: var(--gray-500); width: 45px;">/ ${cat.points}</span>
        </div>
    `).join('');

    return `
        <div class="grade-section" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--gray-200);">
            <div style="margin-bottom: 10px;">
                <div style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: var(--gray-600);">Rubric Worksheet:</div>
                ${categoryRows}
                <div style="display: flex; align-items: center; gap: 8px; padding-top: 8px; border-top: 1px solid var(--gray-200); margin-top: 4px;">
                    <span style="flex: 1; font-size: 13px; font-weight: 600;">Total</span>
                    ${gradeInputHtml}
                </div>
            </div>
            ${feedbackHtml}
        </div>`;
}

function tallyRubric(uid, deliverableId, email) {
    const inputs = document.querySelectorAll(`.rubric-cat-input[data-uid="${uid}"]`);
    let total = 0;
    inputs.forEach(inp => { total += parseInt(inp.value) || 0; });
    const gradeInput = document.querySelector(`.grade-input[data-type="deliverable"][data-id="${deliverableId}"][data-email="${email}"]`);
    if (gradeInput) gradeInput.value = total;
}

// ============================================
// WEEK SETTINGS (localStorage)
// ============================================
let weekSettings = {
    hsaer: { skipDeliverables: [], quizEnabled: false, quizKey: 'claw', deliverableDueDates: {} },
    '8aer':     { skipDeliverables: [], quizEnabled: false, quizKey: 'claw', deliverableDueDates: {} },
    dbl:      { skipDeliverables: [], deliverableDueDates: {} },
    currentWeekOverride: null
};

function loadWeekSettings() {
    try {
        const saved = localStorage.getItem('teacherPortalWeekSettings');
        if (saved) {
            const parsed = JSON.parse(saved);
            weekSettings = { ...weekSettings, ...parsed };
            weekSettings.hsaer = { skipDeliverables: [], quizEnabled: false, quizKey: 'claw', deliverableDueDates: {}, ...parsed.hsaer };
            weekSettings['8aer']     = { skipDeliverables: [], quizEnabled: false, quizKey: 'claw', deliverableDueDates: {}, ...parsed['8aer'] };
            weekSettings.dbl      = { skipDeliverables: [], deliverableDueDates: {}, ...parsed.dbl };
        }
    } catch(e) {}
}

function saveWeekSettings() {
    localStorage.setItem('teacherPortalWeekSettings', JSON.stringify(weekSettings));
}

function isDeliverableRequired(courseId, deliverableId) {
    return !(weekSettings[courseId]?.skipDeliverables || []).includes(deliverableId);
}

// Returns the deliverable record due in a given week for a course (or null)
function deliverableForWeek(courseId, week) {
    return (TRACK_DELIVERABLES[courseId] || []).find(d => d.week === week) ?? null;
}

// ============================================
// APPLICATION STATE
// ============================================
let state = {
    teacherEmail: null,
    activeCourse: 'hsaer',
    rawData: null,        // Raw data from API
    students: [],         // Processed student list
    filters: {
        period: 'all',
        team: 'all',
        search: ''
    },
    currentWeek: 1
};

// ============================================
// INITIALIZATION
// ============================================
window.onload = function() {
    try {
        // Display app version (header and sign-in screen)
        const versionEl = document.getElementById('appVersion');
        if (versionEl) versionEl.textContent = CONFIG.VERSION;
        const signinVersionEl = document.getElementById('signinVersion');
        if (signinVersionEl) signinVersionEl.textContent = CONFIG.VERSION;

        loadWeekSettings();
        calculateCurrentWeek();
        initEventListeners();

        // Wait for Google Identity Services to load
        console.log('Teacher Portal: Waiting for Google Sign-In...');
        waitForGoogleSignIn();
    } catch (error) {
        console.error('Teacher Portal initialization error:', error);
    }
};

let googleRetryCount = 0;
const MAX_GOOGLE_RETRIES = 50; // 5 seconds max

function waitForGoogleSignIn() {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        console.log('Teacher Portal: Google loaded, initializing sign-in...');
        initGoogleSignIn();
    } else if (googleRetryCount < MAX_GOOGLE_RETRIES) {
        googleRetryCount++;
        if (googleRetryCount % 10 === 0) {
            console.log('Teacher Portal: Still waiting for Google... attempt', googleRetryCount);
        }
        setTimeout(waitForGoogleSignIn, 100);
    } else {
        // Show error message after timeout
        console.error('Google Identity Services failed to load after 5 seconds');
        console.log('google object:', typeof google, google);
        const signInBtn = document.getElementById('googleSignInBtn');
        if (signInBtn) {
            signInBtn.innerHTML = `
                <div style="color: #ef4444; text-align: center; padding: 20px;">
                    <i class="fas fa-exclamation-circle"></i><br>
                    Google Sign-In failed to load.<br>
                    <small style="color: #6b7280;">Check if ad blocker is enabled</small><br>
                    <button onclick="location.reload()" style="margin-top: 12px; padding: 8px 16px; cursor: pointer; border: 1px solid #ddd; border-radius: 4px; background: white;">
                        Retry
                    </button>
                </div>
            `;
        }
    }
}

function calculateCurrentWeek() {
    const now = new Date();
    const diffTime = now - CONFIG.SEMESTER_START;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7) + 1;
    state.currentWeek = Math.min(Math.max(1, diffWeeks), 38);
    if (weekSettings.currentWeekOverride !== null) {
        state.currentWeek = weekSettings.currentWeekOverride;
    }
}

function initGoogleSignIn() {
    google.accounts.id.initialize({
        client_id: CONFIG.GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById('googleSignInBtn'),
        { theme: 'outline', size: 'large', width: 280, text: 'signin_with' }
    );
}

function initEventListeners() {
    // Course tabs
    document.querySelectorAll('.course-tab').forEach(tab => {
        tab.addEventListener('click', () => switchCourse(tab.dataset.course));
    });

    // Filters
    document.getElementById('periodFilter').addEventListener('change', applyFilters);
    document.getElementById('teamFilter').addEventListener('change', applyFilters);
    document.getElementById('searchInput').addEventListener('input', debounce(applyFilters, 300));

    // Export
    document.getElementById('exportBtn').addEventListener('click', exportCSV);

    // Modal
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('studentModal').addEventListener('click', (e) => {
        if (e.target.id === 'studentModal') closeModal();
    });

    // Detail tabs
    document.querySelectorAll('.detail-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.detail-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.panel + 'Panel').classList.add('active');
        });
    });

    // Sign out
    document.getElementById('signOutBtn').addEventListener('click', signOut);

    // Leaderboard
    document.getElementById('leaderboardBtn').addEventListener('click', openLeaderboard);
    document.getElementById('leaderboardModal').addEventListener('click', (e) => {
        if (e.target.id === 'leaderboardModal') closeLeaderboard();
    });

    // Grade entry
    initGradeEntry();
}

// ============================================
// AUTHENTICATION
// ============================================
function handleCredentialResponse(response) {
    const payload = decodeJwtPayload(response.credential);
    const email = payload.email;

    if (!isTeacher(email)) {
        document.getElementById('accessDenied').style.display = 'block';
        return;
    }

    state.teacherEmail = email;
    document.getElementById('teacherEmail').textContent = email;
    document.getElementById('signOutBtn').style.display = 'inline-flex';
    document.getElementById('signinModal').classList.add('hidden');

    loadCourseData();
}

function decodeJwtPayload(token) {
    const base64 = token.split('.')[1];
    const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join('')
    );
    return JSON.parse(jsonPayload);
}

function isTeacher(email) {
    return CONFIG.TEACHER_EMAILS.some(te =>
        te.toLowerCase() === email.toLowerCase()
    );
}

function signOut() {
    google.accounts.id.revoke(state.teacherEmail, () => {
        state.teacherEmail = null;
        state.rawData = null;
        state.students = [];
        document.getElementById('signinModal').classList.remove('hidden');
        document.getElementById('signOutBtn').style.display = 'none';
        document.getElementById('accessDenied').style.display = 'none';
    });
}

// ============================================
// COURSE SWITCHING
// ============================================
function switchCourse(courseId) {
    state.activeCourse = courseId;
    state.rawData = null;
    state.students = [];

    // Update tabs
    document.querySelectorAll('.course-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.course === courseId);
    });

    // Show/hide team filter
    const course = CONFIG.COURSES[courseId];
    document.getElementById('teamFilterContainer').style.display = course.hasTeams ? 'flex' : 'none';
    document.getElementById('teamHeader').style.display = course.hasTeams ? '' : 'none';

    // Reset filters
    state.filters = { period: 'all', team: 'all', search: '' };
    document.getElementById('periodFilter').value = 'all';
    document.getElementById('teamFilter').value = 'all';
    document.getElementById('searchInput').value = '';

    loadCourseData();
}

// ============================================
// DATA LOADING
// ============================================
async function loadCourseData() {
    const course = CONFIG.COURSES[state.activeCourse];
    const tbody = document.getElementById('studentTableBody');

    tbody.innerHTML = `
        <tr>
            <td colspan="8" class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading ${course.name} data...</p>
            </td>
        </tr>
    `;

    try {
        const response = await fetch(course.apiUrl + '?action=all&_t=' + Date.now());
        state.rawData = await response.json();
        processStudentData();
        applyFilters();
    } catch (error) {
        console.error('Failed to load data:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Failed to load data. Please try again.</p>
                </td>
            </tr>
        `;
    }
}

function processStudentData() {
    if (!state.rawData || !state.rawData.students) {
        state.students = [];
        return;
    }

    const course = CONFIG.COURSES[state.activeCourse];

    state.students = state.rawData.students.map(row => {
        const email = row[0];
        const name = row[1];
        const team = row[2] || '';
        const period = row[3] || '';
        const fullStateJson = row[8];

        // Try to parse full state JSON for draft data
        let fullState = null;
        if (fullStateJson) {
            try {
                fullState = JSON.parse(fullStateJson);
            } catch (e) {
                // JSON parse failed
            }
        }

        // Merge evidence from Evidence sheet (not stored in fullState JSON due to size)
        if (state.rawData.evidence) {
            const studentEvidence = state.rawData.evidence
                .filter(e => e[0] === email)
                .map(e => ({
                    week: e[2],
                    filename: e[3],
                    uploadedAt: e[4],
                    data: e[5] || '',
                    driveId: e[6] || '',
                    thumbnailLink: e[7] || '',
                    webViewLink: e[8] || ''
                }));
            if (!fullState) fullState = {};
            fullState.evidence = studentEvidence;
        }

        // Count deliverables
        let completedDeliverables = 0;
        let draftDeliverables = 0;
        let ungradedDeliverables = 0;

        if (state.rawData.deliverables) {
            const studentDeliverables = state.rawData.deliverables.filter(
                d => d[0] === email && d[7] === 'completed'
            );
            // Deduplicate by deliverable id, preferring graded rows
            const seen = {};
            studentDeliverables.forEach(d => {
                const id = d[2];
                if (!seen[id] || (d[9] !== '' && d[9] !== null && d[9] !== undefined)) seen[id] = d;
            });
            const deduped = Object.values(seen);
            completedDeliverables = deduped.length;
            // Count ungraded (column J = index 9 is Grade)
            ungradedDeliverables = deduped.filter(d => !d[9] && d[9] !== 0).length;
        }

        if (fullState && fullState.deliverables) {
            Object.entries(fullState.deliverables).forEach(([dId, d]) => {
                if (d.status === 'in-progress' && d.content) {
                    draftDeliverables++;
                } else if (d.status === 'completed' && d.content) {
                    // Check if this completed deliverable is missing from the sheet
                    const inSheet = state.rawData.deliverables?.some(
                        row => row[0] === email && row[2] == dId && row[7] === 'completed'
                    );
                    if (!inSheet) {
                        completedDeliverables++;
                        ungradedDeliverables++;
                    }
                }
            });
        }

        // Calculate points using actual grades when available
        let points = 0;
        if (state.rawData.deliverables) {
            state.rawData.deliverables
                .filter(d => d[0] === email && d[7] === 'completed')
                .forEach(d => {
                    const id = d[2];
                    // Use teacher grade (column J = index 9) if available, otherwise default points
                    const grade = d[9];
                    const defaultPoints = course.deliverablePoints[id] || 0;
                    points += (grade !== '' && grade !== undefined && grade !== null) ? Number(grade) : defaultPoints;
                });
        }

        // Determine status - count deliverables expected past their Friday 3pm deadline
        let expectedDeliverables = 0;
        for (let week = 1; week <= state.currentWeek; week++) {
            const weekStart = new Date(CONFIG.SEMESTER_START);
            weekStart.setDate(weekStart.getDate() + (week - 1) * 7);
            const fridayDeadline = new Date(weekStart);
            fridayDeadline.setDate(fridayDeadline.getDate() + 4);
            fridayDeadline.setHours(15, 0, 0, 0);

            if (new Date() > fridayDeadline) {
                const dueDeliverable = deliverableForWeek(state.activeCourse, week);
                if (dueDeliverable !== null && isDeliverableRequired(state.activeCourse, dueDeliverable.id)) {
                    expectedDeliverables++;
                }
            }
        }
        const deliverablesBehind = expectedDeliverables - completedDeliverables;
        const totalBehind = deliverablesBehind;

        let status = 'on-track';
        if (totalBehind >= 4) status = 'very-behind';
        else if (totalBehind >= 1) status = 'behind';

        const progress = course.totalPoints > 0 ? Math.round((points / course.totalPoints) * 100) : 0;

        return {
            email,
            name,
            team,
            period,
            completedDeliverables,
            draftDeliverables,
            ungradedDeliverables,
            ungradedTotal: ungradedDeliverables,
            points,
            progress,
            status,
            fullState
        };
    });

    // Sort by last name at the source so every render path inherits the order
    state.students.sort((a, b) => {
        const aLast = a.name.split(' ').pop() || a.name;
        const bLast = b.name.split(' ').pop() || b.name;
        return aLast.localeCompare(bLast);
    });
}

// ============================================
// FILTERING & RENDERING
// ============================================
function applyFilters() {
    state.filters.period = document.getElementById('periodFilter').value;
    state.filters.team = document.getElementById('teamFilter').value;
    state.filters.search = document.getElementById('searchInput').value.toLowerCase();

    const filtered = state.students.filter(s => {
        if (state.filters.period !== 'all' && s.period !== state.filters.period) return false;
        if (state.filters.team !== 'all' && s.team !== state.filters.team) return false;
        if (state.filters.search &&
            !s.name.toLowerCase().includes(state.filters.search) &&
            !s.email.toLowerCase().includes(state.filters.search)) return false;
        return true;
    });

    renderStudentTable(filtered);
    updateStats(filtered);
}

function renderStudentTable(students) {
    const tbody = document.getElementById('studentTableBody');
    const course = CONFIG.COURSES[state.activeCourse];

    if (students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>No students found matching your filters.</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = students.map(s => `
        <tr data-email="${s.email}">
            <td>
                <div class="student-name">
                    <div class="avatar">${getInitials(s.name)}</div>
                    ${s.name}
                </div>
            </td>
            <td>${formatPeriod(s.period)}</td>
            ${course.hasTeams ? `<td>${formatTeam(s.team)}</td>` : ''}
            <td>
                ${s.completedDeliverables}/${course.totalDeliverables}
                ${s.draftDeliverables > 0 ? `<span style="color: var(--warning); font-size: 12px;"> (+${s.draftDeliverables} draft)</span>` : ''}
            </td>
            <td>${s.points}</td>
            <td>
                <div class="progress-cell">
                    <div class="mini-progress">
                        <div class="mini-progress-fill" style="width: ${s.progress}%"></div>
                    </div>
                    <span>${s.progress}%</span>
                </div>
            </td>
            <td>
                <span class="status-badge status-${s.status}">${formatStatus(s.status)}</span>
                ${s.ungradedTotal > 0 ? `<span class="status-badge" style="background: #fef3c7; color: #92400e; margin-left: 4px;" title="${s.ungradedDeliverables} deliverable(s) need grading"><i class="fas fa-pen"></i> ${s.ungradedTotal}</span>` : ''}
                <button class="repair-btn" data-email="${s.email}" title="Repair student data (use if student's work isn't loading)" style="margin-left:6px;padding:2px 6px;border:1px solid #d1d5db;border-radius:4px;background:#fff;color:#6b7280;font-size:11px;cursor:pointer;vertical-align:middle;"><i class="fas fa-wrench"></i></button>
            </td>
        </tr>
    `).join('');

    // Add click handlers
    tbody.querySelectorAll('tr').forEach(row => {
        row.addEventListener('click', () => openStudentDetail(row.dataset.email));
    });

    // Repair buttons — stop propagation so the row click doesn't open student detail
    tbody.querySelectorAll('.repair-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            try {
                if (!confirm(`Repair portfolio for ${btn.dataset.email}?\n\nThis clears their cached state and rebuilds it from the individual sheet rows. Use this only if their portfolio won't load.`)) return;
                repairStudentData(btn.dataset.email);
            } catch (err) {
                console.error('Repair click handler threw:', err);
                showToast('Repair handler error: ' + err.message, 'error', 6000);
            }
        });
    });
}

function updateStats(students) {
    const course = CONFIG.COURSES[state.activeCourse];

    document.getElementById('totalStudents').textContent = students.length;

    // Students on track (no missing deliverables)
    const onTrack = students.filter(s => s.status === 'on-track').length;
    document.getElementById('submittedThisWeek').textContent = onTrack;

    // Students behind
    const behind = students.filter(s => s.status !== 'on-track').length;
    document.getElementById('studentsBehind').textContent = behind;

    // Average progress
    const avgProgress = students.length > 0
        ? Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length)
        : 0;
    document.getElementById('avgProgress').textContent = avgProgress + '%';
}

// ============================================
// STUDENT DETAIL MODAL
// ============================================
async function repairStudentData(email) {
    if (!email) {
        showToast('Repair: missing email', 'error', 5000);
        return;
    }

    // Look up student name from current state — but don't fail if the list isn't loaded
    const student = (state.students || []).find(s => s.email === email);
    const name = student ? student.name : email;

    // Resolve the backend URL safely — surface a clear toast if something is off
    const courseCfg = CONFIG.COURSES?.[state.activeCourse];
    if (!courseCfg || !courseCfg.apiUrl) {
        showToast(`Repair: no API URL configured for course "${state.activeCourse}"`, 'error', 6000);
        return;
    }
    const apiUrl = courseCfg.apiUrl;

    const btn = document.querySelector(`.repair-btn[data-email="${CSS.escape(email)}"]`);
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }
    showToast(`Repairing ${name}…`, 'info', 3000);

    try {
        const res = await fetch(`${apiUrl}?action=repair&email=${encodeURIComponent(email)}`);
        if (!res.ok) {
            showToast(`Repair HTTP ${res.status} ${res.statusText}`, 'error', 6000);
            return;
        }
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); }
        catch (e) {
            showToast(`Repair: backend returned non-JSON (${text.slice(0,80)}…)`, 'error', 7000);
            return;
        }

        if (data.success) {
            const r = data.recovered || {};
            showToast(`Repaired ${name}: recovered ${r.deliverables ?? '?'} deliverable(s), ${r.evidence ?? '?'} photo(s). Ask them to refresh.`, 'success', 7000);
        } else {
            showToast(`Repair failed for ${name}: ${data.error || 'unknown error'}`, 'error', 6000);
        }
    } catch (err) {
        console.error('repairStudentData fetch threw:', err);
        showToast(`Repair request failed: ${err.message || err}`, 'error', 5000);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-wrench"></i>';
        }
    }
}

// Teacher-facing: record a URL for a deliverable a student submitted via email.
// Creates (or updates) a Deliverables row in the active course's backend, then
// reloads course data and reopens the student detail modal so the new card
// renders normally with the grading UI.
async function recordDeliverableUrl(email, deliverableId, url) {
    url = (url || '').trim();
    if (!url) {
        showToast('Please paste a URL before saving.', 'error', 4000);
        return;
    }
    const course = CONFIG.COURSES?.[state.activeCourse];
    if (!course || !course.apiUrl) {
        showToast(`Record URL: no API URL for course "${state.activeCourse}"`, 'error', 6000);
        return;
    }

    showToast('Saving email submission…', 'info', 2500);

    try {
        const res = await fetch(course.apiUrl, {
            method: 'POST',
            body: JSON.stringify({
                action: 'recordDeliverableUrl',
                token: CONFIG.TEACHER_TOKEN,
                email,
                deliverableId,
                url
            })
        });
        const data = await res.json();
        if (!data.success) {
            showToast('Save failed: ' + (data.error || 'unknown error'), 'error', 6000);
            return;
        }
        showToast('Recorded — refreshing…', 'success', 2500);
        await loadCourseData();
        openStudentDetail(email);
    } catch (err) {
        console.error('recordDeliverableUrl threw:', err);
        showToast('Save error: ' + (err.message || err), 'error', 5000);
    }
}

function openStudentDetail(email) {
    const student = state.students.find(s => s.email === email);
    if (!student) return;

    const course = CONFIG.COURSES[state.activeCourse];

    // Header
    document.getElementById('modalStudentName').textContent = student.name;
    document.getElementById('modalStudentNameLarge').textContent = student.name;
    document.getElementById('modalAvatar').textContent = getInitials(student.name);

    let info = `Period: ${formatPeriod(student.period)}`;
    if (course.hasTeams) info += ` | Team: ${formatTeam(student.team)}`;
    document.getElementById('modalStudentInfo').textContent = info;

    document.getElementById('modalDeliverables').textContent = student.completedDeliverables;
    document.getElementById('modalPoints').textContent = student.points;

    // Deliverables panel
    const deliverablesPanel = document.getElementById('deliverablesPanel');
    deliverablesPanel.innerHTML = '';

    for (const del of (TRACK_DELIVERABLES[state.activeCourse] || [])) {
        const id = del.id;
        const delLabel = del.label;
        const submitted = state.rawData.deliverables?.find(d => d[0] === email && d[2] == id);
        const draft = student.fullState?.deliverables?.[id];

        if (submitted && submitted[7] === 'completed') {
            const existingGrade = draft?.teacherGrade ?? submitted[9] ?? '';
            const existingFeedback = draft?.teacherFeedback ?? submitted[10] ?? '';
            const gradedAt = submitted[11] || '';
            const submittedAt = submitted[8] || '';
            const maxPoints = course.deliverablePoints?.[id] || 50;
            const isUngraded = existingGrade === '' || existingGrade === null || existingGrade === undefined;
            const isResubmitted = !isUngraded && gradedAt && submittedAt && new Date(submittedAt) > new Date(gradedAt);
            const contentId = `deliverable-content-${id}`;
            const content = submitted[4] || '';
            const selfAssessmentText = submitted[6] !== '' && submitted[6] !== null && submitted[6] !== undefined ? `<br><br><strong>Self-Assessment:</strong> ${submitted[6]}/10` : '';
            const linksText = submitted[5] ? `<br><br><strong>Links:</strong> ${submitted[5]}` : '';
            const hasStructured = draft && (draft.criteria || draft.wiring || draft.photos?.length);
            const structuredHtml = hasStructured ? renderStructuredContent(draft, content) : '';
            const fullContent = hasStructured ? structuredHtml + selfAssessmentText + linksText : `<div style="white-space: pre-wrap;">${content}</div>` + selfAssessmentText + linksText;
            const needsExpand = hasStructured || content.length > 300;
            const previewContent = hasStructured ? content.substring(0, 200) + '...' + selfAssessmentText + linksText : (needsExpand ? content.substring(0, 300) + '...' + selfAssessmentText + linksText : fullContent);
            const dStatusLabel = isResubmitted ? 'Resubmitted' : (isUngraded ? 'Needs Grading' : 'Graded');
            const dStatusClass = isResubmitted ? 'status-behind' : (isUngraded ? 'status-behind' : 'status-on-track');
            const dBorderStyle = isResubmitted ? 'border-left: 4px solid #e53935;' : (isUngraded ? 'border-left: 4px solid var(--warning);' : '');
            const docUrl = submitted[5] || draft?.links || '';
            const isDesignBrief = delLabel.toLowerCase().includes('design brief');
            const briefInputId = `brief-url-${email.replace(/[^a-zA-Z0-9]/g,'-')}-${id}`;
            const aiBriefBtn = id === 0 ? `
                <div style="margin-top:10px;">
                    <button onclick="openD0Grader('${email.replace(/'/g,"\\'")}', '${(submitted[4]||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,'\\n')}', '${(student.name||'').replace(/'/g,"\\'")}' )"
                            style="padding:6px 14px; background:var(--primary); color:white; border:none; border-radius:6px; cursor:pointer; font-size:12px; font-weight:600; display:inline-flex; align-items:center; gap:6px;">
                        <i class="fas fa-robot"></i> AI Grade Reflection
                    </button>
                </div>` : isDesignBrief ? `
                <div style="margin-top:10px; display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                    <input id="${briefInputId}" type="text" placeholder="Paste Google Doc URL here"
                           value="${docUrl.replace(/"/g,'&quot;')}"
                           style="flex:1; min-width:220px; padding:5px 10px; border:1px solid var(--gray-300); border-radius:6px; font-size:12px;"/>
                    <button onclick="openDesignBriefGrader('${email.replace(/'/g,"\\'")}', ${id}, document.getElementById('${briefInputId}').value, '${(submitted[3]||'Deliverable '+id).replace(/'/g,"\\'")}', '${(student.name||'').replace(/'/g,"\\'")}' )"
                            style="padding:6px 14px; background:var(--primary); color:white; border:none; border-radius:6px; cursor:pointer; font-size:12px; font-weight:600; display:inline-flex; align-items:center; gap:6px;">
                        <i class="fas fa-robot"></i> AI Grade Design Brief
                    </button>
                </div>` : '';
            deliverablesPanel.innerHTML += `
                <div class="item-card" style="${dBorderStyle}">
                    <div class="item-header">
                        <span class="item-title">${delLabel}</span>
                        <span class="item-status status-badge ${dStatusClass}">${dStatusLabel}</span>
                    </div>
                    <div class="item-content" id="${contentId}" data-expanded="false">
                        ${previewContent}
                    </div>
                    ${needsExpand ? `<button onclick="toggleDeliverableContent('${contentId}', ${id})" style="margin-top: 8px; padding: 4px 12px; background: var(--gray-100); border: 1px solid var(--gray-300); border-radius: 4px; cursor: pointer; font-size: 12px; color: var(--primary);">Show More</button>` : ''}
                    ${aiBriefBtn}
                    ${renderGradeSection(state.activeCourse, id, maxPoints, existingGrade, existingFeedback, email)}
                </div>
            `;
        } else if (draft && draft.status === 'completed' && (draft.content || draft.criteria)) {
            // Completed in student state but missing from Deliverables sheet (sync issue)
            const maxPoints = course.deliverablePoints?.[id] || 50;
            deliverablesPanel.innerHTML += `
                <div class="item-card" style="border-left: 4px solid var(--warning);">
                    <div class="item-header">
                        <span class="item-title">${delLabel}</span>
                        <span class="item-status status-badge status-behind">Needs Grading</span>
                    </div>
                    <div class="item-content">
                        ${(draft.criteria || draft.wiring) ? renderStructuredContent(draft, draft.content) : `<div style="white-space: pre-wrap;">${(draft.content || '').substring(0, 300)}${draft.content?.length > 300 ? '...' : ''}</div>`}
                        ${draft.selfAssessment ? `<br><br><strong>Self-Assessment:</strong> ${draft.selfAssessment}/10` : ''}
                        ${draft.links ? `<br><br><strong>Links:</strong> ${draft.links}` : ''}
                    </div>
                    ${renderGradeSection(state.activeCourse, id, maxPoints, '', '', email)}
                </div>
            `;
        } else if (draft && draft.status === 'in-progress' && (draft.content || draft.criteria)) {
            deliverablesPanel.innerHTML += `
                <div class="item-card" style="border-left: 3px solid var(--warning);">
                    <div class="item-header">
                        <span class="item-title">${delLabel}</span>
                        <span class="item-status status-badge status-behind">In Progress</span>
                    </div>
                    <div class="item-content">
                        ${(draft.criteria || draft.wiring) ? renderStructuredContent(draft, draft.content) : `<div style="white-space: pre-wrap;">${(draft.content || '').substring(0, 300)}${draft.content?.length > 300 ? '...' : ''}</div>`}
                    </div>
                </div>
            `;
        } else {
            // No submission, no draft — placeholder for teacher to record an email submission URL
            const skipped = !isDeliverableRequired(state.activeCourse, id);
            if (!skipped) {
                const urlInputId = `email-url-${email.replace(/[^a-zA-Z0-9]/g,'-')}-${id}`;
                deliverablesPanel.innerHTML += `
                    <div class="item-card" style="opacity: 0.85; border-left: 3px dashed var(--gray-400);">
                        <div class="item-header">
                            <span class="item-title">${delLabel}</span>
                            <span class="item-status status-badge status-very-behind">Not Submitted</span>
                        </div>
                        <div class="item-content"><em>Student has not submitted via the portfolio.</em></div>
                        <div style="margin-top:10px; padding-top:10px; border-top:1px dashed var(--gray-200);">
                            <label style="font-size:12px; color:var(--gray-600); display:block; margin-bottom:4px;">Recorded an email submission? Paste the URL here:</label>
                            <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                                <input id="${urlInputId}" type="text" placeholder="https://docs.google.com/..."
                                       style="flex:1; min-width:220px; padding:5px 10px; border:1px solid var(--gray-300); border-radius:6px; font-size:12px;"/>
                                <button onclick="recordDeliverableUrl('${email.replace(/'/g,"\\'")}', ${id}, document.getElementById('${urlInputId}').value)"
                                        style="padding:6px 14px; background:var(--primary); color:white; border:none; border-radius:6px; cursor:pointer; font-size:12px; font-weight:600;">
                                    <i class="fas fa-save"></i> Record URL
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    }

    if (deliverablesPanel.innerHTML === '') {
        deliverablesPanel.innerHTML = '<p class="empty-state">No deliverables yet.</p>';
    }

    // Evidence panel
    const evidencePanel = document.getElementById('evidencePanel');
    const evidenceItems = student.fullState?.evidence || [];

    if (evidenceItems.length === 0) {
        evidencePanel.innerHTML = '<p class="empty-state">No evidence photos uploaded.</p>';
    } else {
        // Check if any items have Drive links (new system) vs base64 (legacy)
        const hasDriveLinks = evidenceItems.some(item => item.thumbnailLink || item.webViewLink);

        evidencePanel.innerHTML = `
            <p style="margin-bottom: 12px; color: var(--gray-600); font-size: 13px;">
                <i class="fas fa-info-circle"></i> ${evidenceItems.length} photo(s) uploaded.
                ${hasDriveLinks ? 'Click images to view full size in Google Drive.' : 'Legacy images stored on student devices.'}
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px;">
                ${evidenceItems.map(item => {
                    // Try to show thumbnail, fall back to placeholder on error
                    const fileId = item.driveId;
                    const viewLink = item.webViewLink || (fileId ? 'https://drive.google.com/file/d/' + fileId + '/view' : '#');
                    // Use stored thumbnailLink, or construct from fileId, or use base64 data
                    let imgSrc = item.thumbnailLink || (fileId ? 'https://drive.google.com/uc?export=view&id=' + fileId : null) || item.data || null;

                    return `
                        <div style="background: var(--gray-50); border-radius: 8px; overflow: hidden; border: 1px solid var(--gray-200);">
                            <a href="${viewLink}" target="_blank" style="display: block; position: relative; height: 120px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                                ${imgSrc ? `<img src="${imgSrc}" alt="${item.filename || 'Evidence'}"
                                    style="width: 100%; height: 120px; object-fit: cover; display: block;"
                                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
                                <div style="display: ${imgSrc ? 'none' : 'flex'}; position: absolute; inset: 0; flex-direction: column; align-items: center; justify-content: center; color: white;">
                                    <i class="fas fa-image" style="font-size: 32px; margin-bottom: 8px;"></i>
                                    <span style="font-size: 12px; font-weight: 500;">Click to View</span>
                                </div>
                            </a>
                            <div style="padding: 8px; font-size: 12px; color: var(--gray-600);">
                                <div style="font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${item.filename || 'Photo'}">${item.filename || 'Photo'}</div>
                                <div>Week ${item.week || '?'} &middot; ${item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString() : 'Unknown date'}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // Quiz panel (Robotics only)
    const quizTab   = document.getElementById('quizDetailTab');
    const quizPanel = document.getElementById('quizPanel');
    if (quizTab && quizPanel) {
        if (state.activeCourse === 'hsaer') {
            quizTab.style.display = '';
            const quizRow = (state.rawData?.quiz || []).find(r => r[1] === student.email);
            if (!quizRow) {
                quizPanel.innerHTML = '<p class="empty-state">No quiz submission yet.</p>';
            } else {
                const qMeta = [
                    { label: 'Q1 — PWM',               max: 4 },
                    { label: 'Q2 — Contact Detection',  max: 4 },
                    { label: 'Q3 — abs() / Slip',       max: 4 },
                    { label: 'Q4 — Rate of Closure',    max: 4 },
                    { label: 'Q5 — Object Detection',   max: 4 },
                    { label: 'Q6 — Blocking Code',      max: 6 },
                    { label: 'Bonus — Active Low',      max: 2 },
                ];
                let col = 3;
                let rows = '';
                const gradingPending = qMeta.every((_, i) => quizRow[col + i*3 + 1] === '' || quizRow[col + i*3 + 1] === null);
                qMeta.forEach(({ label, max }, i) => {
                    const answer    = quizRow[col]   || '';
                    const aiScore   = quizRow[col+1] !== '' && quizRow[col+1] !== null ? quizRow[col+1] : '';
                    const feedback  = quizRow[col+2] || (gradingPending ? '<em style="color:var(--gray-400);">AI grading pending</em>' : '');
                    col += 3;
                    rows += `
                        <tr style="border-bottom:1px solid var(--gray-100);">
                            <td style="padding:10px 8px; font-weight:600; font-size:13px; white-space:nowrap; vertical-align:top;">${label}</td>
                            <td style="padding:10px 8px; font-size:13px; vertical-align:top; max-width:260px;">${answer}</td>
                            <td style="padding:6px 8px; text-align:center; vertical-align:top; white-space:nowrap;">
                                <input type="number" class="quiz-q-score" data-max="${max}"
                                    value="${aiScore}" min="0" max="${max}" step="1"
                                    oninput="tallyQuizScore()"
                                    style="width:48px; padding:4px 6px; border:1px solid var(--gray-300); border-radius:4px; text-align:center; font-size:13px; font-weight:700;">
                                <span style="font-size:12px; color:var(--gray-400);">/${max}</span>
                            </td>
                            <td style="padding:10px 8px; font-size:12px; color:var(--gray-500); vertical-align:top;">${feedback}</td>
                        </tr>`;
                });
                const aiTotal      = quizRow[col]   !== '' && quizRow[col]   !== null ? quizRow[col]   : '—';
                const teacherFinal = quizRow[col+1] !== '' && quizRow[col+1] !== null ? quizRow[col+1] : '';
                const regradeBtn = `<button class="btn btn-secondary" style="font-size:12px; padding:6px 12px;"
                    onclick="regradeQuiz('${student.email}', this)">
                    <i class="fas fa-robot"></i> ${gradingPending ? 'Run AI Grading' : 'Re-run AI Grading'}
                </button>`;
                quizPanel.innerHTML = `
                    <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
                        <p style="font-size:13px; color:var(--gray-500); margin:0;">
                            Submitted: ${quizRow[0]} &nbsp;|&nbsp; AI Total: <strong>${aiTotal}/26</strong>
                        </p>
                        ${regradeBtn}
                    </div>
                    <table style="width:100%; border-collapse:collapse; font-size:13px; margin-bottom:20px;">
                        <thead><tr style="background:var(--gray-50);">
                            <th style="padding:8px; text-align:left; border-bottom:2px solid var(--gray-200);">Question</th>
                            <th style="padding:8px; text-align:left; border-bottom:2px solid var(--gray-200);">Student Answer</th>
                            <th style="padding:8px; text-align:center; border-bottom:2px solid var(--gray-200); width:80px;">Score</th>
                            <th style="padding:8px; text-align:left; border-bottom:2px solid var(--gray-200);">AI Feedback</th>
                        </tr></thead>
                        <tbody>${rows}</tbody>
                        <tfoot><tr style="background:var(--gray-50); border-top:2px solid var(--gray-200);">
                            <td colspan="2" style="padding:10px 8px; font-weight:700; font-size:14px;">Total</td>
                            <td style="padding:10px 8px; text-align:center;">
                                <span id="quizScoreTotal" style="font-size:15px; font-weight:900; color:var(--primary);">${teacherFinal !== '' ? teacherFinal : (aiTotal !== '—' ? aiTotal : '—')}</span>
                                <span style="font-size:12px; color:var(--gray-400);">/28</span>
                            </td>
                            <td style="padding:10px 8px; text-align:right;">
                                <button class="btn btn-primary" style="font-size:13px; padding:7px 16px;"
                                    onclick="saveQuizGrade('${student.email}', this)">
                                    <i class="fas fa-save"></i> Save Grade
                                </button>
                            </td>
                        </tr></tfoot>
                    </table>`;
            }
        } else {
            quizTab.style.display = 'none';
        }
    }

    // Show modal
    document.getElementById('studentModal').classList.add('active');

    // Reset to first tab
    document.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.detail-panel').forEach(p => p.classList.remove('active'));
    document.querySelector('.detail-tab').classList.add('active');
    document.getElementById('deliverablesPanel').classList.add('active');
}

async function regradeQuiz(email, btn) {
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Grading…';
    try {
        const course = CONFIG.COURSES['hsaer'];
        const res = await fetch(course.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: 'regradeQuiz', token: CONFIG.TEACHER_TOKEN, email })
        });
        const data = await res.json();
        if (data.success) {
            btn.innerHTML = '<i class="fas fa-check"></i> Graded!';
            // Reload data so the panel refreshes
            await loadCourseData();
            const student = state.students.find(s => s.email === email);
            if (student) openStudentDetail(student.email);
        } else {
            btn.disabled = false;
            btn.innerHTML = orig;
            alert('Re-grade failed: ' + (data.error || 'Unknown error'));
        }
    } catch(err) {
        btn.disabled = false;
        btn.innerHTML = orig;
        alert('Re-grade error: ' + err.message);
    }
}

function tallyQuizScore() {
    let total = 0;
    document.querySelectorAll('.quiz-q-score').forEach(inp => {
        const max = parseInt(inp.dataset.max) || 0;
        total += Math.min(parseInt(inp.value) || 0, max);
    });
    const el = document.getElementById('quizScoreTotal');
    if (el) el.textContent = total;
}

async function saveQuizGrade(email, btn) {
    const inputs = document.querySelectorAll('.quiz-q-score');
    let total = 0;
    inputs.forEach(inp => { total += Math.min(parseInt(inp.value) || 0, parseInt(inp.dataset.max) || 0); });
    const score = total;
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving…';
    try {
        const course = CONFIG.COURSES['hsaer'];
        const res = await fetch(course.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: 'saveQuizGrade', token: CONFIG.TEACHER_TOKEN, email, score: Number(score) })
        });
        const data = await res.json();
        if (data.success) {
            btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
            setTimeout(() => { btn.disabled = false; btn.innerHTML = orig; }, 2000);
        } else {
            btn.disabled = false;
            btn.innerHTML = orig;
            alert('Save failed: ' + (data.error || 'Unknown error'));
        }
    } catch(err) {
        btn.disabled = false;
        btn.innerHTML = orig;
        alert('Save error: ' + err.message);
    }
}

function closeModal() {
    document.getElementById('studentModal').classList.remove('active');
}

// Toggle reflection content expansion
function toggleContent(contentId) {
    const element = document.getElementById(contentId);
    const button = element.nextElementSibling;

    if (element.style.maxHeight === '150px') {
        element.style.maxHeight = 'none';
        element.style.overflow = 'visible';
        button.textContent = 'Show Less';
    } else {
        element.style.maxHeight = '150px';
        element.style.overflow = 'hidden';
        button.textContent = 'Show More';
    }
}

// Toggle deliverable content expansion
// Render structured deliverable data as HTML tables when available
function renderStructuredContent(draft, contentText) {
    if (!draft) return `<div style="white-space: pre-wrap;">${contentText || ''}</div>`;

    let html = '';

    // Pugh Matrix (FRC deliverable 4)
    if (draft.criteria && draft.options) {
        const optNames = [draft.options[0] || 'Baseline', draft.options[1] || 'Option 2', draft.options[2] || 'Option 3'];
        const scoreSymbol = (s) => s === 1 ? '+' : s === -1 ? '-' : s === 0 ? 'S' : '—';
        const totals = [0, 0, 0];
        html += `<div style="margin-bottom: 12px;"><strong>Pugh Decision Matrix</strong></div>`;
        html += `<table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 12px;">
            <thead><tr style="background: #f5f5f5;">
                <th style="padding: 6px 8px; text-align: left; border: 1px solid #ddd;">Criteria</th>
                <th style="padding: 6px 8px; text-align: center; border: 1px solid #ddd; width: 50px;">Weight</th>
                <th style="padding: 6px 8px; text-align: center; border: 1px solid #ddd;">${optNames[0]} (Baseline)</th>
                <th style="padding: 6px 8px; text-align: center; border: 1px solid #ddd;">${optNames[1]}</th>
                <th style="padding: 6px 8px; text-align: center; border: 1px solid #ddd;">${optNames[2]}</th>
            </tr></thead><tbody>`;
        draft.criteria.forEach(c => {
            if (!c.name) return;
            html += `<tr>
                <td style="padding: 6px 8px; border: 1px solid #ddd;">${c.name}</td>
                <td style="padding: 6px 8px; text-align: center; border: 1px solid #ddd;">${c.weight}</td>
                <td style="padding: 6px 8px; text-align: center; border: 1px solid #ddd;">0</td>`;
            [1, 2].forEach(col => {
                const s = c.scores?.[col];
                const weighted = (s !== '' && s !== undefined) ? s * c.weight : '';
                if (weighted !== '') totals[col] += weighted;
                const sym = scoreSymbol(s);
                const wStr = weighted !== '' ? ` (${weighted > 0 ? '+' : ''}${weighted})` : '';
                html += `<td style="padding: 6px 8px; text-align: center; border: 1px solid #ddd;">${sym}${wStr}</td>`;
            });
            html += `</tr>`;
        });
        const fmtT = (v) => v > 0 ? `+${v}` : `${v}`;
        html += `<tr style="font-weight: bold; background: #f9f9f9;">
            <td style="padding: 6px 8px; border: 1px solid #ddd;">TOTAL</td>
            <td style="border: 1px solid #ddd;"></td>
            <td style="padding: 6px 8px; text-align: center; border: 1px solid #ddd;">0</td>
            <td style="padding: 6px 8px; text-align: center; border: 1px solid #ddd; color: ${totals[1] > 0 ? '#4caf50' : totals[1] < 0 ? '#e53935' : '#666'};">${fmtT(totals[1])}</td>
            <td style="padding: 6px 8px; text-align: center; border: 1px solid #ddd; color: ${totals[2] > 0 ? '#4caf50' : totals[2] < 0 ? '#e53935' : '#666'};">${fmtT(totals[2])}</td>
        </tr></tbody></table>`;
        if (draft.justification) html += `<div style="margin-bottom: 8px;"><strong>Justification:</strong><br><span style="white-space: pre-wrap;">${draft.justification}</span></div>`;
        if (draft.contribution) html += `<div style="margin-bottom: 8px;"><strong>My Contribution:</strong><br><span style="white-space: pre-wrap;">${draft.contribution}</span></div>`;
        return html;
    }

    // Wiring + Accuracy (Robotics deliverable 3)
    if (draft.wiring && draft.accuracyData) {
        html += `<div style="margin-bottom: 12px;"><strong>Wire Connections</strong></div>`;
        html += `<table style="border-collapse: collapse; font-size: 13px; margin-bottom: 12px;">
            <thead><tr style="background: #f5f5f5;">
                <th style="padding: 6px 8px; text-align: left; border: 1px solid #ddd;">Arduino Pin</th>
                <th style="padding: 6px 8px; text-align: center; border: 1px solid #ddd;">→</th>
                <th style="padding: 6px 8px; text-align: left; border: 1px solid #ddd;">Sensor Pin</th>
            </tr></thead><tbody>`;
        draft.wiring.forEach(w => {
            if (w.arduino || w.sensor) {
                html += `<tr>
                    <td style="padding: 4px 8px; border: 1px solid #ddd;">${w.arduino}</td>
                    <td style="padding: 4px 8px; text-align: center; border: 1px solid #ddd;">→</td>
                    <td style="padding: 4px 8px; border: 1px solid #ddd;">${w.sensor}</td>
                </tr>`;
            }
        });
        html += `</tbody></table>`;

        const distances = [5, 10, 20, 50, 100];
        html += `<div style="margin-bottom: 8px;"><strong>Distance Accuracy Test</strong></div>`;
        html += `<table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: center; margin-bottom: 12px;">
            <thead><tr style="background: #f5f5f5;">
                <th style="padding: 6px 8px; border: 1px solid #ddd;">Actual (cm)</th>
                <th style="padding: 6px 8px; border: 1px solid #ddd;">Reading 1</th>
                <th style="padding: 6px 8px; border: 1px solid #ddd;">Reading 2</th>
                <th style="padding: 6px 8px; border: 1px solid #ddd;">Reading 3</th>
                <th style="padding: 6px 8px; border: 1px solid #ddd;">Avg Error</th>
            </tr></thead><tbody>`;
        draft.accuracyData.forEach((row, i) => {
            const readings = [row.r1, row.r2, row.r3].map(r => parseFloat(r)).filter(r => !isNaN(r));
            const avgError = readings.length > 0
                ? (readings.reduce((sum, r) => sum + Math.abs(r - distances[i]), 0) / readings.length).toFixed(1)
                : '—';
            const errColor = avgError !== '—' ? (parseFloat(avgError) <= 2 ? '#4caf50' : parseFloat(avgError) <= 5 ? '#f59e0b' : '#e53935') : '#666';
            html += `<tr>
                <td style="padding: 4px 8px; border: 1px solid #ddd; font-weight: bold;">${distances[i]}</td>
                <td style="padding: 4px 8px; border: 1px solid #ddd;">${row.r1 || '—'}</td>
                <td style="padding: 4px 8px; border: 1px solid #ddd;">${row.r2 || '—'}</td>
                <td style="padding: 4px 8px; border: 1px solid #ddd;">${row.r3 || '—'}</td>
                <td style="padding: 4px 8px; border: 1px solid #ddd; font-weight: bold; color: ${errColor};">${avgError}${avgError !== '—' ? ' cm' : ''}</td>
            </tr>`;
        });
        html += `</tbody></table>`;

        // Show remaining content (code & observations)
        if (draft.rawContent) {
            html += `<div><strong>Code & Observations:</strong><br><span style="white-space: pre-wrap;">${draft.rawContent}</span></div>`;
        }
        return html;
    }

    // Render photos from draft if present
    if (draft.photos && draft.photos.length > 0) {
        html += `<div style="margin-bottom: 10px;"><strong>Photos:</strong></div>`;
        html += `<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">`;
        draft.photos.forEach(p => {
            html += `<a href="${p.webViewLink}" target="_blank" style="display: block; width: 100px; height: 100px; border-radius: 6px; overflow: hidden; border: 1px solid #ddd;">
                <img src="${p.thumbnailLink}" alt="${p.filename}" style="width: 100%; height: 100%; object-fit: cover;">
            </a>`;
        });
        html += `</div>`;
    }

    // Fallback: plain text with whitespace preservation (strip photo URLs from text since we rendered them above)
    const textForDisplay = (contentText || draft.content || '').replace(/\n\n--- PHOTOS ---\n[\s\S]*$/, '').trim();
    if (textForDisplay) html += `<div style="white-space: pre-wrap;">${textForDisplay}</div>`;
    return html || `<div style="white-space: pre-wrap;">${contentText || draft.content || ''}</div>`;
}

function toggleDeliverableContent(contentId, deliverableId) {
    const element = document.getElementById(contentId);
    const button = element.nextElementSibling;
    const isExpanded = element.dataset.expanded === 'true';

    if (!isExpanded) {
        // Find the student and get full content
        const modalEmail = document.querySelector('#studentModal .item-card .grade-input')?.dataset.email;
        if (!modalEmail) return;

        const submitted = state.rawData.deliverables?.find(d => d[0] === modalEmail && d[2] == deliverableId);
        if (!submitted) return;

        const content = submitted[4] || '';
        const selfAssessmentText = submitted[6] !== '' && submitted[6] !== null && submitted[6] !== undefined ? `<br><br><strong>Self-Assessment:</strong> ${submitted[6]}/10` : '';
        const linksText = submitted[5] ? `<br><br><strong>Links:</strong> ${submitted[5]}` : '';

        // Check for structured data in fullState
        const student = state.students?.find(s => s.email === modalEmail);
        const draft = student?.fullState?.deliverables?.[deliverableId];
        const hasStructured = draft && (draft.criteria || draft.wiring || draft.photos?.length);

        if (hasStructured) {
            element.innerHTML = renderStructuredContent(draft, content) + selfAssessmentText + linksText;
        } else {
            element.innerHTML = `<div style="white-space: pre-wrap;">${content}</div>` + selfAssessmentText + linksText;
        }
        element.dataset.expanded = 'true';
        button.textContent = 'Show Less';
    } else {
        const modalEmail = document.querySelector('#studentModal .item-card .grade-input')?.dataset.email;
        const submitted = state.rawData.deliverables?.find(d => d[0] === (modalEmail || '') && d[2] == deliverableId);
        if (!submitted) return;

        const content = submitted[4] || '';
        const selfAssessmentText = submitted[6] !== '' && submitted[6] !== null && submitted[6] !== undefined ? `<br><br><strong>Self-Assessment:</strong> ${submitted[6]}/10` : '';
        const linksText = submitted[5] ? `<br><br><strong>Links:</strong> ${submitted[5]}` : '';

        element.innerHTML = content.substring(0, 300) + '...' + selfAssessmentText + linksText;
        element.dataset.expanded = 'false';
        button.textContent = 'Show More';
    }
}

async function saveStudentGrades() {
    const grades = [];
    const course = CONFIG.COURSES[state.activeCourse];

    // Collect all grade inputs
    document.querySelectorAll('.grade-input').forEach(input => {
        const feedbackEl = document.querySelector(
            `.feedback-input[data-type="${input.dataset.type}"][data-id="${input.dataset.id}"][data-email="${input.dataset.email}"]`
        );

        if (input.value || feedbackEl?.value) {
            grades.push({
                email: input.dataset.email,
                type: input.dataset.type,
                assignmentId: parseInt(input.dataset.id),
                grade: input.value,
                feedback: feedbackEl?.value || ''
            });
        }
    });

    if (grades.length === 0) {
        showToast('No grades to save', 'info');
        return;
    }

    // Show loading state
    const saveBtn = document.getElementById('saveGradesBtn');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    saveBtn.disabled = true;

    try {
        console.log('Saving grades to:', course.apiUrl);
        console.log('Grades data:', grades);
        const response = await fetch(course.apiUrl, {
            method: 'POST',
            redirect: 'follow',
            body: JSON.stringify({
                action: 'saveGrades',
                grades: grades
            })
        });

        console.log('Response status:', response.status);
        const text = await response.text();
        console.log('Response text:', text);

        let result;
        try {
            result = JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse response:', text);
            showToast('Server error - check console', 'error');
            return;
        }

        if (result.success) {
            showToast(`Saved ${grades.length} grade(s) - refreshing data...`, 'success');
            // Refresh data to show updated grades
            await loadCourseData();
            closeModal();
        } else {
            showToast('Failed to save grades: ' + (result.error || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Save grades error:', error);
        showToast('Failed to save grades: ' + error.message, 'error');
    } finally {
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
    }
}

// ============================================
// GRADE REPORT
// ============================================
function showGradeReport() {
    document.getElementById('gradeReportModal').classList.add('active');
    updateGradeReport();
}

function closeGradeReport() {
    document.getElementById('gradeReportModal').classList.remove('active');
}

function updateGradeReport() {
    const course = CONFIG.COURSES[state.activeCourse];
    const periodFilter = document.getElementById('reportPeriodFilter').value;
    const typeFilter = document.getElementById('reportTypeFilter').value;

    // Filter students by period
    let students = state.students;
    if (periodFilter !== 'all') {
        students = students.filter(s => s.period === periodFilter);
    }

    // Sort by last name
    students = [...students].sort((a, b) => {
        const aLast = a.name.split(' ').pop() || a.name;
        const bLast = b.name.split(' ').pop() || b.name;
        return aLast.localeCompare(bLast);
    });

    const thead = document.getElementById('gradeReportHead');
    const tbody = document.getElementById('gradeReportBody');

    const showQuizzes = (typeFilter === 'quiz' || typeFilter === 'all') && course.quizzes?.length;

    // Build headers based on type filter
    const reportDeliverables = (typeFilter === 'deliverables' || typeFilter === 'all')
        ? (TRACK_DELIVERABLES[state.activeCourse] || []) : [];

    let headers = ['Name', 'Period'];
    reportDeliverables.forEach(del => {
        headers.push(del.label.split(' — ')[0].trim()); // e.g. "D1.0"
    });
    if (showQuizzes) {
        course.quizzes.forEach(q => headers.push(q.name));
    }
    headers.push('Total');

    thead.innerHTML = `<tr>${headers.map(h => `<th style="position: sticky; top: 0; background: var(--gray-100); padding: 8px; text-align: left; font-size: 12px; white-space: nowrap;">${h}</th>`).join('')}</tr>`;

    // Build rows
    tbody.innerHTML = students.map(student => {
        const email = student.email;
        let row = [`<td style="padding: 6px 8px; white-space: nowrap;">${student.name}</td>`];
        row.push(`<td style="padding: 6px 8px;">${formatPeriod(student.period)}</td>`);

        let total = 0;
        let maxTotal = 0;

        // Deliverable grades
        reportDeliverables.forEach(del => {
            const d = del.id;
            const draft = student.fullState?.deliverables?.[d];
            const submitted = state.rawData.deliverables?.find(sub => sub[0] === email && sub[2] == d && sub[7] === 'completed');
            // isCompleted: either in Deliverables sheet OR fullState-only (not yet synced)
            const isCompleted = (submitted != null) || (draft?.status === 'completed');
            // Grade: prefer sheet grade, then fullState teacherGrade, then auto-score D1.0
            let grade = '';
            if (submitted?.[9] !== '' && submitted?.[9] !== null && submitted?.[9] !== undefined) {
                grade = submitted[9];
            } else if (draft?.teacherGrade !== undefined && draft.teacherGrade !== '') {
                grade = draft.teacherGrade;
            } else if (isCompleted && d === 10) {
                grade = course.deliverablePoints?.[10] ?? 10; // D1.0 pass/fail
            }
            const maxPts = course.deliverablePoints?.[d];

            if (grade !== '' && grade !== undefined) {
                total += parseFloat(grade) || 0;
            }
            if (isCompleted && maxPts !== undefined) {
                maxTotal += maxPts;
            }

            const cellStyle = grade !== '' ? '' : (isCompleted ? 'color: var(--warning);' : 'color: var(--gray-300);');
            row.push(`<td style="padding: 6px 8px; text-align: center; ${cellStyle}">${grade !== '' && grade !== undefined ? grade : (isCompleted ? '-' : '')}</td>`);
        });

        // Quiz scores
        if (showQuizzes) {
            course.quizzes.forEach(quiz => {
                // Prefer per-quiz data from the backend (keyed by quizId), falling
                // back to the legacy single-quiz array for the original claw quiz.
                const quizRows = state.rawData?.quizzes?.[quiz.id]
                              || (quiz.id === 'claw' ? state.rawData?.quiz : [])
                              || [];
                const quizRow = quizRows.find(r => r[1] === email);
                let quizScore = '';
                if (quizRow) {
                    const aiTotalIdx    = 3 + quiz.questionCount * 3;
                    const teacherFinalIdx = aiTotalIdx + 1;
                    const tf = quizRow[teacherFinalIdx];
                    const ai = quizRow[aiTotalIdx];
                    quizScore = (tf !== '' && tf !== null && tf !== undefined) ? tf
                              : (ai !== '' && ai !== null && ai !== undefined) ? ai : '';
                    if (quizScore !== '') total += parseFloat(quizScore) || 0;
                    maxTotal += quiz.maxPoints;
                }
                const cellStyle = quizScore !== '' ? '' : (quizRow ? 'color: var(--warning);' : 'color: var(--gray-300);');
                row.push(`<td style="padding: 6px 8px; text-align: center; ${cellStyle}">${quizScore !== '' ? quizScore : (quizRow ? '-' : '')}</td>`);
            });
        }

        row.push(`<td style="padding: 6px 8px; text-align: center; font-weight: 600;">${total}${maxTotal > 0 ? '/' + maxTotal : ''}</td>`);

        return `<tr>${row.join('')}</tr>`;
    }).join('');
}

function copyGradeReport() {
    const table = document.getElementById('gradeReportTable');
    const rows = Array.from(table.querySelectorAll('tr'));

    const text = rows.map(row => {
        const cells = Array.from(row.querySelectorAll('th, td'));
        return cells.map(cell => cell.textContent.trim()).join('\t');
    }).join('\n');

    navigator.clipboard.writeText(text).then(() => {
        showToast('Grade report copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}

// ============================================
// EXPORT
// ============================================
function exportCSV() {
    const course = CONFIG.COURSES[state.activeCourse];
    const headers = ['Name', 'Email', 'Period'];
    if (course.hasTeams) headers.push('Team');
    headers.push('Deliverables', 'Points', 'Progress', 'Status');

    const rows = state.students.map(s => {
        const row = [s.name, s.email, formatPeriod(s.period)];
        if (course.hasTeams) row.push(formatTeam(s.team));
        row.push(
            `${s.completedDeliverables}/${course.totalDeliverables}`,
            s.points,
            s.progress + '%',
            formatStatus(s.status)
        );
        return row;
    });

    const csv = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${course.name.replace(/\s+/g, '_')}_Progress_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// ============================================
// REMINDER EMAILS
// ============================================
async function sendReminderEmails() {
    const btn = document.getElementById('sendRemindersBtn');
    const behind = parseInt(document.getElementById('studentsBehind').textContent) || 0;

    if (behind === 0) {
        showToast('No students behind - no reminders to send!', 'info');
        return;
    }

    if (!confirm(`Send reminder emails to students who are behind on deliverables?\n\nThis will email all students with missing or overdue deliverables.`)) {
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
        const course = CONFIG.COURSES[state.activeCourse];
        const response = await fetch(course.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                action: 'sendReminders',
                semesterStart: CONFIG.SEMESTER_START.toISOString()
            })
        });

        const result = await response.json();

        if (result.success) {
            showToast(`Sent ${result.emailsSent} reminder email${result.emailsSent !== 1 ? 's' : ''}!`, 'success');
        } else {
            showToast('Failed to send reminders: ' + (result.error || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Failed to send reminders:', error);
        showToast('Failed to send reminders: ' + error.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-envelope"></i> Send Reminders';
    }
}

// ============================================
// UTILITIES
// ============================================
function showToast(message, type = 'info', duration = 3000) {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-size: 14px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), duration);
}

function getInitials(name) {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function formatPeriod(period) {
    const labels = {
        hour1: '1st Hour',
        hour2: '2nd Hour',
        hour3: '3rd Hour',
        hour4: '4th Hour',
        hour5: '5th Hour',
        hour6: '6th Hour',
        hour7: '7th Hour'
    };
    return labels[period] || period || '-';
}

function formatTeam(team) {
    const labels = {
        drivetrain: 'Drivetrain',
        intake: 'Intake',
        shooter: 'Shooter',
        climber: 'Climber',
        autonomous: 'Autonomous',
        integration: 'Integration'
    };
    return labels[team] || team || '-';
}

function formatStatus(status) {
    const labels = {
        'on-track': 'On Track',
        'behind': 'Behind',
        'very-behind': 'Very Behind'
    };
    return labels[status] || status;
}

function formatDeliverableLabel(id) {
    if (id === 0) return 'D0';
    const unit = Math.floor(id / 10);
    const num = id % 10;
    return `D${unit}.${num}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// GRADE ENTRY
// ============================================
function initGradeEntry() {
    document.getElementById('gradeEntryBtn').addEventListener('click', openGradeEntry);
    document.getElementById('closeGradeModal').addEventListener('click', closeGradeEntry);
    document.getElementById('gradeEntryModal').addEventListener('click', (e) => {
        if (e.target.id === 'gradeEntryModal') closeGradeEntry();
    });
    document.getElementById('assignmentType').addEventListener('change', updateAssignmentSelect);
    document.getElementById('assignmentSelect').addEventListener('change', loadGradeTable);
    document.getElementById('gradePeriodFilter').addEventListener('change', loadGradeTable);
    document.getElementById('saveAllGradesBtn').addEventListener('click', saveAllGrades);
}

function openGradeEntry() {
    updateAssignmentSelect();
    document.getElementById('gradeEntryModal').classList.add('active');
}

function closeGradeEntry() {
    document.getElementById('gradeEntryModal').classList.remove('active');
}

function updateAssignmentSelect() {
    const type = document.getElementById('assignmentType').value;
    const select = document.getElementById('assignmentSelect');
    const course = CONFIG.COURSES[state.activeCourse];

    select.innerHTML = '';

    if (type === 'deliverable') {
        const deliverables = TRACK_DELIVERABLES[state.activeCourse] || [];
        for (const del of deliverables) {
            const option = document.createElement('option');
            option.value = del.id;
            const pts = course.deliverablePoints?.[del.id];
            option.textContent = `${del.label} (${pts !== undefined ? pts + ' pts' : 'ungraded'})`;
            select.appendChild(option);
        }
    }

    loadGradeTable();
}

function loadGradeTable() {
    const type = document.getElementById('assignmentType').value;
    const assignmentId = parseInt(document.getElementById('assignmentSelect').value);
    const periodFilter = document.getElementById('gradePeriodFilter').value;
    const course = CONFIG.COURSES[state.activeCourse];
    const tbody = document.getElementById('gradeTableBody');

    // Update header info
    const maxPoints = course.deliverablePoints?.[assignmentId];
    const delRecord = (TRACK_DELIVERABLES[state.activeCourse] || []).find(d => d.id === assignmentId);
    document.getElementById('gradeAssignmentTitle').textContent = delRecord ? delRecord.label : formatDeliverableLabel(assignmentId);
    document.getElementById('gradeAssignmentPoints').textContent = `Max: ${maxPoints !== undefined ? maxPoints : '—'} pts`;

    // Filter and sort students alphabetically
    let filteredStudents = [...state.students];
    if (periodFilter !== 'all') {
        filteredStudents = filteredStudents.filter(s => s.period === periodFilter);
    }
    filteredStudents.sort((a, b) => {
        const aLast = a.name.split(' ').pop() || a.name;
        const bLast = b.name.split(' ').pop() || b.name;
        return aLast.localeCompare(bLast);
    });

    if (filteredStudents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No students found.</td></tr>';
        return;
    }

    tbody.innerHTML = filteredStudents.map(student => {
        let status = '<span class="status-badge status-very-behind">Not Started</span>';
        let aiGrade = '';        // read-only baseline (AI or auto-scored)
        let existingFeedback = '';
        let isSubmitted = false;

        const submitted = state.rawData.deliverables?.find(d => d[0] === student.email && d[2] == assignmentId);
        const draft = student.fullState?.deliverables?.[assignmentId];
        // Debug: list every deliverable ID this student has submitted (for diagnosing wrong-ID issues)
        const allSubmittedIds = (state.rawData.deliverables || [])
            .filter(d => d[0] === student.email && d[7] === 'completed')
            .map(d => d[2]);
        const allDraftIds = Object.keys(student.fullState?.deliverables || {})
            .filter(k => student.fullState.deliverables[k]?.status === 'completed');
        const debugInfo = `Sheet IDs: [${allSubmittedIds.join(',')}] | State IDs: [${allDraftIds.join(',')}]`;

        if (submitted && submitted[7] === 'completed') {
            isSubmitted = true;
            status = '<span class="status-badge status-on-track">Completed</span>';
            // D1.0 is pass/fail — auto-score maxPts; others use existing grade from sheet
            aiGrade = (assignmentId === 10)
                ? (maxPoints !== undefined ? maxPoints : 10)
                : (submitted[9] !== '' && submitted[9] !== null && submitted[9] !== undefined ? submitted[9] : '');
            existingFeedback = submitted[10] || '';
        } else if (draft && draft.status === 'completed') {
            // Completed in fullState but not yet synced to Deliverables sheet
            isSubmitted = true;
            status = '<span class="status-badge status-on-track">Completed</span>';
            aiGrade = (assignmentId === 10)
                ? (maxPoints !== undefined ? maxPoints : 10)
                : (draft.teacherGrade !== undefined && draft.teacherGrade !== '' ? draft.teacherGrade : '');
            existingFeedback = draft.teacherFeedback || '';
        } else if (draft && draft.status === 'in-progress') {
            status = '<span class="status-badge status-behind">In Progress</span>';
        }

        const aiNum = aiGrade !== '' ? parseFloat(aiGrade) : null;
        const finalDisplay = aiNum !== null ? aiNum : '—';

        return `
            <tr data-email="${student.email}" data-aigrade="${aiGrade}" data-submitted="${isSubmitted}">
                <td>
                    <div class="student-name">
                        <div class="avatar">${getInitials(student.name)}</div>
                        ${student.name}
                    </div>
                </td>
                <td>${formatPeriod(student.period)}</td>
                <td>${status}<br><small style="color:var(--gray-500);font-size:10px;">${debugInfo}</small></td>
                <td style="text-align:center; color: var(--gray-600); font-weight:500;">${aiGrade !== '' ? aiGrade : '—'}</td>
                <td>
                    <input type="number" class="adjustment-input" data-email="${student.email}"
                           value="0" step="1"
                           style="width: 70px; padding: 6px 8px; border: 1px solid var(--gray-300); border-radius: 6px; text-align:center;"
                           oninput="updateFinalScore(this)">
                </td>
                <td class="final-score-cell" data-base="${aiNum !== null ? aiNum : ''}"
                    style="text-align:center; font-weight:600; color: var(--primary);">${finalDisplay}</td>
                <td>
                    <input type="text" class="feedback-input" data-email="${student.email}"
                           value="${existingFeedback}" placeholder="Add feedback..."
                           style="width: 100%; padding: 6px 8px; border: 1px solid var(--gray-300); border-radius: 6px;">
                </td>
            </tr>
        `;
    }).join('');
}

function updateFinalScore(adjInput) {
    const row = adjInput.closest('tr');
    const cell = row.querySelector('.final-score-cell');
    const base = cell.dataset.base !== '' ? parseFloat(cell.dataset.base) : null;
    const adj = parseFloat(adjInput.value) || 0;
    cell.textContent = base !== null ? base + adj : (adj !== 0 ? adj : '—');
}

function applyGlobalAdjustment() {
    const val = document.getElementById('globalAdjustment').value;
    document.querySelectorAll('#gradeTableBody .adjustment-input').forEach(input => {
        input.value = val;
        updateFinalScore(input);
    });
}

async function saveAllGrades() {
    const type = document.getElementById('assignmentType').value;
    const assignmentId = parseInt(document.getElementById('assignmentSelect').value);
    const course = CONFIG.COURSES[state.activeCourse];

    const grades = [];
    document.querySelectorAll('#gradeTableBody tr').forEach(row => {
        const email = row.dataset.email;
        if (!email) return;

        const aiGradeStr = row.dataset.aigrade;
        const adjustmentInput = row.querySelector('.adjustment-input');
        const feedbackInput = row.querySelector('.feedback-input');
        const feedback = feedbackInput?.value || '';

        // Only save rows where the student has a grading basis (submitted) or has feedback
        if (aiGradeStr !== '' || feedback) {
            const aiGrade = aiGradeStr !== '' ? parseFloat(aiGradeStr) || 0 : 0;
            const adjustment = parseFloat(adjustmentInput?.value) || 0;
            const finalScore = aiGrade + adjustment;
            grades.push({
                email,
                type,
                assignmentId,
                grade: finalScore,
                feedback
            });
        }
    });

    if (grades.length === 0) {
        alert('No grades to save.');
        return;
    }

    const btn = document.getElementById('saveAllGradesBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    btn.disabled = true;

    try {
        const response = await fetch(course.apiUrl, {
            method: 'POST',
            redirect: 'follow',
            body: JSON.stringify({
                action: 'saveGrades',
                grades: grades
            })
        });

        const text = await response.text();
        let result;
        try { result = JSON.parse(text); } catch (e) { result = {}; }

        if (result.success) {
            btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
            await loadCourseData();
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-save"></i> Save and Close';
                btn.disabled = false;
                closeGradeEntry();
            }, 800);
        } else {
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error: ' + (result.error || 'Unknown');
            await loadCourseData();
            loadGradeTable();
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-save"></i> Save and Close';
                btn.disabled = false;
            }, 2500);
        }
    } catch (error) {
        console.error('Failed to save grades:', error);
        btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-save"></i> Save and Close';
            btn.disabled = false;
        }, 2000);
    }
}

// ============================================
// LEADERBOARD
// ============================================

async function openLeaderboard() {
    const modal = document.getElementById('leaderboardModal');
    modal.classList.add('active');

    document.getElementById('leaderboardLoading').style.display = 'block';
    document.getElementById('leaderboardContent').style.display = 'none';
    document.getElementById('leaderboardWeek').textContent = state.currentWeek;

    try {
        const allData = await loadLeaderboardData();
        const classes = buildLeaderboardClasses(allData);
        renderLeaderboard(classes);
    } catch (error) {
        console.error('Failed to load leaderboard:', error);
        document.getElementById('leaderboardLoading').innerHTML = `
            <i class="fas fa-exclamation-triangle" style="color: var(--danger);"></i>
            <p>Failed to load leaderboard data. Please try again.</p>
        `;
    }
}

function closeLeaderboard() {
    document.getElementById('leaderboardModal').classList.remove('active');
}

async function loadLeaderboardData() {
    const [hsaerRes, frcRes] = await Promise.all([
        fetch(CONFIG.COURSES.hsaer.apiUrl + '?action=all&_t=' + Date.now()),
        fetch(CONFIG.COURSES.frc.apiUrl + '?action=all&_t=' + Date.now())
    ]);
    return {
        hsaer: await hsaerRes.json(),
        frc: await frcRes.json()
    };
}

function buildLeaderboardClasses(allData) {
    const classes = [
        buildClassData('6th Hour', allData.hsaer, CONFIG.COURSES.hsaer, 'hour6', 'fa-robot', 'hsaer'),
        buildClassData('7th Hour', allData.hsaer, CONFIG.COURSES.hsaer, 'hour7', 'fa-robot', 'hsaer'),
        buildClassData('FRC', allData.frc, CONFIG.COURSES.frc, null, 'fa-cogs', 'frc')
    ];

    // Sort by completion rate descending (best first)
    classes.sort((a, b) => b.completionRate - a.completionRate);

    // Assign ranks (handle ties)
    classes.forEach((cls, i) => {
        if (i === 0) cls.rank = 1;
        else if (cls.completionRate === classes[i - 1].completionRate) cls.rank = classes[i - 1].rank;
        else cls.rank = i + 1;
    });

    return classes;
}

function buildClassData(name, rawData, courseConfig, periodFilter, icon, courseId) {
    // Filter students to this class/period
    const students = (rawData.students || []).filter(row => {
        if (periodFilter) return row[3] === periodFilter;
        return true;
    });

    const studentEmails = new Set(students.map(s => s[0]));
    const studentCount = studentEmails.size;

    // Determine which weeks have passed their Friday 3pm deadline
    const pastDeadlineWeeks = [];
    for (let week = 1; week <= state.currentWeek; week++) {
        const weekStart = new Date(CONFIG.SEMESTER_START);
        weekStart.setDate(weekStart.getDate() + (week - 1) * 7);
        const fridayDeadline = new Date(weekStart);
        fridayDeadline.setDate(fridayDeadline.getDate() + 4);
        fridayDeadline.setHours(15, 0, 0, 0);
        if (new Date() > fridayDeadline) {
            pastDeadlineWeeks.push(week);
        }
    }

    // Build lookup sets for submitted work
    const completedDeliverables = new Set();
    (rawData.deliverables || []).forEach(d => {
        if (studentEmails.has(d[0]) && d[7] === 'completed') {
            completedDeliverables.add(d[0] + '-' + d[2]);
        }
    });

    // Calculate pending items per week
    let totalDueItems = 0;
    let totalSubmittedItems = 0;
    const pendingByWeek = [];

    pastDeadlineWeeks.forEach(week => {
        const weekItems = [];

        const dueDeliverable = deliverableForWeek(courseId, week);
        if (dueDeliverable !== null && isDeliverableRequired(courseId, dueDeliverable.id)) {
            let deliverablePending = 0;
            studentEmails.forEach(email => {
                if (!completedDeliverables.has(email + '-' + dueDeliverable.id)) deliverablePending++;
            });
            weekItems.push({ type: 'Deliverable', pending: deliverablePending });
            totalDueItems += studentCount;
            totalSubmittedItems += (studentCount - deliverablePending);
        }

        if (weekItems.length > 0) {
            pendingByWeek.push({ week, items: weekItems });
        }
    });

    const totalPending = totalDueItems - totalSubmittedItems;
    const completionRate = totalDueItems > 0
        ? Math.round((totalSubmittedItems / totalDueItems) * 1000) / 10
        : 100;

    return {
        name, icon, studentCount,
        totalPendingItems: totalPending,
        completionRate,
        pendingByWeek
    };
}

function renderLeaderboard(classes) {
    const content = document.getElementById('leaderboardContent');
    const winner = classes[0];

    const rankIcons = { 1: 'fa-trophy', 2: 'fa-medal', 3: 'fa-award' };
    const rankColors = { 1: '#F59E0B', 2: '#9CA3AF', 3: '#D97706' };

    function getRingColor(rate) {
        if (rate >= 90) return '#10b981';
        if (rate >= 70) return '#6366f1';
        if (rate >= 50) return '#f59e0b';
        return '#ef4444';
    }

    function getPendingClass(count) {
        if (count === 0) return 'pending-zero';
        if (count <= 2) return 'pending-low';
        if (count <= 5) return 'pending-med';
        return 'pending-high';
    }

    const circumference = 2 * Math.PI * 52; // r=52

    // Winner Banner
    let html = `
        <div class="leaderboard-winner-banner">
            <div class="winner-trophy"><i class="fas fa-trophy"></i></div>
            <div class="winner-text">
                <strong>${winner.name} is leading the pack!</strong>
                <span>${winner.completionRate}% completion rate &middot; Only ${winner.totalPendingItems} pending items</span>
            </div>
        </div>
    `;

    // Podium Cards
    html += '<div class="leaderboard-podium">';
    classes.forEach(cls => {
        const offset = circumference - (cls.completionRate / 100) * circumference;
        const ringColor = getRingColor(cls.completionRate);
        html += `
            <div class="podium-card podium-rank-${cls.rank}">
                <div class="podium-medal"><i class="fas ${rankIcons[cls.rank]}"></i></div>
                <div class="podium-rank-label">#${cls.rank}</div>
                <h3 class="podium-class-name">
                    <i class="fas ${cls.icon}" style="font-size: 14px; color: var(--gray-400); margin-right: 4px;"></i>
                    ${cls.name}
                </h3>
                <div class="podium-ring">
                    <svg viewBox="0 0 120 120">
                        <circle class="ring-bg" cx="60" cy="60" r="52"/>
                        <circle class="ring-fill" cx="60" cy="60" r="52"
                                style="stroke: ${ringColor}; stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset}"/>
                    </svg>
                    <div class="ring-label" style="color: ${ringColor};">${cls.completionRate}%</div>
                </div>
                <div class="podium-stats">
                    <div class="podium-stat">
                        <span class="stat-num">${cls.totalPendingItems}</span>
                        <span class="stat-desc">pending</span>
                    </div>
                    <div class="podium-stat">
                        <span class="stat-num">${cls.studentCount}</span>
                        <span class="stat-desc">students</span>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';

    // Week-by-Week Breakdown Table
    const allWeeks = [];
    classes.forEach(cls => {
        cls.pendingByWeek.forEach(w => {
            if (!allWeeks.includes(w.week)) allWeeks.push(w.week);
        });
    });
    allWeeks.sort((a, b) => a - b);

    // Display order: always 6th Hour, 7th Hour, FRC regardless of rank
    const displayOrder = ['6th Hour', '7th Hour', 'FRC'];
    const orderedClasses = displayOrder.map(name => classes.find(c => c.name === name)).filter(Boolean);

    html += `
        <div class="leaderboard-breakdown">
            <h3><i class="fas fa-list-ol" style="color: var(--primary);"></i> Pending Submissions by Week</h3>
            <table class="breakdown-table">
                <thead>
                    <tr>
                        <th style="text-align: left;">Item</th>
                        ${orderedClasses.map(c => `<th>${c.name}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
    `;

    allWeeks.forEach(week => {
        html += `<tr class="week-header"><td colspan="${orderedClasses.length + 1}">Week ${week}</td></tr>`;

        // Deliverable row
        const delCounts = orderedClasses.map(cls => {
            const weekData = cls.pendingByWeek.find(w => w.week === week);
            const item = weekData ? weekData.items.find(i => i.type === 'Deliverable') : null;
            return item !== undefined && item !== null ? item.pending : null;
        });

        if (delCounts.some(c => c !== null)) {
            const validDels = delCounts.filter(c => c !== null);
            const minDel = Math.min(...validDels);

            html += `<tr>
                <td><i class="fas fa-file-alt" style="color: var(--gray-400); margin-right: 6px;"></i>Deliverable</td>
                ${delCounts.map(count => {
                    if (count === null) return '<td style="color: var(--gray-300);">—</td>';
                    const isBest = count === minDel && validDels.filter(c => c === minDel).length < validDels.length;
                    return `<td${isBest ? ' class="best-in-row"' : ''}>
                        <span class="pending-pill ${getPendingClass(count)}">${count}</span>
                    </td>`;
                }).join('')}
            </tr>`;
        }
    });

    html += '</tbody></table></div>';

    content.innerHTML = html;
    document.getElementById('leaderboardLoading').style.display = 'none';
    content.style.display = 'block';
}

// ============================================
// WEEK SETTINGS MODAL
// ============================================
async function openWeekSettings() {
    const modal = document.getElementById('weekSettingsModal');
    if (!modal) return;

    // Show auto-calculated week
    const now = new Date();
    const diffWeeks = Math.floor(Math.floor((now - CONFIG.SEMESTER_START) / (1000 * 60 * 60 * 24)) / 7) + 1;
    const autoWeek = Math.min(Math.max(1, diffWeeks), 38);
    document.getElementById('autoWeekDisplay').textContent = autoWeek;

    // Set override dropdown
    const overrideSelect = document.getElementById('weekOverrideSelect');
    overrideSelect.value = weekSettings.currentWeekOverride !== null ? weekSettings.currentWeekOverride : '';

    // Populate deliverables, quiz toggles, and version fields for all three tracks
    for (const courseId of ['hsaer', '8aer', 'dbl']) {
        // Deliverables table (keyed by deliverable ID)
        const deliverables = TRACK_DELIVERABLES[courseId] || [];
        const delTbody = document.getElementById(courseId + 'DeliverableSettingsBody');
        delTbody.innerHTML = '';
        if (deliverables.length === 0) {
            delTbody.innerHTML = `<tr><td colspan="2" style="padding: 10px; color: var(--gray-400); font-style: italic; font-size: 13px; text-align: center;">Not yet configured</td></tr>`;
        } else {
            for (const d of deliverables) {
                const skipDel = (weekSettings[courseId].skipDeliverables || []).includes(d.id);
                delTbody.innerHTML += `<tr>
                    <td style="padding: 8px 10px; font-weight: 600; white-space: nowrap;">${d.label}</td>
                    <td style="padding: 8px 10px; text-align: center;">
                        <input type="checkbox" id="skipDel_${courseId}_${d.id}" ${skipDel ? 'checked' : ''}>
                    </td>
                </tr>`;
            }
        }

        // Quiz toggle + key selector (HS AE&R and 8AER only)
        if (courseId === 'hsaer' || courseId === '8aer') {
            const suffix = courseId === '8aer' ? '_8aer' : '';
            const quizToggle = document.getElementById('quizEnabledToggle' + suffix);
            if (quizToggle) quizToggle.checked = weekSettings[courseId].quizEnabled || false;
            const quizKeySelect = document.getElementById('quizKeySelect' + suffix);
            if (quizKeySelect) quizKeySelect.value = weekSettings[courseId].quizKey || 'claw';
        }

        // Version display fields
        const codeVersionEl = document.getElementById('codeVersion_' + courseId);
        if (codeVersionEl) codeVersionEl.textContent = CONFIG.COURSES[courseId].currentAppVersion || '—';
        const hiddenEl = document.getElementById('expectedVersion_' + courseId);
        if (hiddenEl) hiddenEl.value = weekSettings[courseId]?.expectedVersion || '';
    }

    modal.classList.add('active');

    // Fetch backend versions for all three tracks in parallel
    await Promise.all(['hsaer', '8aer', 'dbl'].map(async courseId => {
        try {
            const cfg = await fetch(CONFIG.COURSES[courseId].apiUrl + '?action=getConfig&_t=' + Date.now()).then(r => r.json());
            const backendEl = document.getElementById('backendVersion_' + courseId);
            const current   = CONFIG.COURSES[courseId].currentAppVersion;
            const stored    = cfg.expectedVersion || '(not set)';
            if (backendEl) {
                backendEl.textContent = stored;
                backendEl.style.color = (cfg.expectedVersion && cfg.expectedVersion === current) ? 'var(--success)' : 'var(--danger)';
            }
        } catch(e) {
            const el = document.getElementById('backendVersion_' + courseId);
            if (el) { el.textContent = 'fetch failed'; el.style.color = 'var(--danger)'; }
        }
    }));
}

function setExpectedVersion(courseId) {
    const current = CONFIG.COURSES[courseId].currentAppVersion;
    const hiddenEl   = document.getElementById('expectedVersion_' + courseId);
    const backendEl  = document.getElementById('backendVersion_' + courseId);
    if (hiddenEl)  hiddenEl.value    = current;
    if (backendEl) { backendEl.textContent = current; backendEl.style.color = 'var(--success)'; }
}

function closeWeekSettings() {
    document.getElementById('weekSettingsModal').classList.remove('active');
}

async function applyWeekSettings() {
    // Current week override
    const overrideVal = document.getElementById('weekOverrideSelect').value;
    weekSettings.currentWeekOverride = overrideVal ? parseInt(overrideVal) : null;

    // Read DOM values for all three tracks (modal renders all simultaneously)
    for (const courseId of ['hsaer', '8aer', 'dbl']) {
        // Deliverables (keyed by deliverable ID)
        weekSettings[courseId].skipDeliverables = [];
        for (const d of (TRACK_DELIVERABLES[courseId] || [])) {
            if (document.getElementById(`skipDel_${courseId}_${d.id}`)?.checked) weekSettings[courseId].skipDeliverables.push(d.id);
        }

        weekSettings[courseId].expectedVersion = document.getElementById(`expectedVersion_${courseId}`)?.value.trim() || '';

        if (courseId === 'hsaer' || courseId === '8aer') {
            const suffix = courseId === '8aer' ? '_8aer' : '';
            weekSettings[courseId].quizEnabled = document.getElementById('quizEnabledToggle' + suffix)?.checked || false;
            weekSettings[courseId].quizKey     = document.getElementById('quizKeySelect' + suffix)?.value || 'claw';
        }
    }

    saveWeekSettings();
    calculateCurrentWeek();

    // Save all three tracks to their respective backends in parallel
    const saveBtn = document.querySelector('#weekSettingsModal .btn-primary');
    const originalHTML = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    saveBtn.disabled = true;

    try {
        await Promise.all(['hsaer', '8aer', 'dbl'].map(courseId => {
            const body = {
                action: 'setConfig',
                token: CONFIG.TEACHER_TOKEN,
                skipDeliverableWeeks: weekSettings[courseId].skipDeliverables,
                expectedVersion:      weekSettings[courseId].expectedVersion
                // deliverableDueDates removed — now driven by schedule-data.json
            };
            if (courseId === 'hsaer' || courseId === '8aer') {
                body.quizEnabled = weekSettings[courseId].quizEnabled;
                body.quizKey     = weekSettings[courseId].quizKey || 'claw';
            }
            return fetch(CONFIG.COURSES[courseId].apiUrl, { method: 'POST', body: JSON.stringify(body) });
        }));
        saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        setTimeout(() => {
            saveBtn.innerHTML = originalHTML;
            saveBtn.disabled = false;
            closeWeekSettings();
            if (state.rawData) {
                state.students = processStudentData(state.rawData);
                renderStudentTable();
                updateStats();
            }
        }, 1000);
    } catch(e) {
        saveBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Backend error — saved locally only';
        saveBtn.disabled = false;
        setTimeout(() => { saveBtn.innerHTML = originalHTML; closeWeekSettings(); }, 2500);
    }
}

// ============================================
// DESIGN BRIEF AI GRADER
// ============================================

async function openD0Grader(email, content, studentName) {
    const overlay = document.getElementById('designBriefOverlay');
    const frame   = document.getElementById('designBriefFrame');
    const panel   = document.getElementById('designBriefGradesPanel');
    const subtitle = document.getElementById('designBriefSubtitle');

    subtitle.textContent = studentName + ' — Career Ready Practices Reflection';
    frame.src = 'about:blank';
    frame.style.display = 'none';
    overlay.style.display = 'flex';

    panel.innerHTML = `<div style="padding:20px;color:var(--gray-500);">
        <i class="fas fa-spinner fa-spin"></i> Grading with AI…</div>`;

    try {
        const course = CONFIG.COURSES['hsaer'];
        const res = await fetch(course.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: 'gradeDesignBrief', token: CONFIG.TEACHER_TOKEN, email, content, deliverableId: 0 })
        });
        const data = await res.json();
        if (data.success) {
            panel.innerHTML = renderBriefGradesPanel(email, 0, data.grades);
        } else {
            panel.innerHTML = `<div style="padding:20px;color:var(--danger);">Error: ${data.error || 'Unknown error'}</div>`;
        }
    } catch(e) {
        panel.innerHTML = `<div style="padding:20px;color:var(--danger);">Network error: ${e.message}</div>`;
    }
}

async function openDesignBriefGrader(email, deliverableId, docUrl, deliverableTitle, studentName) {
    const overlay = document.getElementById('designBriefOverlay');
    const frame   = document.getElementById('designBriefFrame');
    const panel   = document.getElementById('designBriefGradesPanel');
    const subtitle = document.getElementById('designBriefSubtitle');

    // Extract doc ID for the preview URL
    const idMatch = docUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const previewUrl = idMatch
        ? 'https://docs.google.com/document/d/' + idMatch[1] + '/preview'
        : docUrl;

    subtitle.textContent = studentName + ' — ' + deliverableTitle;
    frame.src = previewUrl;
    panel.innerHTML = `
        <div style="text-align:center; padding:48px 20px; color:var(--gray-400);">
            <i class="fas fa-spinner fa-spin" style="font-size:28px; margin-bottom:14px; display:block;"></i>
            <p style="font-size:14px;">Running AI grading…</p>
            <p style="font-size:12px; margin-top:6px; color:var(--gray-300);">This may take 10–20 seconds</p>
        </div>`;
    overlay.style.display = 'block';

    try {
        const course = CONFIG.COURSES['hsaer'];
        const res = await fetch(course.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ action: 'gradeDesignBrief', token: CONFIG.TEACHER_TOKEN, email, docUrl, deliverableId })
        });
        const data = await res.json();
        if (data.success) {
            panel.innerHTML = renderBriefGradesPanel(email, deliverableId, data.grades);
        } else {
            panel.innerHTML = `<div style="padding:20px; color:#b91c1c; background:#fef2f2; border-radius:8px; font-size:13px;">
                <strong>Error:</strong> ${data.error || 'Unknown error'}</div>`;
        }
    } catch(err) {
        panel.innerHTML = `<div style="padding:20px; color:#b91c1c; background:#fef2f2; border-radius:8px; font-size:13px;">
            <strong>Network error:</strong> ${err.message}</div>`;
    }
}

function closeDesignBriefGrader() {
    const overlay = document.getElementById('designBriefOverlay');
    overlay.style.display = 'none';
    document.getElementById('designBriefFrame').src = 'about:blank';
}

function renderBriefGradesPanel(email, deliverableId, grades) {
    const criteria = BRIEF_CRITERIA[deliverableId] || [];
    const maxTotal  = criteria.reduce((s, c) => s + c.max, 0);
    let aiTotal = 0;
    let hasManual = false;

    const rows = criteria.map(c => {
        const g = grades[c.id] || {};
        const isManual = g.score === null || g.score === undefined;
        const scoreVal = isManual ? '' : Math.min(Number(g.score) || 0, c.max);
        if (!isManual) aiTotal += Number(scoreVal);
        else hasManual = true;

        const escapedFeedback = (g.feedback||'').replace(/&/g,'&amp;').replace(/</g,'&lt;');
        return `<div style="border:1px solid var(--gray-200); border-radius:6px; padding:11px 12px; margin-bottom:9px; ${isManual ? 'background:#fffbeb; border-color:#fbbf24;' : ''}">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:${g.feedback ? '7px' : '0'};">
                <span style="font-size:12px; font-weight:700; color:var(--gray-700);">${c.label}</span>
                <div style="display:flex; align-items:center; gap:4px; flex-shrink:0;">
                    <input type="number" class="brief-score-input" data-id="${c.id}" data-max="${c.max}"
                           data-label="${c.label}"
                           value="${scoreVal}" min="0" max="${c.max}" step="1"
                           oninput="tallyBriefScore()"
                           style="width:44px; padding:3px 6px; border:1px solid ${isManual ? '#fbbf24' : 'var(--gray-300)'}; border-radius:4px; text-align:center; font-size:13px; font-weight:700;">
                    <span style="font-size:12px; color:var(--gray-400);">/ ${c.max}</span>
                </div>
            </div>
            ${g.feedback ? `<textarea class="brief-feedback-text" data-id="${c.id}"
                style="width:100%; font-size:12px; color:var(--gray-600); line-height:1.5; border:1px solid var(--gray-200); border-radius:4px; padding:5px 7px; resize:vertical; background:var(--gray-50); box-sizing:border-box;"
                rows="3">${escapedFeedback}</textarea>` : ''}
            ${isManual ? `<p style="font-size:11px; color:#92400e; margin-top:5px; margin-bottom:0;"><i class="fas fa-exclamation-triangle"></i> Manually verify</p>` : ''}
        </div>`;
    }).join('');

    const escapedEmail = email.replace(/'/g, "\\'");
    return `
        <div style="margin-bottom:14px; padding:10px 12px; background:var(--gray-50); border-radius:6px; border:1px solid var(--gray-200); font-size:12px; color:var(--gray-600); line-height:1.5;">
            <strong style="color:var(--gray-700);">AI-suggested scores.</strong>
            Review the doc on the left and adjust any score before saving.
            ${hasManual ? '<br><span style="color:#92400e;"><i class="fas fa-exclamation-triangle"></i> Yellow rows require manual verification (images).</span>' : ''}
        </div>
        ${rows}
        <div style="border-top:2px solid var(--gray-200); padding-top:14px; margin-top:4px; display:flex; justify-content:space-between; align-items:center;">
            <div>
                <span style="font-size:12px; color:var(--gray-500);">Total: </span>
                <span id="briefScoreTotal" style="font-size:22px; font-weight:900; color:var(--primary);">${aiTotal}</span>
                <span style="font-size:13px; color:var(--gray-400);"> / ${maxTotal}</span>
            </div>
            <button onclick="applyAndSaveBriefGrade('${escapedEmail}', ${deliverableId})"
                    style="padding:9px 22px; background:var(--primary); color:white; border:none; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">
                <i class="fas fa-save"></i> Apply Grade & Save
            </button>
        </div>`;
}

function tallyBriefScore() {
    let total = 0;
    document.querySelectorAll('.brief-score-input').forEach(inp => {
        total += Math.min(parseInt(inp.value) || 0, parseInt(inp.dataset.max) || 0);
    });
    const el = document.getElementById('briefScoreTotal');
    if (el) el.textContent = total;
}

async function applyAndSaveBriefGrade(email, deliverableId) {
    let total = 0;
    const lines = [];
    document.querySelectorAll('.brief-score-input').forEach(inp => {
        const score = Math.min(parseInt(inp.value) || 0, parseInt(inp.dataset.max) || 0);
        total += score;
        const label    = inp.dataset.label || inp.dataset.id;
        const max      = inp.dataset.max;
        const feedbackEl = document.querySelector(`.brief-feedback-text[data-id="${inp.dataset.id}"]`);
        const feedback = feedbackEl ? feedbackEl.value.trim() : '';
        lines.push(`${label}: ${score}/${max}${feedback ? ' — ' + feedback : ''}`);
    });
    const feedbackText = lines.join('\n') + `\n\nTotal: ${total} pts`;

    const gradeInput = document.querySelector(`.grade-input[data-type="deliverable"][data-id="${deliverableId}"][data-email="${email}"]`);
    if (gradeInput) gradeInput.value = total;

    const feedbackInput = document.querySelector(`.feedback-input[data-type="deliverable"][data-id="${deliverableId}"][data-email="${email}"]`);
    if (feedbackInput) feedbackInput.value = feedbackText;

    closeDesignBriefGrader();
    await saveStudentGrades();
    showToast(`Design Brief grade saved: ${total} pts`);
}
