// Teacher Portal - Dashboard for viewing student portfolios
// Supports both Robotics and FRC Portfolio systems

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    // App version - update when deploying changes
    VERSION: 'v2.9.11',

    // Google OAuth Client ID (same as student portals)
    GOOGLE_CLIENT_ID: '1002661691088-8g0dskdehhmgc8jigbua15l3ih7td4ka.apps.googleusercontent.com',

    // Teacher email(s) - add your email here
    TEACHER_EMAILS: [
        'mbombich@vicksburgschools.org',
        // Add more teacher emails as needed
    ],

    // Course configurations
    COURSES: {
        robotics: {
            name: 'Robotics Portfolio',
            apiUrl: 'https://script.google.com/macros/s/AKfycbxVW2ygtieDM8XBFHwKF9XtDYL8aV_NrXOPOc0dfC8SZtDo4iJNB6VfUeBkUdA2rSeY/exec',
            hasTeams: false,
            totalDeliverables: 9,
            totalReflections: 9,
            totalPoints: 800,
            deliverablePoints: { 1: 50, 2: 75, 3: 40, 4: 50, 5: 75, 6: 50, 7: 50, 8: 75, 9: 100 }
        },
        frc: {
            name: 'FRC Portfolio',
            apiUrl: 'https://script.google.com/macros/s/AKfycbwAvmEvw57yxtPJUSk18msLpon4zgOOV592X9GlUzYsBk4x1u0C3nRrRAvt-X_AJ-Uv/exec',
            hasTeams: true,
            teams: ['drivetrain', 'intake', 'shooter', 'climber', 'autonomous', 'integration'],
            totalDeliverables: 10,
            totalReflections: 9,
            totalPoints: 900,
            deliverablePoints: { 1: 50, 2: 50, 3: 75, 4: 50, 5: 75, 6: 50, 7: 50, 8: 75, 9: 100, 10: 100 }
        }
    },

    // Semester start date
    SEMESTER_START: new Date('2026-02-02')
};

// ============================================
// APPLICATION STATE
// ============================================
let state = {
    teacherEmail: null,
    activeCourse: 'robotics',
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
    state.currentWeek = Math.min(Math.max(1, diffWeeks), 9);
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
        const response = await fetch(course.apiUrl + '?action=all');
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

        // Count reflections (from Weekly Reflections sheet + drafts from JSON)
        let submittedReflections = 0;
        let draftReflections = 0;
        let ungradedReflections = 0;

        // Count from sheet data
        if (state.rawData.reflections) {
            const studentReflections = state.rawData.reflections.filter(r => r[0] === email);
            submittedReflections = studentReflections.length;
            // Count ungraded (column L = index 11 is Grade)
            ungradedReflections = studentReflections.filter(r => !r[11] && r[11] !== 0).length;
        }

        // Count drafts from JSON
        if (fullState && fullState.weeklyReflections) {
            Object.values(fullState.weeklyReflections).forEach(r => {
                if (!r.submitted && (r.contributions?.length > 0 || r.challenges || r.solutions)) {
                    draftReflections++;
                }
            });
        }

        // Count deliverables
        let completedDeliverables = 0;
        let draftDeliverables = 0;
        let ungradedDeliverables = 0;

        if (state.rawData.deliverables) {
            const studentDeliverables = state.rawData.deliverables.filter(
                d => d[0] === email && d[7] === 'completed'
            );
            completedDeliverables = studentDeliverables.length;
            // Count ungraded (column J = index 9 is Grade)
            ungradedDeliverables = studentDeliverables.filter(d => !d[9] && d[9] !== 0).length;
        }

        if (fullState && fullState.deliverables) {
            Object.values(fullState.deliverables).forEach(d => {
                if (d.status === 'in-progress' && d.content) {
                    draftDeliverables++;
                }
            });
        }

        // Calculate points using actual grades when available
        let points = 0;
        if (state.rawData.reflections) {
            state.rawData.reflections
                .filter(r => r[0] === email)
                .forEach(r => {
                    // Use teacher grade (column L = index 11) if available, otherwise default 20
                    const grade = r[11];
                    points += (grade !== '' && grade !== undefined && grade !== null) ? Number(grade) : 20;
                });
        }
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

        // Determine status - count reflections and deliverables as expected if past their Friday 3pm deadline
        let expectedReflections = 0;
        let expectedDeliverables = 0;
        for (let week = 1; week <= Math.min(state.currentWeek, course.totalReflections); week++) {
            // Calculate Friday 3pm deadline for this week
            const weekStart = new Date(CONFIG.SEMESTER_START);
            weekStart.setDate(weekStart.getDate() + (week - 1) * 7);
            const fridayDeadline = new Date(weekStart);
            fridayDeadline.setDate(fridayDeadline.getDate() + 4); // Friday (Mon=0, Tue=1, ..., Fri=4)
            fridayDeadline.setHours(15, 0, 0, 0); // 3pm

            if (new Date() > fridayDeadline) {
                expectedReflections++;
                // Deliverables are due same week (1-9 match weeks 1-9)
                if (week <= course.totalDeliverables) {
                    expectedDeliverables++;
                }
            }
        }
        const reflectionsBehind = expectedReflections - submittedReflections;
        const deliverablesBehind = expectedDeliverables - completedDeliverables;
        const totalBehind = reflectionsBehind + deliverablesBehind;

        let status = 'on-track';
        if (totalBehind >= 4) status = 'very-behind';
        else if (totalBehind >= 1) status = 'behind';

        const progress = Math.round((points / course.totalPoints) * 100);

        return {
            email,
            name,
            team,
            period,
            submittedReflections,
            draftReflections,
            ungradedReflections,
            totalReflections: submittedReflections + draftReflections,
            completedDeliverables,
            draftDeliverables,
            ungradedDeliverables,
            ungradedTotal: ungradedReflections + ungradedDeliverables,
            points,
            progress,
            status,
            fullState
        };
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
                ${s.submittedReflections}/${course.totalReflections}
                ${s.draftReflections > 0 ? `<span style="color: var(--warning); font-size: 12px;"> (+${s.draftReflections} draft)</span>` : ''}
            </td>
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
                ${s.ungradedTotal > 0 ? `<span class="status-badge" style="background: #fef3c7; color: #92400e; margin-left: 4px;" title="${s.ungradedTotal} item(s) need grading"><i class="fas fa-pen"></i> ${s.ungradedTotal}</span>` : ''}
            </td>
        </tr>
    `).join('');

    // Add click handlers
    tbody.querySelectorAll('tr').forEach(row => {
        row.addEventListener('click', () => openStudentDetail(row.dataset.email));
    });
}

function updateStats(students) {
    const course = CONFIG.COURSES[state.activeCourse];

    document.getElementById('totalStudents').textContent = students.length;

    // Submitted this week
    const submittedThisWeek = students.filter(s =>
        s.submittedReflections >= state.currentWeek
    ).length;
    document.getElementById('submittedThisWeek').textContent = submittedThisWeek;

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

    document.getElementById('modalReflections').textContent = student.submittedReflections;
    document.getElementById('modalDeliverables').textContent = student.completedDeliverables;
    document.getElementById('modalPoints').textContent = student.points;

    // Reflections panel
    const reflectionsPanel = document.getElementById('reflectionsPanel');
    reflectionsPanel.innerHTML = '';

    for (let week = 1; week <= course.totalReflections; week++) {
        // Check submitted reflections
        const submitted = state.rawData.reflections?.find(r => r[0] === email && r[2] == week);

        // Check draft from JSON
        const draft = student.fullState?.weeklyReflections?.[week];
        const hasDraft = draft && !draft.submitted && (draft.contributions?.length > 0 || draft.challenges);

        if (submitted) {
            const selfAssessment = submitted[10]; // Column K - Self Assessment (rubric total /16)
            const existingGrade = draft?.teacherGrade ?? submitted[11] ?? '';
            const existingFeedback = draft?.teacherFeedback ?? submitted[12] ?? '';
            const gradedAt = submitted[13] || '';
            const submittedAt = submitted[8] || '';
            const isUngraded = existingGrade === '' || existingGrade === null || existingGrade === undefined;
            const isResubmitted = !isUngraded && gradedAt && submittedAt && new Date(submittedAt) > new Date(gradedAt);
            const contentId = `reflection-content-${week}`;
            const fullContent = `<strong>Contributions:</strong><br>${(submitted[3] || '').replace(/\n/g, '<br>')}${submitted[5] ? `<br><br><strong>Challenges:</strong> ${submitted[5]}` : ''}${submitted[6] ? `<br><strong>Solutions:</strong> ${submitted[6]}` : ''}`;
            const needsExpand = fullContent.length > 400;
            const statusLabel = isResubmitted ? 'Resubmitted' : (isUngraded ? 'Needs Grading' : 'Graded');
            const statusClass = isResubmitted ? 'status-behind' : (isUngraded ? 'status-behind' : 'status-on-track');
            const borderStyle = isResubmitted ? 'border-left: 4px solid #e53935;' : (isUngraded ? 'border-left: 4px solid var(--warning);' : '');
            reflectionsPanel.innerHTML += `
                <div class="item-card" style="${borderStyle}">
                    <div class="item-header">
                        <span class="item-title">Week ${week}</span>
                        <span class="item-status status-badge ${statusClass}">${statusLabel}</span>
                        ${selfAssessment ? `<span style="margin-left: auto; font-size: 12px; color: var(--gray-600);">Self: ${selfAssessment}/16</span>` : ''}
                    </div>
                    <div class="item-content" id="${contentId}" style="${needsExpand ? 'max-height: 150px; overflow: hidden; position: relative;' : ''}">
                        ${fullContent}
                    </div>
                    ${needsExpand ? `<button onclick="toggleContent('${contentId}')" style="margin-top: 8px; padding: 4px 12px; background: var(--gray-100); border: 1px solid var(--gray-300); border-radius: 4px; cursor: pointer; font-size: 12px; color: var(--primary);">Show More</button>` : ''}
                    <div class="grade-section" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--gray-200);">
                        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 8px;">
                            <label style="font-size: 13px; font-weight: 500;">Grade:</label>
                            <input type="number" class="grade-input" data-type="reflection" data-id="${week}" data-email="${email}"
                                   value="${existingGrade}" min="0" max="20" step="1"
                                   style="width: 60px; padding: 4px 8px; border: 1px solid var(--gray-300); border-radius: 4px;">
                            <span style="color: var(--gray-500); font-size: 12px;">/ 20 pts</span>
                        </div>
                        <textarea class="feedback-input" data-type="reflection" data-id="${week}" data-email="${email}"
                                  placeholder="Feedback for student..."
                                  style="width: 100%; padding: 8px; border: 1px solid var(--gray-300); border-radius: 4px; font-size: 13px; resize: vertical; min-height: 60px;">${existingFeedback}</textarea>
                    </div>
                </div>
            `;
        } else if (hasDraft) {
            const contributions = (draft.contributions || [])
                .map(c => `${c.date}: ${c.task}`)
                .join('<br>');
            reflectionsPanel.innerHTML += `
                <div class="item-card" style="border-left: 3px solid var(--warning);">
                    <div class="item-header">
                        <span class="item-title">Week ${week}</span>
                        <span class="item-status status-badge status-behind">Draft</span>
                    </div>
                    <div class="item-content">
                        <strong>Contributions:</strong><br>
                        ${contributions || '<em>None yet</em>'}
                        ${draft.challenges ? `<br><br><strong>Challenges:</strong> ${draft.challenges}` : ''}
                        ${draft.solutions ? `<br><strong>Solutions:</strong> ${draft.solutions}` : ''}
                    </div>
                </div>
            `;
        } else if (week <= state.currentWeek) {
            reflectionsPanel.innerHTML += `
                <div class="item-card" style="opacity: 0.5;">
                    <div class="item-header">
                        <span class="item-title">Week ${week}</span>
                        <span class="item-status status-badge status-very-behind">Missing</span>
                    </div>
                    <div class="item-content"><em>No submission</em></div>
                </div>
            `;
        }
    }

    if (reflectionsPanel.innerHTML === '') {
        reflectionsPanel.innerHTML = '<p class="empty-state">No reflections yet.</p>';
    }

    // Deliverables panel
    const deliverablesPanel = document.getElementById('deliverablesPanel');
    deliverablesPanel.innerHTML = '';

    for (let id = 1; id <= course.totalDeliverables; id++) {
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
            const fullContent = content + selfAssessmentText + linksText;
            const needsExpand = content.length > 300;
            const previewContent = needsExpand ? content.substring(0, 300) + '...' + selfAssessmentText + linksText : fullContent;
            const dStatusLabel = isResubmitted ? 'Resubmitted' : (isUngraded ? 'Needs Grading' : 'Graded');
            const dStatusClass = isResubmitted ? 'status-behind' : (isUngraded ? 'status-behind' : 'status-on-track');
            const dBorderStyle = isResubmitted ? 'border-left: 4px solid #e53935;' : (isUngraded ? 'border-left: 4px solid var(--warning);' : '');
            deliverablesPanel.innerHTML += `
                <div class="item-card" style="${dBorderStyle}">
                    <div class="item-header">
                        <span class="item-title">${submitted[3] || `Deliverable ${id}`}</span>
                        <span class="item-status status-badge ${dStatusClass}">${dStatusLabel}</span>
                    </div>
                    <div class="item-content" id="${contentId}" data-expanded="false">
                        ${previewContent}
                    </div>
                    ${needsExpand ? `<button onclick="toggleDeliverableContent('${contentId}', ${id})" style="margin-top: 8px; padding: 4px 12px; background: var(--gray-100); border: 1px solid var(--gray-300); border-radius: 4px; cursor: pointer; font-size: 12px; color: var(--primary);">Show More</button>` : ''}
                    <div class="grade-section" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--gray-200);">
                        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 8px;">
                            <label style="font-size: 13px; font-weight: 500;">Grade:</label>
                            <input type="number" class="grade-input" data-type="deliverable" data-id="${id}" data-email="${email}"
                                   value="${existingGrade}" min="0" max="${maxPoints}" step="1"
                                   style="width: 60px; padding: 4px 8px; border: 1px solid var(--gray-300); border-radius: 4px;">
                            <span style="color: var(--gray-500); font-size: 12px;">/ ${maxPoints} pts</span>
                        </div>
                        <textarea class="feedback-input" data-type="deliverable" data-id="${id}" data-email="${email}"
                                  placeholder="Feedback for student..."
                                  style="width: 100%; padding: 8px; border: 1px solid var(--gray-300); border-radius: 4px; font-size: 13px; resize: vertical; min-height: 60px;">${existingFeedback}</textarea>
                    </div>
                </div>
            `;
        } else if (draft && draft.status === 'in-progress' && draft.content) {
            deliverablesPanel.innerHTML += `
                <div class="item-card" style="border-left: 3px solid var(--warning);">
                    <div class="item-header">
                        <span class="item-title">Deliverable ${id}</span>
                        <span class="item-status status-badge status-behind">In Progress</span>
                    </div>
                    <div class="item-content">
                        ${(draft.content || '').substring(0, 300)}${draft.content?.length > 300 ? '...' : ''}
                    </div>
                </div>
            `;
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

    // Show modal
    document.getElementById('studentModal').classList.add('active');

    // Reset to first tab
    document.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.detail-panel').forEach(p => p.classList.remove('active'));
    document.querySelector('.detail-tab').classList.add('active');
    document.getElementById('reflectionsPanel').classList.add('active');
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

        element.innerHTML = content + selfAssessmentText + linksText;
        element.dataset.expanded = 'true';
        button.textContent = 'Show Less';
    } else {
        const submitted = state.rawData.deliverables?.find(d => d[2] == deliverableId);
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

    // Build headers based on type filter
    let headers = ['Name', 'Period'];
    if (typeFilter === 'reflections' || typeFilter === 'all') {
        for (let w = 1; w <= course.totalReflections; w++) {
            headers.push(`W${w}`);
        }
    }
    if (typeFilter === 'deliverables' || typeFilter === 'all') {
        for (let d = 1; d <= course.totalDeliverables; d++) {
            headers.push(`D${d}`);
        }
    }
    headers.push('Total');

    thead.innerHTML = `<tr>${headers.map(h => `<th style="position: sticky; top: 0; background: var(--gray-100); padding: 8px; text-align: left; font-size: 12px;">${h}</th>`).join('')}</tr>`;

    // Build rows
    tbody.innerHTML = students.map(student => {
        const email = student.email;
        let row = [`<td style="padding: 6px 8px; white-space: nowrap;">${student.name}</td>`];
        row.push(`<td style="padding: 6px 8px;">${formatPeriod(student.period)}</td>`);

        let total = 0;
        let maxTotal = 0;

        // Reflection grades
        if (typeFilter === 'reflections' || typeFilter === 'all') {
            for (let w = 1; w <= course.totalReflections; w++) {
                const reflection = student.fullState?.weeklyReflections?.[w];
                const submitted = state.rawData.reflections?.find(r => r[0] === email && r[2] == w);
                const grade = reflection?.teacherGrade ?? submitted?.[11] ?? '';

                if (grade !== '' && grade !== undefined) {
                    total += parseFloat(grade) || 0;
                }
                if (submitted) {
                    maxTotal += 20; // 20 pts per reflection
                }

                const cellStyle = grade !== '' ? '' : (submitted ? 'color: var(--warning);' : 'color: var(--gray-300);');
                row.push(`<td style="padding: 6px 8px; text-align: center; ${cellStyle}">${grade !== '' && grade !== undefined ? grade : (submitted ? '-' : '')}</td>`);
            }
        }

        // Deliverable grades
        if (typeFilter === 'deliverables' || typeFilter === 'all') {
            for (let d = 1; d <= course.totalDeliverables; d++) {
                const deliverable = student.fullState?.deliverables?.[d];
                const submitted = state.rawData.deliverables?.find(del => del[0] === email && del[2] == d && del[7] === 'completed');
                const grade = deliverable?.teacherGrade ?? submitted?.[9] ?? '';
                const maxPts = course.deliverablePoints?.[d] || 50;

                if (grade !== '' && grade !== undefined) {
                    total += parseFloat(grade) || 0;
                }
                if (submitted) {
                    maxTotal += maxPts;
                }

                const cellStyle = grade !== '' ? '' : (submitted ? 'color: var(--warning);' : 'color: var(--gray-300);');
                row.push(`<td style="padding: 6px 8px; text-align: center; ${cellStyle}">${grade !== '' && grade !== undefined ? grade : (submitted ? '-' : '')}</td>`);
            }
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
    headers.push('Reflections', 'Deliverables', 'Points', 'Progress', 'Status');

    const rows = state.students.map(s => {
        const row = [s.name, s.email, formatPeriod(s.period)];
        if (course.hasTeams) row.push(formatTeam(s.team));
        row.push(
            `${s.submittedReflections}/${course.totalReflections}`,
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

    if (!confirm(`Send reminder emails to students with missing reflections?\n\nThis will email all students who haven't submitted their weekly reflections.`)) {
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
function showToast(message, type = 'info') {
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

    setTimeout(() => toast.remove(), 3000);
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

    if (type === 'reflection') {
        for (let week = 1; week <= course.totalReflections; week++) {
            const option = document.createElement('option');
            option.value = week;
            option.textContent = `Week ${week} Reflection (20 pts)`;
            select.appendChild(option);
        }
    } else {
        // Deliverables
        const deliverableNames = state.activeCourse === 'robotics'
            ? {
                1: 'Line Following Practical #1',
                2: 'Line Following Final Practical',
                3: 'Ultrasonic Sensor Lab Report',
                4: 'Scanner Assembly',
                5: 'Scanning Practical',
                6: 'Claw Design Document',
                7: 'Claw Control Code',
                8: 'Claw Practical',
                9: 'Final Robot Demonstration'
            }
            : {
                1: 'Game Analysis Report',
                2: 'Subsystem Research Report',
                3: 'Design Contribution',
                4: 'Design Decision Matrix',
                5: 'Prototype Documentation',
                6: 'Testing & Iteration Log',
                7: 'Integration Report',
                8: 'Technical Contribution Summary',
                9: 'Engineer Portfolio Entry',
                10: 'Final Presentation'
            };

        for (let id = 1; id <= course.totalDeliverables; id++) {
            const option = document.createElement('option');
            option.value = id;
            const pts = course.deliverablePoints[id];
            option.textContent = `${deliverableNames[id]} (${pts} pts)`;
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
    const maxPoints = type === 'reflection' ? 20 : course.deliverablePoints[assignmentId];
    document.getElementById('gradeAssignmentTitle').textContent =
        type === 'reflection' ? `Week ${assignmentId} Reflection` : document.getElementById('assignmentSelect').selectedOptions[0].text.split(' (')[0];
    document.getElementById('gradeAssignmentPoints').textContent = `Max: ${maxPoints} pts`;

    // Filter and sort students alphabetically
    let filteredStudents = [...state.students];
    if (periodFilter !== 'all') {
        filteredStudents = filteredStudents.filter(s => s.period === periodFilter);
    }
    filteredStudents.sort((a, b) => a.name.localeCompare(b.name));

    if (filteredStudents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No students found.</td></tr>';
        return;
    }

    tbody.innerHTML = filteredStudents.map(student => {
        let status = 'Not Submitted';
        let selfScore = '-';
        let existingGrade = '';
        let existingFeedback = '';

        if (type === 'reflection') {
            const submitted = state.rawData.reflections?.find(r => r[0] === student.email && r[2] == assignmentId);
            const draft = student.fullState?.weeklyReflections?.[assignmentId];

            if (submitted) {
                status = '<span class="status-badge status-on-track">Submitted</span>';
                // Try to get rubric score from submitted data or fullState
                if (draft?.rubric?.total) {
                    selfScore = `${draft.rubric.total}/16`;
                }
                // Get existing grade/feedback - Column L (index 11) = Grade, Column M (index 12) = Feedback
                existingGrade = submitted[11] || '';
                existingFeedback = submitted[12] || '';
            } else if (draft && !draft.submitted && (draft.contributions?.length > 0 || draft.challenges)) {
                status = '<span class="status-badge status-behind">Draft</span>';
                if (draft.rubric?.total) {
                    selfScore = `${draft.rubric.total}/16`;
                }
            } else {
                status = '<span class="status-badge status-very-behind">Missing</span>';
            }
        } else {
            const submitted = state.rawData.deliverables?.find(d => d[0] === student.email && d[2] == assignmentId);
            const draft = student.fullState?.deliverables?.[assignmentId];

            if (submitted && submitted[7] === 'completed') {
                status = '<span class="status-badge status-on-track">Completed</span>';
                existingGrade = submitted[9] || '';
                existingFeedback = submitted[10] || '';
            } else if (draft && draft.status === 'in-progress') {
                status = '<span class="status-badge status-behind">In Progress</span>';
            } else {
                status = '<span class="status-badge status-very-behind">Not Started</span>';
            }
        }

        return `
            <tr data-email="${student.email}">
                <td>
                    <div class="student-name">
                        <div class="avatar">${getInitials(student.name)}</div>
                        ${student.name}
                    </div>
                </td>
                <td>${formatPeriod(student.period)}</td>
                <td>${status}</td>
                <td>${selfScore}</td>
                <td>
                    <input type="number" class="grade-input" data-email="${student.email}"
                           value="${existingGrade}" min="0" max="${maxPoints}"
                           style="width: 80px; padding: 6px 8px; border: 1px solid var(--gray-300); border-radius: 6px;">
                </td>
                <td>
                    <input type="text" class="feedback-input" data-email="${student.email}"
                           value="${existingFeedback}" placeholder="Add feedback..."
                           style="width: 100%; padding: 6px 8px; border: 1px solid var(--gray-300); border-radius: 6px;">
                </td>
            </tr>
        `;
    }).join('');
}

async function saveAllGrades() {
    const type = document.getElementById('assignmentType').value;
    const assignmentId = parseInt(document.getElementById('assignmentSelect').value);
    const course = CONFIG.COURSES[state.activeCourse];

    const grades = [];
    document.querySelectorAll('#gradeTableBody tr').forEach(row => {
        const email = row.dataset.email;
        if (!email) return;

        const gradeInput = row.querySelector('.grade-input');
        const feedbackInput = row.querySelector('.feedback-input');

        if (gradeInput.value !== '' || feedbackInput.value !== '') {
            grades.push({
                email,
                type,
                assignmentId,
                grade: gradeInput.value,
                feedback: feedbackInput.value
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
        } else {
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error: ' + (result.error || 'Unknown');
        }

        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-save"></i> Save All Grades';
            btn.disabled = false;
        }, 2000);

        // Reload data to show updated grades
        await loadCourseData();
        loadGradeTable();
    } catch (error) {
        console.error('Failed to save grades:', error);
        btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-save"></i> Save All Grades';
            btn.disabled = false;
        }, 2000);
    }
}
