// Teacher Portal - Dashboard for viewing student portfolios
// Supports both Robotics and FRC Portfolio systems

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    // App version - update when deploying changes
    VERSION: 'v2.6.1',

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
            apiUrl: 'https://script.google.com/macros/s/AKfycbw0NQcfP2Z6AwSgXKSe9V4jLohnVrwxTpk320zU2M8GjSSF42T4Msq3xc5N89nCIddY/exec',
            hasTeams: false,
            totalDeliverables: 9,
            totalReflections: 9,
            totalPoints: 800,
            deliverablePoints: { 1: 50, 2: 75, 3: 40, 4: 50, 5: 75, 6: 50, 7: 50, 8: 75, 9: 100 }
        },
        frc: {
            name: 'FRC Portfolio',
            apiUrl: 'https://script.google.com/macros/s/AKfycbw3hcXITZjbdg39X9ELIBT_qSHcsAIMicS9AsHda4uHPFMwzjDjPeUej6zNr7KFxXQG/exec',
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
    // Display app version
    const versionEl = document.getElementById('appVersion');
    if (versionEl) versionEl.textContent = CONFIG.VERSION;

    calculateCurrentWeek();
    initGoogleSignIn();
    initEventListeners();
};

function calculateCurrentWeek() {
    const now = new Date();
    const diffTime = now - CONFIG.SEMESTER_START;
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
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

        // Count reflections (from Weekly Reflections sheet + drafts from JSON)
        let submittedReflections = 0;
        let draftReflections = 0;

        // Count from sheet data
        if (state.rawData.reflections) {
            submittedReflections = state.rawData.reflections.filter(r => r[0] === email).length;
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

        if (state.rawData.deliverables) {
            completedDeliverables = state.rawData.deliverables.filter(
                d => d[0] === email && d[7] === 'completed'
            ).length;
        }

        if (fullState && fullState.deliverables) {
            Object.values(fullState.deliverables).forEach(d => {
                if (d.status === 'in-progress' && d.content) {
                    draftDeliverables++;
                }
            });
        }

        // Calculate points
        let points = submittedReflections * 20;
        if (state.rawData.deliverables) {
            state.rawData.deliverables
                .filter(d => d[0] === email && d[7] === 'completed')
                .forEach(d => {
                    const id = d[2];
                    points += course.deliverablePoints[id] || 0;
                });
        }

        // Determine status
        const expectedReflections = Math.min(state.currentWeek, course.totalReflections);
        const reflectionsBehind = expectedReflections - submittedReflections;

        let status = 'on-track';
        if (reflectionsBehind >= 3) status = 'very-behind';
        else if (reflectionsBehind >= 1) status = 'behind';

        const progress = Math.round((points / course.totalPoints) * 100);

        return {
            email,
            name,
            team,
            period,
            submittedReflections,
            draftReflections,
            totalReflections: submittedReflections + draftReflections,
            completedDeliverables,
            draftDeliverables,
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
            reflectionsPanel.innerHTML += `
                <div class="item-card">
                    <div class="item-header">
                        <span class="item-title">Week ${week}</span>
                        <span class="item-status status-badge status-on-track">Submitted</span>
                    </div>
                    <div class="item-content">
                        <strong>Contributions:</strong><br>
                        ${(submitted[3] || '').replace(/\n/g, '<br>')}
                        ${submitted[5] ? `<br><br><strong>Challenges:</strong> ${submitted[5]}` : ''}
                        ${submitted[6] ? `<br><strong>Solutions:</strong> ${submitted[6]}` : ''}
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
            deliverablesPanel.innerHTML += `
                <div class="item-card">
                    <div class="item-header">
                        <span class="item-title">${submitted[3] || `Deliverable ${id}`}</span>
                        <span class="item-status status-badge status-on-track">Completed</span>
                    </div>
                    <div class="item-content">
                        ${(submitted[4] || '').substring(0, 300)}${submitted[4]?.length > 300 ? '...' : ''}
                        ${submitted[5] ? `<br><br><strong>Links:</strong> ${submitted[5]}` : ''}
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
    const evidenceWithData = evidenceItems.filter(e => e.data);

    if (evidenceWithData.length === 0) {
        evidencePanel.innerHTML = '<p class="empty-state">No evidence photos uploaded.</p>';
    } else {
        evidencePanel.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px;">
                ${evidenceWithData.map(item => `
                    <div style="background: var(--gray-50); border-radius: 8px; overflow: hidden; border: 1px solid var(--gray-200);">
                        <img src="${item.data}" alt="${item.filename}" style="width: 100%; height: 160px; object-fit: cover; display: block;">
                        <div style="padding: 8px; font-size: 12px; color: var(--gray-600);">
                            <div style="font-weight: 500;">${item.filename}</div>
                            <div>Week ${item.week} &middot; ${new Date(item.uploadedAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                `).join('')}
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
// UTILITIES
// ============================================
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
                // Get existing grade/feedback from submissions (if stored)
                existingGrade = submitted[9] || ''; // Column J - grade
                existingFeedback = submitted[10] || ''; // Column K - feedback
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
        await fetch(course.apiUrl, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({
                action: 'saveGrades',
                grades: grades
            })
        });

        btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-save"></i> Save All Grades';
            btn.disabled = false;
        }, 2000);

        // Reload data to show updated grades
        loadCourseData();
    } catch (error) {
        console.error('Failed to save grades:', error);
        btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-save"></i> Save All Grades';
            btn.disabled = false;
        }, 2000);
    }
}
