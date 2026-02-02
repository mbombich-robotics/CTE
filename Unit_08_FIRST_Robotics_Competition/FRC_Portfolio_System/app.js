// FRC Engineering Portfolio - Main Application

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================
const CONFIG = {
    // Google Sheets Web App URL (deploy your Apps Script and paste URL here)
    SHEETS_API_URL: 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL',

    // Semester start date (adjust for your semester)
    SEMESTER_START: new Date('2025-01-06'),

    // Point values
    POINTS: {
        WEEKLY_REFLECTION: 20,
        TOTAL_POSSIBLE: 900 // Adjusted to round number
    }
};

// ============================================
// DELIVERABLES DATA
// ============================================
const DELIVERABLES = [
    {
        id: 1,
        title: 'Game Analysis Report',
        week: 1,
        points: 50,
        phase: 'Research',
        description: 'Analyze the game rules, scoring methods, and research 3 mechanisms from previous years.',
        requirements: [
            'Game rules summary (key scoring methods, penalties)',
            'Strategy analysis: What makes a winning robot?',
            'Research on 3 mechanisms from previous years (with sources)',
            'Initial ideas for your subsystem',
            '3-5 minute presentation to class'
        ]
    },
    {
        id: 2,
        title: 'Subsystem Research Report',
        week: 2,
        points: 50,
        phase: 'Research',
        description: 'Research different approaches to your subsystem mechanism.',
        requirements: [
            'Research a unique approach (different from teammates)',
            'Pros/cons analysis with data',
            'Sketches or reference diagrams',
            'Recommendation with justification',
            'Team presentation (each member presents their research)'
        ]
    },
    {
        id: 3,
        title: 'Design Contribution',
        week: 3,
        points: 75,
        phase: 'Design',
        description: 'Create detailed designs for your portion of the subsystem.',
        requirements: [
            'Detailed sketches OR CAD models',
            'Dimensions and materials specified',
            'Bill of materials estimate',
            'Integration plan with other subsystems',
            'Design review presentation (5 min per team)'
        ]
    },
    {
        id: 4,
        title: 'Design Decision Matrix',
        week: 4,
        points: 50,
        phase: 'Design',
        description: 'Document the team decision-making process for final design selection.',
        requirements: [
            'Decision matrix with weighted criteria',
            'Your individual scoring and justification',
            'Final design selection rationale',
            'Personal statement: "My contribution to this decision"'
        ]
    },
    {
        id: 5,
        title: 'Prototype Documentation',
        week: 5,
        points: 75,
        phase: 'Build',
        description: 'Document your hands-on prototype work.',
        requirements: [
            'What did YOU personally build/fabricate/wire?',
            'Step-by-step photos of YOUR work',
            'Problems encountered and solutions',
            'Initial testing observations',
            'Prototype demo presentation'
        ]
    },
    {
        id: 6,
        title: 'Testing & Iteration Log',
        week: 6,
        points: 50,
        phase: 'Test',
        description: 'Document systematic testing and improvements.',
        requirements: [
            'Test procedures you developed or executed',
            'Data collected (measurements, success rates, times)',
            'Failures documented with photos',
            'Design changes made based on testing',
            'Before/after comparison'
        ]
    },
    {
        id: 7,
        title: 'Integration Report',
        week: 7,
        points: 50,
        phase: 'Improve',
        description: 'Document how your subsystem integrates with the full robot.',
        requirements: [
            'Interface points with other subsystems',
            'Problems discovered during integration',
            'Your role in solving integration issues',
            'Wiring diagrams, code snippets, or assembly photos',
            'Full robot demo presentation'
        ]
    },
    {
        id: 8,
        title: 'Technical Contribution Summary',
        week: 8,
        points: 75,
        phase: 'Improve',
        description: 'Comprehensive summary of all your technical contributions.',
        requirements: [
            'Complete list of parts you designed/built/programmed',
            'Skills you developed or applied',
            'Quantifiable improvements you made',
            'Photos/videos throughout the project',
            'Self-assessment of your growth'
        ]
    },
    {
        id: 9,
        title: 'Engineer Portfolio Entry',
        week: 9,
        points: 100,
        phase: 'Communicate',
        description: 'Professional portfolio documentation for FIRST judges.',
        requirements: [
            'Professional formatting and organization',
            'Clear documentation of design process',
            'Technical drawings/CAD screenshots',
            'Testing data and iterations',
            'Final specifications and performance'
        ]
    },
    {
        id: 10,
        title: 'Final Presentation',
        week: 9,
        points: 100,
        phase: 'Communicate',
        description: '5-minute presentation as if to FIRST judges.',
        requirements: [
            'Explain your subsystem clearly',
            'Demonstrate technical knowledge',
            'Professional presentation skills',
            'Visual aids/demonstrations',
            'Answer Q&A from class/teacher'
        ]
    }
];

// ============================================
// APPLICATION STATE
// ============================================
let state = {
    student: null,
    weeklyReflections: {},
    deliverables: {},
    evidence: [],
    currentWeek: 1,
    selectedWeek: 1
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initNavigation();
    initSetupForm();
    initWeeklyReflectionForm();
    initDeliverables();
    initEvidenceUpload();
    initAIFeatures();
    updateUI();

    // Check if student needs to set up
    if (!state.student) {
        showSetupModal();
    }
});

// ============================================
// STATE MANAGEMENT
// ============================================
function loadState() {
    const saved = localStorage.getItem('frc_portfolio_state');
    if (saved) {
        state = JSON.parse(saved);
    }
    calculateCurrentWeek();
}

function saveState() {
    localStorage.setItem('frc_portfolio_state', JSON.stringify(state));
    syncToGoogleSheets();
}

function calculateCurrentWeek() {
    const now = new Date();
    const diffTime = now - CONFIG.SEMESTER_START;
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    state.currentWeek = Math.min(Math.max(1, diffWeeks), 9);
}

// ============================================
// GOOGLE SHEETS INTEGRATION
// ============================================
async function syncToGoogleSheets() {
    if (CONFIG.SHEETS_API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
        console.log('Google Sheets not configured - data saved locally only');
        return;
    }

    try {
        const response = await fetch(CONFIG.SHEETS_API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'sync',
                student: state.student,
                weeklyReflections: state.weeklyReflections,
                deliverables: state.deliverables,
                timestamp: new Date().toISOString()
            })
        });
        console.log('Synced to Google Sheets');
    } catch (error) {
        console.error('Failed to sync to Google Sheets:', error);
    }
}

async function loadFromGoogleSheets() {
    if (CONFIG.SHEETS_API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
        return null;
    }

    try {
        const response = await fetch(`${CONFIG.SHEETS_API_URL}?action=load&email=${state.student.email}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to load from Google Sheets:', error);
        return null;
    }
}

async function loadTeamData() {
    if (CONFIG.SHEETS_API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
        return getMockTeamData();
    }

    try {
        const response = await fetch(`${CONFIG.SHEETS_API_URL}?action=team&team=${state.student.team}&period=${state.student.period}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to load team data:', error);
        return getMockTeamData();
    }
}

function getMockTeamData() {
    return {
        teamName: formatTeamName(state.student?.team || 'Unknown'),
        members: [
            {
                name: state.student?.name || 'You',
                initials: getInitials(state.student?.name || 'You'),
                reflections: Object.keys(state.weeklyReflections).length,
                deliverables: Object.keys(state.deliverables).filter(k => state.deliverables[k].status === 'completed').length,
                points: calculatePoints()
            }
        ],
        totalProgress: calculateProgress()
    };
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navigateTo(page);
        });
    });
}

function navigateTo(pageId) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageId);
    });

    // Update pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.toggle('active', page.id === `${pageId}Page`);
    });

    // Load page-specific data
    switch (pageId) {
        case 'team':
            loadTeamView();
            break;
        case 'evidence':
            loadEvidenceGallery();
            break;
        case 'portfolio':
            loadPortfolioPreview();
            break;
    }
}

// ============================================
// SETUP FORM
// ============================================
function initSetupForm() {
    const form = document.getElementById('setupForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        state.student = {
            name: document.getElementById('setupName').value,
            email: document.getElementById('setupEmail').value,
            team: document.getElementById('setupTeam').value,
            period: document.getElementById('setupPeriod').value,
            createdAt: new Date().toISOString()
        };

        saveState();
        hideSetupModal();
        updateUI();
        showToast('Welcome! Your portfolio is ready.', 'success');
    });
}

function showSetupModal() {
    document.getElementById('setupModal').classList.add('active');
}

function hideSetupModal() {
    document.getElementById('setupModal').classList.remove('active');
}

// ============================================
// UI UPDATES
// ============================================
function updateUI() {
    if (!state.student) return;

    // Update student info
    document.getElementById('avatarInitials').textContent = getInitials(state.student.name);
    document.getElementById('studentName').textContent = state.student.name;
    document.getElementById('teamBadge').textContent = formatTeamName(state.student.team);

    // Update dashboard stats
    const completedDeliverables = Object.values(state.deliverables).filter(d => d.status === 'completed').length;
    const completedReflections = Object.keys(state.weeklyReflections).length;

    document.getElementById('completedCount').textContent = completedDeliverables + completedReflections;
    document.getElementById('pendingCount').textContent = (10 - completedDeliverables) + (9 - completedReflections);
    document.getElementById('totalPoints').textContent = calculatePoints();
    document.getElementById('currentWeek').textContent = state.currentWeek;

    // Update progress bar
    const progress = calculateProgress();
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = `${calculatePoints()} / ${CONFIG.POINTS.TOTAL_POSSIBLE} pts`;

    // Update timeline
    updateTimeline();

    // Update upcoming items
    updateUpcoming();

    // Update week buttons
    updateWeekButtons();

    // Update deliverables list
    updateDeliverablesList();
}

function calculatePoints() {
    let points = 0;

    // Weekly reflections
    Object.keys(state.weeklyReflections).forEach(week => {
        if (state.weeklyReflections[week].submitted) {
            points += CONFIG.POINTS.WEEKLY_REFLECTION;
        }
    });

    // Deliverables
    DELIVERABLES.forEach(d => {
        if (state.deliverables[d.id]?.status === 'completed') {
            points += d.points;
        }
    });

    return points;
}

function calculateProgress() {
    return Math.round((calculatePoints() / CONFIG.POINTS.TOTAL_POSSIBLE) * 100);
}

function updateTimeline() {
    const timeline = document.getElementById('timeline');
    const phases = ['Research', 'Research', 'Design', 'Design', 'Build', 'Test', 'Improve', 'Improve', 'Communicate'];

    timeline.innerHTML = '';

    for (let week = 1; week <= 9; week++) {
        const weekData = state.weeklyReflections[week];
        const isCompleted = weekData?.submitted;
        const isCurrent = week === state.currentWeek;

        const weekEl = document.createElement('div');
        weekEl.className = `timeline-week ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`;
        weekEl.innerHTML = `
            <div class="week-number">${isCompleted ? '<i class="fas fa-check"></i>' : week}</div>
            <div class="week-info">
                <div class="week-title">Week ${week}</div>
                <div class="week-phase">${phases[week - 1]}</div>
            </div>
            <div class="week-status">${isCompleted ? 'Complete' : (isCurrent ? 'Current' : 'Upcoming')}</div>
        `;

        weekEl.addEventListener('click', () => {
            state.selectedWeek = week;
            navigateTo('weekly');
            selectWeek(week);
        });

        timeline.appendChild(weekEl);
    }
}

function updateUpcoming() {
    const list = document.getElementById('upcomingList');
    const upcoming = [];

    // Check weekly reflection
    if (!state.weeklyReflections[state.currentWeek]?.submitted) {
        upcoming.push({
            title: `Week ${state.currentWeek} Reflection`,
            due: 'Friday',
            points: 20,
            overdue: false
        });
    }

    // Check current week deliverable
    const currentDeliverable = DELIVERABLES.find(d => d.week === state.currentWeek);
    if (currentDeliverable && state.deliverables[currentDeliverable.id]?.status !== 'completed') {
        upcoming.push({
            title: currentDeliverable.title,
            due: `End of Week ${state.currentWeek}`,
            points: currentDeliverable.points,
            overdue: false
        });
    }

    // Check overdue items
    for (let week = 1; week < state.currentWeek; week++) {
        if (!state.weeklyReflections[week]?.submitted) {
            upcoming.unshift({
                title: `Week ${week} Reflection`,
                due: 'OVERDUE',
                points: 20,
                overdue: true
            });
        }
    }

    list.innerHTML = upcoming.length === 0
        ? '<p style="color: var(--success); padding: 20px; text-align: center;"><i class="fas fa-check-circle"></i> You\'re all caught up!</p>'
        : upcoming.map(item => `
            <div class="upcoming-item ${item.overdue ? 'overdue' : ''}">
                <div class="title">${item.title}</div>
                <div class="due-date">${item.due}</div>
                <div class="points">${item.points} pts</div>
            </div>
        `).join('');
}

function updateWeekButtons() {
    document.querySelectorAll('.week-btn').forEach(btn => {
        const week = parseInt(btn.dataset.week);
        const isCompleted = state.weeklyReflections[week]?.submitted;
        btn.classList.toggle('completed', isCompleted);
        btn.classList.toggle('active', week === state.selectedWeek);
    });
}

function updateDeliverablesList() {
    const list = document.getElementById('deliverablesList');

    list.innerHTML = DELIVERABLES.map(d => {
        const status = state.deliverables[d.id]?.status || 'pending';
        const isCurrent = d.week === state.currentWeek;

        return `
            <div class="deliverable-card ${status} ${isCurrent ? 'current' : ''}" data-id="${d.id}">
                <div class="deliverable-number">${status === 'completed' ? '<i class="fas fa-check"></i>' : d.id}</div>
                <div class="deliverable-info">
                    <div class="deliverable-title">${d.title}</div>
                    <div class="deliverable-meta">
                        <span>Week ${d.week}</span>
                        <span>${d.phase}</span>
                        <span class="deliverable-points">${d.points} pts</span>
                    </div>
                </div>
                <div class="deliverable-status status-${status}">${formatStatus(status)}</div>
            </div>
        `;
    }).join('');

    // Add click handlers
    list.querySelectorAll('.deliverable-card').forEach(card => {
        card.addEventListener('click', () => {
            openDeliverableForm(parseInt(card.dataset.id));
        });
    });
}

// ============================================
// WEEKLY REFLECTION FORM
// ============================================
function initWeeklyReflectionForm() {
    // Week button clicks
    document.querySelectorAll('.week-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectWeek(parseInt(btn.dataset.week));
        });
    });

    // Add contribution button
    document.getElementById('addContribution').addEventListener('click', addContributionRow);

    // Form submission
    document.getElementById('weeklyReflectionForm').addEventListener('submit', submitWeeklyReflection);

    // Save draft button
    document.getElementById('saveReflectionDraft').addEventListener('click', saveReflectionDraft);
}

function selectWeek(week) {
    state.selectedWeek = week;
    document.getElementById('reflectionWeek').value = week;

    // Update button states
    document.querySelectorAll('.week-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.week) === week);
    });

    // Load existing data
    const existingData = state.weeklyReflections[week];
    if (existingData) {
        loadReflectionData(existingData);
    } else {
        clearReflectionForm();
    }
}

function addContributionRow() {
    const list = document.getElementById('contributionList');
    const newItem = document.createElement('div');
    newItem.className = 'contribution-item';
    newItem.innerHTML = `
        <input type="date" class="contrib-date" required>
        <input type="text" class="contrib-task" placeholder="I worked on..." required>
        <button type="button" class="btn btn-small" onclick="this.parentElement.remove()" style="padding: 8px;">
            <i class="fas fa-times"></i>
        </button>
    `;
    list.appendChild(newItem);
}

function loadReflectionData(data) {
    // Load contributions
    const contribList = document.getElementById('contributionList');
    contribList.innerHTML = '';

    (data.contributions || []).forEach((contrib, index) => {
        const item = document.createElement('div');
        item.className = 'contribution-item';
        item.innerHTML = `
            <input type="date" class="contrib-date" value="${contrib.date}" required>
            <input type="text" class="contrib-task" value="${contrib.task}" required>
            ${index >= 3 ? '<button type="button" class="btn btn-small" onclick="this.parentElement.remove()" style="padding: 8px;"><i class="fas fa-times"></i></button>' : ''}
        `;
        contribList.appendChild(item);
    });

    // Ensure at least 3 rows
    while (contribList.children.length < 3) {
        addContributionRow();
    }

    // Load other fields
    document.getElementById('evidenceLinks').value = data.evidenceLinks || '';
    document.getElementById('challenges').value = data.challenges || '';
    document.getElementById('solutions').value = data.solutions || '';

    // Load goals
    const goalInputs = document.querySelectorAll('.goal-input');
    (data.goals || []).forEach((goal, index) => {
        if (goalInputs[index]) {
            goalInputs[index].value = goal;
        }
    });
}

function clearReflectionForm() {
    document.getElementById('weeklyReflectionForm').reset();

    const contribList = document.getElementById('contributionList');
    contribList.innerHTML = `
        <div class="contribution-item">
            <input type="date" class="contrib-date" required>
            <input type="text" class="contrib-task" placeholder="I designed the..." required>
        </div>
        <div class="contribution-item">
            <input type="date" class="contrib-date" required>
            <input type="text" class="contrib-task" placeholder="I built/coded/tested..." required>
        </div>
        <div class="contribution-item">
            <input type="date" class="contrib-date" required>
            <input type="text" class="contrib-task" placeholder="I researched/documented..." required>
        </div>
    `;

    document.getElementById('evidencePreview').innerHTML = '';
}

function getReflectionFormData() {
    const week = state.selectedWeek;

    // Gather contributions
    const contributions = [];
    document.querySelectorAll('.contribution-item').forEach(item => {
        const date = item.querySelector('.contrib-date').value;
        const task = item.querySelector('.contrib-task').value;
        if (date && task) {
            contributions.push({ date, task });
        }
    });

    // Gather goals
    const goals = [];
    document.querySelectorAll('.goal-input').forEach(input => {
        if (input.value) {
            goals.push(input.value);
        }
    });

    return {
        week,
        contributions,
        evidenceLinks: document.getElementById('evidenceLinks').value,
        challenges: document.getElementById('challenges').value,
        solutions: document.getElementById('solutions').value,
        goals,
        updatedAt: new Date().toISOString()
    };
}

function saveReflectionDraft() {
    const data = getReflectionFormData();
    data.submitted = false;
    state.weeklyReflections[data.week] = data;
    saveState();
    showToast('Draft saved!', 'success');
}

function submitWeeklyReflection(e) {
    e.preventDefault();

    const data = getReflectionFormData();

    // Validate
    if (data.contributions.length < 3) {
        showToast('Please add at least 3 contributions', 'error');
        return;
    }

    // Check for "I" statements
    const hasWeStatements = data.contributions.some(c =>
        c.task.toLowerCase().startsWith('we ') ||
        c.task.toLowerCase().includes(' we ')
    );
    if (hasWeStatements) {
        showToast('Use "I" statements instead of "we" to document YOUR contributions', 'error');
        return;
    }

    data.submitted = true;
    data.submittedAt = new Date().toISOString();
    state.weeklyReflections[data.week] = data;
    saveState();
    updateUI();
    showToast(`Week ${data.week} reflection submitted! (+20 pts)`, 'success');
}

// ============================================
// EVIDENCE UPLOAD
// ============================================
function initEvidenceUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('evidenceFiles');

    uploadZone.addEventListener('click', () => fileInput.click());

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--primary)';
        uploadZone.style.background = 'var(--primary-light)';
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = '';
        uploadZone.style.background = '';
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '';
        uploadZone.style.background = '';
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', () => {
        handleFiles(fileInput.files);
    });
}

function handleFiles(files) {
    const preview = document.getElementById('evidencePreview');

    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const thumb = document.createElement('div');
            thumb.className = 'evidence-thumb';
            thumb.innerHTML = `
                <img src="${e.target.result}" alt="Evidence">
                <button type="button" class="remove-btn" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            preview.appendChild(thumb);

            // Store in state
            state.evidence.push({
                type: 'weekly',
                week: state.selectedWeek,
                data: e.target.result,
                filename: file.name,
                uploadedAt: new Date().toISOString()
            });
        };
        reader.readAsDataURL(file);
    });
}

// ============================================
// DELIVERABLES
// ============================================
function initDeliverables() {
    document.getElementById('closeDeliverableModal').addEventListener('click', () => {
        document.getElementById('deliverableModal').classList.remove('active');
    });
}

function openDeliverableForm(id) {
    const deliverable = DELIVERABLES.find(d => d.id === id);
    const existing = state.deliverables[id] || {};
    const modal = document.getElementById('deliverableModal');
    const content = document.getElementById('deliverableFormContent');

    content.innerHTML = `
        <h2><i class="fas fa-clipboard-list"></i> ${deliverable.title}</h2>
        <p style="color: var(--gray-600); margin-bottom: 20px;">${deliverable.description}</p>

        <div style="display: flex; gap: 16px; margin-bottom: 20px;">
            <span style="background: var(--primary-light); color: var(--primary); padding: 6px 12px; border-radius: 20px; font-size: 14px;">
                Week ${deliverable.week}
            </span>
            <span style="background: #e8f5e9; color: var(--success); padding: 6px 12px; border-radius: 20px; font-size: 14px;">
                ${deliverable.points} points
            </span>
            <span style="background: var(--gray-100); padding: 6px 12px; border-radius: 20px; font-size: 14px;">
                ${deliverable.phase} Phase
            </span>
        </div>

        <div class="card" style="background: var(--gray-50);">
            <h4 style="margin-bottom: 12px;">Requirements</h4>
            <ul style="margin-left: 20px;">
                ${deliverable.requirements.map(r => `<li style="margin-bottom: 8px;">${r}</li>`).join('')}
            </ul>
        </div>

        <form id="deliverableForm" style="margin-top: 20px;">
            <div class="form-group">
                <label for="deliverableContent">Your Submission</label>
                <textarea id="deliverableContent" rows="10" placeholder="Enter your deliverable content here. Include all required components...">${existing.content || ''}</textarea>
            </div>

            <div class="form-group">
                <label for="deliverableLinks">Supporting Links (Google Drive, images, etc.)</label>
                <textarea id="deliverableLinks" rows="3" placeholder="https://drive.google.com/...">${existing.links || ''}</textarea>
            </div>

            <div class="form-group">
                <label for="deliverableSelfAssessment">Self-Assessment: How well did you meet the requirements? (1-10)</label>
                <input type="number" id="deliverableSelfAssessment" min="1" max="10" value="${existing.selfAssessment || ''}">
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="saveDeliverableDraft(${id})">
                    <i class="fas fa-save"></i> Save Draft
                </button>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-paper-plane"></i> Submit Deliverable
                </button>
            </div>
        </form>
    `;

    document.getElementById('deliverableForm').addEventListener('submit', (e) => {
        e.preventDefault();
        submitDeliverable(id);
    });

    modal.classList.add('active');
}

function saveDeliverableDraft(id) {
    const deliverable = DELIVERABLES.find(d => d.id === id);

    state.deliverables[id] = {
        ...state.deliverables[id],
        content: document.getElementById('deliverableContent').value,
        links: document.getElementById('deliverableLinks').value,
        selfAssessment: document.getElementById('deliverableSelfAssessment').value,
        status: 'in-progress',
        updatedAt: new Date().toISOString()
    };

    saveState();
    updateUI();
    showToast('Draft saved!', 'success');
}

function submitDeliverable(id) {
    const deliverable = DELIVERABLES.find(d => d.id === id);
    const content = document.getElementById('deliverableContent').value;

    if (!content || content.length < 100) {
        showToast('Please provide more detailed content (at least 100 characters)', 'error');
        return;
    }

    state.deliverables[id] = {
        content,
        links: document.getElementById('deliverableLinks').value,
        selfAssessment: document.getElementById('deliverableSelfAssessment').value,
        status: 'completed',
        submittedAt: new Date().toISOString()
    };

    saveState();
    updateUI();
    document.getElementById('deliverableModal').classList.remove('active');
    showToast(`${deliverable.title} submitted! (+${deliverable.points} pts)`, 'success');
}

// ============================================
// TEAM VIEW
// ============================================
async function loadTeamView() {
    const teamData = await loadTeamData();

    document.getElementById('teamName').textContent = teamData.teamName;
    document.getElementById('teamProgressFill').style.width = `${teamData.totalProgress}%`;
    document.getElementById('teamProgressText').textContent = `${teamData.totalProgress}% Complete`;

    const membersContainer = document.getElementById('teamMembers');
    membersContainer.innerHTML = teamData.members.map(member => `
        <div class="member-card">
            <div class="member-header">
                <div class="member-avatar">${member.initials}</div>
                <div>
                    <div class="member-name">${member.name}</div>
                    <div class="member-role">Team Member</div>
                </div>
            </div>
            <div class="member-stats">
                <div class="member-stat">
                    <div class="member-stat-value">${member.reflections}</div>
                    <div class="member-stat-label">Reflections</div>
                </div>
                <div class="member-stat">
                    <div class="member-stat-value">${member.deliverables}</div>
                    <div class="member-stat-label">Deliverables</div>
                </div>
                <div class="member-stat">
                    <div class="member-stat-value">${member.points}</div>
                    <div class="member-stat-label">Points</div>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// EVIDENCE GALLERY
// ============================================
function loadEvidenceGallery() {
    const gallery = document.getElementById('evidenceGallery');

    if (state.evidence.length === 0) {
        gallery.innerHTML = '<p class="placeholder-text">No evidence uploaded yet. Add photos in your weekly reflections!</p>';
        return;
    }

    gallery.innerHTML = state.evidence.map((item, index) => `
        <div class="gallery-item" data-type="${item.type}">
            <img src="${item.data}" alt="${item.filename}">
            <div class="gallery-item-info">
                <div class="date">${new Date(item.uploadedAt).toLocaleDateString()}</div>
                <div class="caption">Week ${item.week}</div>
            </div>
        </div>
    `).join('');

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            document.querySelectorAll('.gallery-item').forEach(item => {
                if (filter === 'all' || item.dataset.type === filter) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ============================================
// AI FEATURES
// ============================================
function initAIFeatures() {
    document.querySelectorAll('.ai-option').forEach(option => {
        option.addEventListener('click', () => {
            const action = option.dataset.action;
            handleAIAction(action);
        });
    });

    document.getElementById('generateQuestions').addEventListener('click', generatePracticeQuestions);
    document.getElementById('generateTeamPortfolio').addEventListener('click', generateTeamPortfolio);

    // Export buttons
    document.getElementById('exportHTML').addEventListener('click', exportPortfolioHTML);
    document.getElementById('exportPDF').addEventListener('click', () => showToast('PDF export coming soon!', 'info'));
    document.getElementById('exportWord').addEventListener('click', () => showToast('Word export coming soon!', 'info'));
}

function handleAIAction(action) {
    const panel = document.getElementById('aiPanel');
    const content = document.getElementById('aiPanelContent');

    let prompt = '';
    let instructions = '';

    switch (action) {
        case 'polish':
            instructions = 'Copy this prompt and paste it into ChatGPT or Claude along with your text:';
            prompt = `Please polish the following technical writing for a FIRST Robotics engineering portfolio.
Improve grammar, clarity, and professional tone while keeping all technical details accurate.
Make it sound like a confident high school engineering student.
Do not add information that isn't there - only improve the writing quality.

My text:
[PASTE YOUR TEXT HERE]`;
            break;

        case 'organize':
            instructions = 'Copy this prompt to help organize your portfolio:';
            prompt = `I need help organizing my FIRST Robotics engineering portfolio entry.
I worked on the ${formatTeamName(state.student?.team || 'subsystem')} subsystem.

Please help me structure my documentation into these sections:
1. Problem Statement - What challenge did we need to solve?
2. Research & Analysis - What options did we consider?
3. Design Process - How did we arrive at our final design?
4. Build & Testing - What did we build and how did we test it?
5. Results & Reflection - What worked, what we learned

Here's my raw content:
[PASTE YOUR DELIVERABLES AND REFLECTIONS HERE]`;
            break;

        case 'summarize':
            instructions = 'Copy this prompt to generate an executive summary:';
            prompt = `Create a 150-200 word executive summary of my contributions to the FIRST Robotics team.
I worked on: ${formatTeamName(state.student?.team || 'a subsystem')}

Key accomplishments to summarize:
${Object.values(state.weeklyReflections).map(r =>
    r.contributions?.map(c => `- ${c.task}`).join('\n')
).join('\n')}

Make it professional, highlighting technical skills and problem-solving abilities.`;
            break;
    }

    content.innerHTML = `
        <p style="margin-bottom: 16px;">${instructions}</p>
        <textarea style="width: 100%; height: 300px; font-family: monospace; font-size: 13px; padding: 12px;" readonly>${prompt}</textarea>
        <button class="btn btn-primary" style="margin-top: 12px; width: 100%;" onclick="navigator.clipboard.writeText(this.previousElementSibling.value); showToast('Copied to clipboard!', 'success');">
            <i class="fas fa-copy"></i> Copy to Clipboard
        </button>
    `;

    panel.classList.add('active');
    document.getElementById('closeAiPanel').addEventListener('click', () => {
        panel.classList.remove('active');
    });
}

function generatePracticeQuestions() {
    const questions = [
        `Explain how your ${formatTeamName(state.student?.team)} mechanism works. What are its key components?`,
        "What was the biggest challenge you faced during build season, and how did you solve it?",
        "Walk me through your design process. How did you decide on your final approach?",
        "What would you do differently if you could start over?",
        "How did you test your mechanism? What data did you collect?",
        "Explain how your subsystem integrates with the rest of the robot.",
        "What safety considerations did you account for in your design?",
        "What engineering skills did you develop during this project?",
        "How did you use iteration and prototyping in your design process?",
        "What research did you do before designing your mechanism?"
    ];

    const container = document.getElementById('practiceQuestions');
    const selectedQuestions = questions.sort(() => Math.random() - 0.5).slice(0, 5);

    container.innerHTML = `
        <p style="color: var(--gray-600); margin-bottom: 12px;">Practice answering these questions as if you're talking to FIRST judges:</p>
        ${selectedQuestions.map((q, i) => `
            <div class="practice-question">
                <strong>Q${i + 1}:</strong> ${q}
            </div>
        `).join('')}
        <button class="btn btn-secondary" style="margin-top: 12px;" onclick="generatePracticeQuestions()">
            <i class="fas fa-refresh"></i> Generate New Questions
        </button>
    `;
}

function generateTeamPortfolio() {
    showToast('Team portfolio generation requires all team members to submit work. Coming soon!', 'info');
}

// ============================================
// PORTFOLIO PREVIEW & EXPORT
// ============================================
function loadPortfolioPreview() {
    const preview = document.getElementById('portfolioPreview');
    const completedDeliverables = Object.keys(state.deliverables).filter(
        k => state.deliverables[k].status === 'completed'
    ).length;

    if (completedDeliverables < 3) {
        preview.innerHTML = `<p class="placeholder-text">Complete at least 3 deliverables to preview your portfolio...</p>`;
        return;
    }

    preview.innerHTML = `
        <div style="font-family: 'Times New Roman', serif; padding: 20px;">
            <h1 style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px;">
                Engineering Portfolio
            </h1>
            <h2 style="text-align: center; color: #666; margin-top: 5px;">
                ${formatTeamName(state.student?.team)} Subsystem
            </h2>
            <p style="text-align: center; color: #666;">
                ${state.student?.name} | ${new Date().getFullYear()} Season
            </p>

            <h3 style="margin-top: 30px; border-bottom: 1px solid #ccc;">Summary of Contributions</h3>
            <ul>
                ${Object.values(state.weeklyReflections)
                    .flatMap(r => r.contributions || [])
                    .slice(0, 10)
                    .map(c => `<li>${c.task}</li>`)
                    .join('')}
            </ul>

            <h3 style="margin-top: 30px; border-bottom: 1px solid #ccc;">Technical Documentation</h3>
            ${DELIVERABLES.filter(d => state.deliverables[d.id]?.status === 'completed')
                .map(d => `
                    <h4>${d.title}</h4>
                    <p>${state.deliverables[d.id].content?.substring(0, 200)}...</p>
                `).join('')}
        </div>
    `;
}

function exportPortfolioHTML() {
    const content = generateFullPortfolioHTML();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.student?.name?.replace(/\s+/g, '_')}_FRC_Portfolio.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Portfolio exported!', 'success');
}

function generateFullPortfolioHTML() {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${state.student?.name} - FRC Engineering Portfolio</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6; }
        h1 { color: #1a73e8; border-bottom: 3px solid #1a73e8; padding-bottom: 10px; }
        h2 { color: #333; margin-top: 30px; }
        h3 { color: #555; border-left: 4px solid #1a73e8; padding-left: 12px; }
        .header { text-align: center; margin-bottom: 40px; }
        .section { margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; }
        .contribution { padding: 8px 0; border-bottom: 1px solid #eee; }
        .meta { color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Engineering Portfolio</h1>
        <h2>${formatTeamName(state.student?.team)} Subsystem</h2>
        <p class="meta">${state.student?.name} | FIRST Robotics Competition ${new Date().getFullYear()}</p>
    </div>

    <div class="section">
        <h3>About Me</h3>
        <p><strong>Name:</strong> ${state.student?.name}</p>
        <p><strong>Subsystem Team:</strong> ${formatTeamName(state.student?.team)}</p>
        <p><strong>Total Points Earned:</strong> ${calculatePoints()} / ${CONFIG.POINTS.TOTAL_POSSIBLE}</p>
    </div>

    <div class="section">
        <h3>Weekly Contributions</h3>
        ${Object.entries(state.weeklyReflections)
            .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
            .map(([week, data]) => `
                <h4>Week ${week}</h4>
                ${(data.contributions || []).map(c => `
                    <div class="contribution">
                        <span class="meta">${c.date}</span>: ${c.task}
                    </div>
                `).join('')}
                ${data.challenges ? `<p><strong>Challenges:</strong> ${data.challenges}</p>` : ''}
                ${data.solutions ? `<p><strong>Solutions:</strong> ${data.solutions}</p>` : ''}
            `).join('')}
    </div>

    <div class="section">
        <h3>Major Deliverables</h3>
        ${DELIVERABLES.filter(d => state.deliverables[d.id]?.status === 'completed')
            .map(d => `
                <h4>${d.title} (${d.points} pts)</h4>
                <p>${state.deliverables[d.id].content}</p>
            `).join('')}
    </div>

    <footer style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
        Generated from FRC Engineering Portfolio System | ${new Date().toLocaleDateString()}
    </footer>
</body>
</html>`;
}

// ============================================
// UTILITIES
// ============================================
function getInitials(name) {
    if (!name) return '--';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function formatTeamName(team) {
    const names = {
        'drivetrain': 'Drivetrain',
        'intake': 'Intake/Collector',
        'shooter': 'Shooter/Launcher',
        'climber': 'Climber',
        'autonomous': 'Autonomous/Vision',
        'integration': 'Integration/Electrical'
    };
    return names[team] || team;
}

function formatStatus(status) {
    const labels = {
        'pending': 'Not Started',
        'in-progress': 'In Progress',
        'completed': 'Completed',
        'graded': 'Graded'
    };
    return labels[status] || status;
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Make showToast globally available for inline onclick handlers
window.showToast = showToast;
window.saveDeliverableDraft = saveDeliverableDraft;
window.generatePracticeQuestions = generatePracticeQuestions;
