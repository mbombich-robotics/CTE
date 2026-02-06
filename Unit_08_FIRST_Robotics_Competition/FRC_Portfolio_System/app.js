// FRC Engineering Portfolio - Main Application (Google Auth Edition)

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================
// Placeholder image (data URI - won't be blocked by firewalls)
const PLACEHOLDER_IMG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2UwZTBlMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QaG90bzwvdGV4dD48L3N2Zz4=';

const CONFIG = {
    // App version - update when deploying changes
    VERSION: 'v2.7.0',

    // Google Sheets Web App URL (deploy your Apps Script and paste URL here)
    SHEETS_API_URL: 'https://script.google.com/macros/s/AKfycbzvU4t4q7i5kvzQaVuCcXVNx6Dy6kR-AjDp85pciV07hgICHCGOmGaSe8c50Zu4lhdL/exec',

    // Google OAuth Client ID
    GOOGLE_CLIENT_ID: '1002661691088-8g0dskdehhmgc8jigbua15l3ih7td4ka.apps.googleusercontent.com',

    // Semester start date (adjust for your semester)
    SEMESTER_START: new Date('2026-02-02'),

    // Point values
    POINTS: {
        WEEKLY_REFLECTION: 20,
        TOTAL_POSSIBLE: 900
    },

    // Auto-save interval in milliseconds
    AUTO_SAVE_INTERVAL: 30000
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

let autoSaveTimer = null;
let isDirty = false;
let formInitialized = false; // Track if reflection form has been populated
let tokenClient = null; // Google OAuth2 token client
let accessToken = null; // Store access token for Drive API

// ============================================
// GOOGLE SIGN-IN INITIALIZATION
// ============================================
let googleRetryCount = 0;
const MAX_GOOGLE_RETRIES = 50; // 5 seconds max

window.onload = function () {
    // Display app version
    const versionEl = document.getElementById('appVersion');
    if (versionEl) versionEl.textContent = CONFIG.VERSION;

    // Display version on sign-in modal
    const signinVersionEl = document.getElementById('signinVersion');
    if (signinVersionEl) signinVersionEl.textContent = `Version ${CONFIG.VERSION}`;

    // Show sign-in modal on page load
    document.getElementById('signinModal').classList.add('active');

    // Init navigation and static components immediately
    initNavigation();
    initDeliverables();
    initAIFeatures();

    // Wire sign-out button
    document.getElementById('signOutBtn').addEventListener('click', signOut);

    // Load gapi client for Drive API
    if (typeof gapi !== 'undefined') {
        gapi.load('client', initGapiClient);
    }

    // Wait for Google Identity Services to load
    waitForGoogleSignIn();
};

function waitForGoogleSignIn() {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
        initGoogleOAuth();
    } else if (googleRetryCount < MAX_GOOGLE_RETRIES) {
        googleRetryCount++;
        setTimeout(waitForGoogleSignIn, 100);
    } else {
        // Show error message after timeout
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
        console.error('Google Identity Services failed to load after 5 seconds');
    }
}

function initGoogleOAuth() {
    // Initialize the token client for OAuth2 (needed for Drive API)
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CONFIG.GOOGLE_CLIENT_ID,
        scope: 'email profile https://www.googleapis.com/auth/drive.file',
        callback: handleTokenResponse
    });

    // Create custom sign-in button
    const signInBtn = document.getElementById('googleSignInBtn');
    signInBtn.innerHTML = `
        <button class="google-signin-btn" style="
            display: flex; align-items: center; gap: 12px;
            padding: 12px 24px; border: 1px solid #dadce0; border-radius: 4px;
            background: white; cursor: pointer; font-size: 14px; font-family: 'Roboto', sans-serif;
        ">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style="width: 18px; height: 18px;">
            <span style="color: #3c4043;">Sign in with Google</span>
        </button>
    `;
    signInBtn.querySelector('button').addEventListener('click', () => {
        tokenClient.requestAccessToken();
    });
}

async function initGapiClient() {
    await gapi.client.init({});
    console.log('Google API client initialized');
}

// ============================================
// GOOGLE AUTH HANDLERS
// ============================================
async function handleTokenResponse(tokenResponse) {
    if (tokenResponse.error) {
        console.error('Token error:', tokenResponse.error);
        showToast('Sign-in failed: ' + tokenResponse.error, 'error');
        return;
    }

    // Store access token for Drive API
    accessToken = tokenResponse.access_token;

    // Set token for gapi client
    if (typeof gapi !== 'undefined' && gapi.client) {
        gapi.client.setToken({ access_token: accessToken });
    }

    // Fetch user info using the access token
    try {
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const userInfo = await userInfoResponse.json();
        const email = userInfo.email;
        const name = userInfo.name;

        // Dismiss sign-in modal
        document.getElementById('signinModal').classList.remove('active');

        // Attempt cloud load
        const cloudData = await loadStudentFromCloud(email);
        if (cloudData && cloudData.student) {
            // Returning student
            state = cloudData;
            state.student.name = name;
            restoreEvidenceLocal();
            calculateCurrentWeek();
            hideAllModals();
            onAuthenticated();
        } else {
            // New student — show profile modal
            document.getElementById('profileEmail').textContent = email;
            document.getElementById('profileModal').classList.add('active');
            state.student = { email, name };
            initProfileForm();
        }
    } catch (error) {
        console.error('Failed to get user info:', error);
        showToast('Failed to get user info', 'error');
    }
}

// ============================================
// GOOGLE DRIVE FUNCTIONS
// ============================================
const DRIVE_FOLDER_NAME = 'FRC Portfolio Evidence';
let driveFolderId = null;

async function getOrCreateDriveFolder() {
    if (driveFolderId) return driveFolderId;
    if (!accessToken) {
        console.error('No access token for Drive');
        return null;
    }

    try {
        // Search for existing folder
        const searchResponse = await fetch(
            `https://www.googleapis.com/drive/v3/files?q=name='${DRIVE_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const searchResult = await searchResponse.json();

        if (searchResult.files && searchResult.files.length > 0) {
            driveFolderId = searchResult.files[0].id;
            console.log('Found existing Drive folder:', driveFolderId);
            return driveFolderId;
        }

        // Create new folder
        const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: DRIVE_FOLDER_NAME,
                mimeType: 'application/vnd.google-apps.folder'
            })
        });
        const folder = await createResponse.json();
        driveFolderId = folder.id;
        console.log('Created Drive folder:', driveFolderId);

        // Set folder sharing to domain with link
        await setDomainSharing(driveFolderId);

        return driveFolderId;
    } catch (error) {
        console.error('Failed to get/create Drive folder:', error);
        return null;
    }
}

async function uploadToDrive(file, weekNumber) {
    const folderId = await getOrCreateDriveFolder();
    if (!folderId) {
        showToast('Could not access Google Drive', 'error');
        return null;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `Week${weekNumber}_${timestamp}_${file.name}`;

    try {
        // Create file metadata
        const metadata = {
            name: filename,
            parents: [folderId]
        };

        // Use multipart upload
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', file);

        const uploadResponse = await fetch(
            'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,thumbnailLink',
            {
                method: 'POST',
                headers: { Authorization: `Bearer ${accessToken}` },
                body: form
            }
        );
        const uploadedFile = await uploadResponse.json();

        if (uploadedFile.error) {
            console.error('Drive upload error:', uploadedFile.error);
            showToast('Upload failed: ' + uploadedFile.error.message, 'error');
            return null;
        }

        // Set file sharing to domain with link
        await setDomainSharing(uploadedFile.id);

        console.log('Uploaded to Drive:', uploadedFile);

        // Use thumbnailLink from API if available, otherwise construct URL
        // lh3 format works best for embedding shared images
        const thumbUrl = uploadedFile.thumbnailLink ||
            `https://lh3.googleusercontent.com/d/${uploadedFile.id}=w400`;

        return {
            id: uploadedFile.id,
            name: uploadedFile.name,
            webViewLink: uploadedFile.webViewLink,
            thumbnailLink: thumbUrl
        };
    } catch (error) {
        console.error('Drive upload failed:', error);
        showToast('Upload failed', 'error');
        return null;
    }
}

async function setDomainSharing(fileId) {
    try {
        await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                role: 'reader',
                type: 'domain',
                domain: 'vicksburgschools.org' // Your school domain
            })
        });
        console.log('Set domain sharing for:', fileId);
    } catch (error) {
        console.error('Failed to set sharing:', error);
        // Fall back to "anyone with link" if domain sharing fails
        try {
            await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    role: 'reader',
                    type: 'anyone'
                })
            });
            console.log('Fell back to anyone-with-link sharing for:', fileId);
        } catch (e) {
            console.error('Failed to set any sharing:', e);
        }
    }
}

function signOut() {
    const email = state.student ? state.student.email : '';
    google.accounts.id.revoke(email, () => {
        stopAutoSave();
        state = {
            student: null,
            weeklyReflections: {},
            deliverables: {},
            evidence: [],
            currentWeek: 1,
            selectedWeek: 1
        };
        isDirty = false;
        formInitialized = false;

        // Reset sidebar
        document.getElementById('saveStatus').style.display = 'none';
        document.getElementById('signOutBtn').style.display = 'none';
        document.getElementById('studentName').textContent = 'Not Signed In';
        document.getElementById('teamBadge').textContent = 'No Team';
        document.getElementById('avatarInitials').textContent = '--';
        document.getElementById('progressFill').style.width = '0%';
        document.getElementById('progressText').textContent = '0 / 900 pts';

        // Re-render sign-in button and show modal
        google.accounts.id.renderButton(
            document.getElementById('googleSignInBtn'),
            { theme: 'outline', size: 'large', width: 300, text: 'signin_with' }
        );
        document.getElementById('signinModal').classList.add('active');

        showToast('You have been signed out.', 'info');
    });
}

// ============================================
// CLOUD STORAGE
// ============================================
async function loadStudentFromCloud(email) {
    if (CONFIG.SHEETS_API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
        console.log('Google Sheets not configured — starting fresh');
        return null;
    }

    try {
        const response = await fetch(
            CONFIG.SHEETS_API_URL + '?action=load&email=' + encodeURIComponent(email)
        );
        const data = await response.json();
        // Debug: log evidence data to help troubleshoot
        if (data && data.evidence) {
            console.log('📷 Evidence loaded from cloud:', data.evidence.length, 'items');
            data.evidence.forEach((e, i) => {
                console.log(`  [${i}] driveId: ${e.driveId || 'NONE'}, thumbnailLink: ${e.thumbnailLink ? 'YES' : 'NONE'}`);
            });
        }
        return (data && data.student) ? data : null;
    } catch (error) {
        console.error('Failed to load from cloud:', error);
        return null;
    }
}

async function saveToCloud() {
    if (CONFIG.SHEETS_API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
        console.log('Google Sheets not configured — cannot save');
        return;
    }
    if (!state.student) return;

    captureReflectionFormData();
    setSaveIndicator('saving');

    // Prepare evidence without base64 data to reduce payload size
    const evidenceForSync = (state.evidence || []).map(e => ({
        ...e,
        data: undefined // Strip base64 data for cloud sync
    }));

    try {
        const response = await fetch(CONFIG.SHEETS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain' // Required for Google Apps Script CORS
            },
            body: JSON.stringify({
                action: 'sync',
                student: state.student,
                weeklyReflections: state.weeklyReflections,
                deliverables: state.deliverables,
                evidence: evidenceForSync,
                timestamp: new Date().toISOString()
            })
        });

        const result = await response.json();

        if (result.success) {
            isDirty = false;
            setSaveIndicator('saved');
            console.log('Synced successfully:', result.timestamp, 'Backend:', result.backendVersion);
        } else {
            console.error('Sync returned error:', result.error);
            setSaveIndicator('error');
            showToast('Sync failed: ' + (result.error || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Save to cloud failed:', error);
        setSaveIndicator('error');
        showToast('Connection error - changes saved locally', 'warning');
    }
}

async function loadTeamData() {
    if (CONFIG.SHEETS_API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
        return getMockTeamData();
    }

    try {
        const response = await fetch(
            CONFIG.SHEETS_API_URL + '?action=team&team=' + state.student.team + '&period=' + state.student.period
        );
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
// AUTO-SAVE
// ============================================
function startAutoSave() {
    stopAutoSave();
    autoSaveTimer = setInterval(() => {
        if (isDirty) saveToCloud();
    }, CONFIG.AUTO_SAVE_INTERVAL);
}

function stopAutoSave() {
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
        autoSaveTimer = null;
    }
}

function saveEvidenceLocal() {
    if (state.student && state.evidence.length > 0) {
        try {
            localStorage.setItem('evidence_' + state.student.email, JSON.stringify(state.evidence));
        } catch (e) {
            console.warn('localStorage full — evidence not saved locally:', e);
        }
    }
}

function restoreEvidenceLocal() {
    if (!state.student) return;
    try {
        const stored = localStorage.getItem('evidence_' + state.student.email);
        if (!stored) return;
        const localEvidence = JSON.parse(stored);
        // Restore base64 data for any items missing it (stripped during cloud sync)
        state.evidence.forEach(item => {
            if (!item.data) {
                const match = localEvidence.find(l => l.filename === item.filename && l.uploadedAt === item.uploadedAt);
                if (match) item.data = match.data;
            }
        });
        // Add any local items not yet in cloud state
        localEvidence.forEach(localItem => {
            const exists = state.evidence.some(e => e.filename === localItem.filename && e.uploadedAt === localItem.uploadedAt);
            if (!exists) state.evidence.push(localItem);
        });
    } catch (e) {
        console.warn('Failed to restore evidence from localStorage:', e);
    }
}

function markDirty() {
    isDirty = true;
    setSaveIndicator('pending');
}

function setSaveIndicator(status) {
    const statusDiv = document.getElementById('saveStatus');
    const icon = document.getElementById('saveIcon');
    const text = document.getElementById('saveText');
    statusDiv.style.display = 'block';

    const styles = {
        saving:  { cls: 'fas fa-sync-alt fa-spin', color: '#1a73e8', label: 'Saving...' },
        saved:   { cls: 'fas fa-check-circle',     color: '#4caf50', label: 'Saved' },
        pending: { cls: 'fas fa-circle',           color: '#fbbc04', label: 'Unsaved changes' },
        error:   { cls: 'fas fa-exclamation-circle', color: '#ea4335', label: 'Save failed' }
    };

    const s = styles[status] || styles.pending;
    icon.className = s.cls;
    icon.style.color = s.color;
    text.textContent = s.label;
    text.style.color = s.color;
}

// ============================================
// PROFILE SETUP (first sign-in only)
// ============================================
function initProfileForm() {
    const form = document.getElementById('profileForm');
    const fresh = form.cloneNode(true);
    form.parentNode.replaceChild(fresh, form);

    fresh.addEventListener('submit', (e) => {
        e.preventDefault();
        state.student = {
            name: state.student.name,
            email: state.student.email,
            team: document.getElementById('setupTeam').value,
            period: document.getElementById('setupPeriod').value,
            createdAt: new Date().toISOString()
        };
        document.getElementById('profileModal').classList.remove('active');
        onAuthenticated();
        showToast('Welcome! Your portfolio is ready.', 'success');
    });
}

// ============================================
// ON AUTHENTICATED — called after sign-in is fully resolved
// ============================================
function onAuthenticated() {
    document.getElementById('signOutBtn').style.display = 'inline-flex';

    initWeeklyReflectionForm();
    initEvidenceUpload();
    attachDirtyListeners();

    calculateCurrentWeek();
    updateUI();

    startAutoSave();
    markDirty(); // ensure first state is persisted
}

// ============================================
// DIRTY TRACKING
// ============================================
function attachDirtyListeners() {
    document.querySelectorAll('input, textarea, select').forEach(el => {
        el.addEventListener('input',  markDirty);
        el.addEventListener('change', markDirty);
    });

    const contribList = document.getElementById('contributionList');
    if (contribList) {
        new MutationObserver(() => {
            contribList.querySelectorAll('input').forEach(input => {
                if (!input.dataset.dirtyListened) {
                    input.addEventListener('input', markDirty);
                    input.dataset.dirtyListened = 'true';
                }
            });
        }).observe(contribList, { childList: true, subtree: true });
    }
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            navigateTo(item.dataset.page);
        });
    });
}

function navigateTo(pageId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageId);
    });
    document.querySelectorAll('.page').forEach(page => {
        page.classList.toggle('active', page.id === `${pageId}Page`);
    });

    switch (pageId) {
        case 'team':      loadTeamView();         break;
        case 'evidence':  loadEvidenceGallery();  break;
        case 'portfolio': loadPortfolioPreview(); break;
    }
}

// ============================================
// UI UPDATES
// ============================================
function updateUI() {
    if (!state.student) return;

    document.getElementById('avatarInitials').textContent = getInitials(state.student.name);
    document.getElementById('studentName').textContent = state.student.name;
    document.getElementById('teamBadge').textContent = formatTeamName(state.student.team);

    const completedDeliverables = Object.values(state.deliverables).filter(d => d.status === 'completed').length;
    const completedReflections = Object.keys(state.weeklyReflections).filter(k => state.weeklyReflections[k].submitted).length;

    document.getElementById('completedCount').textContent = completedDeliverables + completedReflections;
    document.getElementById('pendingCount').textContent = (10 - completedDeliverables) + (9 - completedReflections);
    document.getElementById('totalPoints').textContent = calculatePoints();
    document.getElementById('currentWeek').textContent = state.currentWeek;

    const progress = calculateProgress();
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = `${calculatePoints()} / ${CONFIG.POINTS.TOTAL_POSSIBLE} pts`;

    updateTimeline();
    updateUpcoming();
    updateWeekButtons();
    updateDeliverablesList();
}

function calculatePoints() {
    let points = 0;
    Object.keys(state.weeklyReflections).forEach(week => {
        if (state.weeklyReflections[week].submitted) points += CONFIG.POINTS.WEEKLY_REFLECTION;
    });
    DELIVERABLES.forEach(d => {
        if (state.deliverables[d.id]?.status === 'completed') points += d.points;
    });
    return points;
}

function calculateProgress() {
    return Math.round((calculatePoints() / CONFIG.POINTS.TOTAL_POSSIBLE) * 100);
}

function calculateCurrentWeek() {
    const now = new Date();
    const diffTime = now - CONFIG.SEMESTER_START;
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    state.currentWeek = Math.min(Math.max(1, diffWeeks), 9);
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

    if (!state.weeklyReflections[state.currentWeek]?.submitted) {
        upcoming.push({ title: `Week ${state.currentWeek} Reflection`, due: 'Friday', points: 20, overdue: false });
    }

    const currentDeliverable = DELIVERABLES.find(d => d.week === state.currentWeek);
    if (currentDeliverable && state.deliverables[currentDeliverable.id]?.status !== 'completed') {
        upcoming.push({ title: currentDeliverable.title, due: `End of Week ${state.currentWeek}`, points: currentDeliverable.points, overdue: false });
    }

    for (let week = 1; week < state.currentWeek; week++) {
        if (!state.weeklyReflections[week]?.submitted) {
            upcoming.unshift({ title: `Week ${week} Reflection`, due: 'OVERDUE', points: 20, overdue: true });
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
        btn.classList.toggle('completed', !!state.weeklyReflections[week]?.submitted);
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

    list.querySelectorAll('.deliverable-card').forEach(card => {
        card.addEventListener('click', () => openDeliverableForm(parseInt(card.dataset.id)));
    });
}

// ============================================
// WEEKLY REFLECTION FORM
// ============================================
function initWeeklyReflectionForm() {
    document.querySelectorAll('.week-btn').forEach(btn => {
        btn.addEventListener('click', () => selectWeek(parseInt(btn.dataset.week)));
    });

    document.getElementById('addContribution').addEventListener('click', addContributionRow);
    document.getElementById('weeklyReflectionForm').addEventListener('submit', submitWeeklyReflection);
    document.getElementById('saveReflectionDraft').addEventListener('click', saveReflectionDraft);

    // Rubric change listeners for live score updates
    document.querySelectorAll('.rubric-options input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
            updateRubricScore();
            markDirty();
        });
    });

    selectWeek(state.currentWeek);
}

function selectWeek(week) {
    // Only capture form data if form has been populated (not on initial load)
    if (formInitialized) {
        captureReflectionFormData();
    }

    state.selectedWeek = week;
    document.getElementById('reflectionWeek').value = week;

    document.querySelectorAll('.week-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.week) === week);
    });

    const existingData = state.weeklyReflections[week];
    if (existingData) {
        loadReflectionData(existingData);
    } else {
        clearReflectionForm();
    }

    // Mark form as initialized after first load
    formInitialized = true;
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

    while (contribList.children.length < 3) addContributionRow();

    document.getElementById('evidenceLinks').value = data.evidenceLinks || '';
    document.getElementById('challenges').value = data.challenges || '';
    document.getElementById('solutions').value = data.solutions || '';

    const goalInputs = document.querySelectorAll('.goal-input');
    (data.goals || []).forEach((goal, index) => {
        if (goalInputs[index]) goalInputs[index].value = goal;
    });

    // Restore rubric selections
    if (data.rubric) {
        const rubricFields = ['Detail', 'Evidence', 'ProblemSolving', 'Goals'];
        rubricFields.forEach(field => {
            const value = data.rubric[field.toLowerCase()] || data.rubric[field.charAt(0).toLowerCase() + field.slice(1)];
            if (value) {
                const radio = document.querySelector(`input[name="rubric${field}"][value="${value}"]`);
                if (radio) radio.checked = true;
            }
        });
        updateRubricScore();
    } else {
        // Clear rubric if no data
        document.querySelectorAll('.rubric-options input[type="radio"]').forEach(r => r.checked = false);
        updateRubricScore();
    }

    // Hide validation errors when loading
    document.getElementById('validationErrors').style.display = 'none';

    // Show teacher feedback if available
    showTeacherFeedback(data);

    // Restore evidence thumbnails for the selected week from state
    // Supports both legacy base64 (ev.data) and Drive-based (ev.thumbnailLink)
    const preview = document.getElementById('evidencePreview');
    preview.innerHTML = '';
    state.evidence
        .filter(ev => ev.week === state.selectedWeek && (ev.data || ev.thumbnailLink))
        .forEach(ev => {
            const imgSrc = ev.thumbnailLink || ev.data;
            const thumb = document.createElement('div');
            thumb.className = 'evidence-thumb';
            thumb.innerHTML = `
                <img src="${imgSrc}" alt="Evidence" onerror="this.src='${PLACEHOLDER_IMG}'">
                <button type="button" class="remove-btn" onclick="removeEvidence('${ev.driveId || ''}', this.parentElement)">
                    <i class="fas fa-times"></i>
                </button>
            `;
            preview.appendChild(thumb);
        });
}

function clearReflectionForm() {
    document.getElementById('weeklyReflectionForm').reset();
    document.getElementById('contributionList').innerHTML = `
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

    // Clear rubric selections
    document.querySelectorAll('.rubric-options input[type="radio"]').forEach(r => r.checked = false);
    updateRubricScore();

    // Hide validation errors
    document.getElementById('validationErrors').style.display = 'none';

    // Hide teacher feedback
    document.getElementById('teacherFeedbackCard').style.display = 'none';
}

function showTeacherFeedback(data) {
    const feedbackCard = document.getElementById('teacherFeedbackCard');
    const gradeDisplay = document.getElementById('teacherGradeDisplay');
    const feedbackText = document.getElementById('teacherFeedbackText');

    if (data.submitted && (data.teacherGrade !== undefined || data.teacherFeedback)) {
        feedbackCard.style.display = 'block';
        gradeDisplay.textContent = data.teacherGrade !== undefined ? data.teacherGrade : '--';
        feedbackText.textContent = data.teacherFeedback || 'No written feedback yet.';
    } else {
        feedbackCard.style.display = 'none';
    }
}

function getReflectionFormData() {
    const contributions = [];
    document.querySelectorAll('.contribution-item').forEach(item => {
        const date = item.querySelector('.contrib-date').value;
        const task = item.querySelector('.contrib-task').value;
        if (date && task) contributions.push({ date, task });
    });

    const goals = [];
    document.querySelectorAll('.goal-input').forEach(input => {
        if (input.value) goals.push(input.value);
    });

    // Get rubric scores
    const rubric = {
        detail: parseInt(document.querySelector('input[name="rubricDetail"]:checked')?.value) || 0,
        evidence: parseInt(document.querySelector('input[name="rubricEvidence"]:checked')?.value) || 0,
        problemSolving: parseInt(document.querySelector('input[name="rubricProblemSolving"]:checked')?.value) || 0,
        goals: parseInt(document.querySelector('input[name="rubricGoals"]:checked')?.value) || 0
    };
    rubric.total = rubric.detail + rubric.evidence + rubric.problemSolving + rubric.goals;

    return {
        week: state.selectedWeek,
        contributions,
        evidenceLinks: document.getElementById('evidenceLinks').value,
        challenges: document.getElementById('challenges').value,
        solutions: document.getElementById('solutions').value,
        goals,
        rubric,
        updatedAt: new Date().toISOString()
    };
}

function captureReflectionFormData() {
    if (!state.selectedWeek) return;
    const data = getReflectionFormData();
    const existing = state.weeklyReflections[state.selectedWeek];
    if (existing) {
        data.submitted = existing.submitted;
        data.submittedAt = existing.submittedAt;
    }
    state.weeklyReflections[state.selectedWeek] = data;
}

function saveReflectionDraft() {
    const data = getReflectionFormData();
    data.submitted = false;
    state.weeklyReflections[data.week] = data;
    markDirty();
    showToast('Draft saved!', 'success');
}

function validateReflection(data) {
    const errors = [];
    const MIN_TASK_LENGTH = 15;
    const MIN_TEXT_LENGTH = 30;
    const MIN_GOAL_LENGTH = 10;

    // Check contributions count
    if (data.contributions.length < 3) {
        errors.push('Add at least 3 work contributions');
    }

    // Check contribution task lengths
    data.contributions.forEach((c, i) => {
        if (c.task.length < MIN_TASK_LENGTH) {
            errors.push(`Contribution ${i + 1} needs more detail (${c.task.length}/${MIN_TASK_LENGTH} characters)`);
        }
    });

    // FRC-specific: catch "we" statements
    data.contributions.forEach((c, i) => {
        if (c.task.toLowerCase().startsWith('we ') || c.task.toLowerCase().includes(' we ')) {
            errors.push(`Contribution ${i + 1}: Use "I" statements instead of "we" to document YOUR contributions`);
        }
    });

    // Check challenges and solutions
    if (data.challenges.length < MIN_TEXT_LENGTH) {
        errors.push(`Challenges needs more detail (${data.challenges.length}/${MIN_TEXT_LENGTH} characters)`);
    }
    if (data.solutions.length < MIN_TEXT_LENGTH) {
        errors.push(`Solutions needs more detail (${data.solutions.length}/${MIN_TEXT_LENGTH} characters)`);
    }

    // Check goals
    data.goals.forEach((g, i) => {
        if (g.length < MIN_GOAL_LENGTH) {
            errors.push(`Goal ${i + 1} needs more detail (${g.length}/${MIN_GOAL_LENGTH} characters)`);
        }
    });

    // Check evidence - require at least 1 photo OR a link
    const hasPhotos = state.evidence.filter(e => e.week === state.selectedWeek).length > 0;
    const hasLinks = data.evidenceLinks.trim().length > 0;
    if (!hasPhotos && !hasLinks) {
        errors.push('Add at least 1 evidence photo or link');
    }

    // Check rubric is completed
    if (data.rubric.total === 0) {
        errors.push('Complete the self-assessment rubric');
    }

    return errors;
}

function showValidationErrors(errors) {
    const container = document.getElementById('validationErrors');
    const list = document.getElementById('errorList');

    if (errors.length === 0) {
        container.style.display = 'none';
        return;
    }

    list.innerHTML = errors.map(e => `<li>${e}</li>`).join('');
    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function updateRubricScore() {
    const detail = parseInt(document.querySelector('input[name="rubricDetail"]:checked')?.value) || 0;
    const evidence = parseInt(document.querySelector('input[name="rubricEvidence"]:checked')?.value) || 0;
    const problemSolving = parseInt(document.querySelector('input[name="rubricProblemSolving"]:checked')?.value) || 0;
    const goals = parseInt(document.querySelector('input[name="rubricGoals"]:checked')?.value) || 0;
    const total = detail + evidence + problemSolving + goals;

    const scoreEl = document.getElementById('rubricScore');
    if (scoreEl) {
        scoreEl.innerHTML = `<strong>Self-Assessment Total:</strong> ${total} / 16 points`;
        scoreEl.style.color = total >= 12 ? 'var(--success)' : total >= 8 ? 'var(--warning)' : 'var(--gray-600)';
    }
}

function submitWeeklyReflection(e) {
    e.preventDefault();
    const data = getReflectionFormData();

    // Validate
    const errors = validateReflection(data);
    showValidationErrors(errors);

    if (errors.length > 0) {
        showToast('Please fix the errors before submitting', 'error');
        return;
    }

    data.submitted = true;
    data.submittedAt = new Date().toISOString();
    state.weeklyReflections[data.week] = data;
    saveToCloud(); // immediate save on submission
    updateUI();

    // Hide validation errors on success
    document.getElementById('validationErrors').style.display = 'none';

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

    fileInput.addEventListener('change', () => handleFiles(fileInput.files));
}

async function handleFiles(files) {
    const preview = document.getElementById('evidencePreview');

    for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;

        // Show uploading placeholder
        const thumb = document.createElement('div');
        thumb.className = 'evidence-thumb uploading';
        thumb.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--gray-100);">
                <i class="fas fa-spinner fa-spin" style="font-size: 24px; color: var(--gray-400);"></i>
            </div>
        `;
        preview.appendChild(thumb);

        // Upload to Google Drive
        const driveFile = await uploadToDrive(file, state.selectedWeek);

        if (driveFile) {
            // Success - update thumbnail with Drive image
            thumb.classList.remove('uploading');
            thumb.innerHTML = `
                <img src="${driveFile.thumbnailLink}" alt="Evidence" onerror="this.src='${PLACEHOLDER_IMG}'">
                <button type="button" class="remove-btn" onclick="removeEvidence('${driveFile.id}', this.parentElement)">
                    <i class="fas fa-times"></i>
                </button>
            `;

            state.evidence.push({
                type: 'weekly',
                week: state.selectedWeek,
                driveId: driveFile.id,
                filename: driveFile.name,
                thumbnailLink: driveFile.thumbnailLink,
                webViewLink: driveFile.webViewLink,
                uploadedAt: new Date().toISOString()
            });
            markDirty();
            showToast('Photo uploaded to Google Drive', 'success');
        } else {
            // Failed - remove placeholder
            thumb.remove();
        }
    }
}

function removeEvidence(driveId, element) {
    // Remove from state
    state.evidence = state.evidence.filter(e => e.driveId !== driveId);
    // Remove from DOM
    element.remove();
    markDirty();
    // Note: We don't delete from Drive - student keeps ownership
}

function compressImage(dataURL, callback) {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Scale down to max 1200px width while maintaining aspect ratio
        const maxWidth = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG at 80% quality (significantly smaller than PNG)
        callback(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = dataURL;
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

    // Attach dirty listeners to dynamically created inputs
    content.querySelectorAll('textarea, input').forEach(el => {
        el.addEventListener('input', markDirty);
    });

    document.getElementById('deliverableForm').addEventListener('submit', (e) => {
        e.preventDefault();
        submitDeliverable(id);
    });

    modal.classList.add('active');
}

function saveDeliverableDraft(id) {
    state.deliverables[id] = {
        ...state.deliverables[id],
        content: document.getElementById('deliverableContent').value,
        links: document.getElementById('deliverableLinks').value,
        selfAssessment: document.getElementById('deliverableSelfAssessment').value,
        status: 'in-progress',
        updatedAt: new Date().toISOString()
    };
    markDirty();
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

    saveToCloud(); // immediate save on submission
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

    document.getElementById('teamMembers').innerHTML = teamData.members.map(member => `
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

    gallery.innerHTML = state.evidence.map(item => {
        // Support both new Drive-based and legacy base64 evidence
        const imgSrc = item.thumbnailLink || item.data || '${PLACEHOLDER_IMG}';
        const viewLink = item.webViewLink || '#';

        return `
            <div class="gallery-item" data-type="${item.type}">
                <a href="${viewLink}" target="_blank" title="View full size">
                    <img src="${imgSrc}" alt="${item.filename || 'Evidence'}" onerror="this.src='${PLACEHOLDER_IMG}'">
                </a>
                <div class="gallery-item-info">
                    <div class="date">${item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString() : 'Unknown'}</div>
                    <div class="caption">Week ${item.week || '?'}</div>
                </div>
            </div>
        `;
    }).join('');

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            document.querySelectorAll('.gallery-item').forEach(item => {
                item.style.display = (filter === 'all' || item.dataset.type === filter) ? '' : 'none';
            });
        });
    });
}

// ============================================
// AI FEATURES
// ============================================
function initAIFeatures() {
    document.querySelectorAll('.ai-option').forEach(option => {
        option.addEventListener('click', () => handleAIAction(option.dataset.action));
    });

    document.getElementById('generateQuestions').addEventListener('click', generatePracticeQuestions);
    document.getElementById('generateTeamPortfolio').addEventListener('click', generateTeamPortfolio);

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
    (r.contributions || []).map(c => `- ${c.task}`).join('\n')
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
        preview.innerHTML = '<p class="placeholder-text">Complete at least 3 deliverables to preview your portfolio...</p>';
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
function hideAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}

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
    const labels = { pending: 'Not Started', 'in-progress': 'In Progress', completed: 'Completed', graded: 'Graded' };
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

// Expose for inline onclick handlers
window.showToast = showToast;
window.saveDeliverableDraft = saveDeliverableDraft;
window.generatePracticeQuestions = generatePracticeQuestions;
