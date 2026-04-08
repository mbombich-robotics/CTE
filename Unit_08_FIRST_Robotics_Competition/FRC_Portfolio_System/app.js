// FRC Engineering Portfolio - Main Application (Google Auth Edition)

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================
// Placeholder image (data URI - won't be blocked by firewalls)
const PLACEHOLDER_IMG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2UwZTBlMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QaG90bzwvdGV4dD48L3N2Zz4=';

const CONFIG = {
    // App version - update when deploying changes
    VERSION: 'v2.9.22',

    // Google Sheets Web App URL (deploy your Apps Script and paste URL here)
    SHEETS_API_URL: 'https://script.google.com/macros/s/AKfycbyXSBw_lCaHusiocLh3B_U1kyOmxyV3WlXhoqEdVAAzUN6U6_6ZCELqSTzzfhH6rUKc/exec',

    // Google OAuth Client ID
    GOOGLE_CLIENT_ID: '1002661691088-8g0dskdehhmgc8jigbua15l3ih7td4ka.apps.googleusercontent.com',

    // Semester start date (adjust for your semester)
    SEMESTER_START: new Date('2026-02-02'),

    // Point values
    POINTS: {
        WEEKLY_REFLECTION: 20,
        TOTAL_POSSIBLE: 1105
    },

    // Auto-save interval in milliseconds
    AUTO_SAVE_INTERVAL: 30000,

    // Shared team weight spreadsheet URL (Week 7 deliverable)
    WEIGHT_SHEET_URL: 'https://docs.google.com/spreadsheets/d/1f9m6rmyez0N8ofEg_AGg90mhhrQVuTDmFWSQn5e6t1s/edit?gid=0#gid=0'
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
        points: 75,
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
        points: 40,
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
            'Pugh Matrix with 3+ design options and 3+ weighted criteria',
            'Individual scoring with justification for winner',
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
        title: 'Testing & Iteration Log (Optional)',
        week: 6,
        optional: true,
        points: 50,
        phase: 'Test',
        description: 'Document post-competition observations, proposed subsystem modifications, and a full component weight inventory.',
        requirements: [
            'Specific observations from competition matches (failures, unexpected behaviors, successes)',
            'At least 2 proposed modifications — each must name the problem it solves and include implementation details',
            'Complete weight inventory: every component listed with quantity and mass',
            'Weight data submitted to the team Weight Sheet'
        ]
    },
    {
        id: 7,
        title: 'Robot Readiness Contributions',
        week: 7,
        points: 50,
        phase: 'Improve',
        description: 'The redesign phase is closing — but two critical tasks are still incomplete: the team weight spreadsheet and the shop. Both need your hands-on attention this week.',
        requirements: [
            'Open the team weight spreadsheet and claim at least 2 subassemblies or components as "Design Responsible"',
            'Physically weigh your claimed components and enter their mass in the spreadsheet',
            'Describe the 5S work you completed in the shop — what area, what you sorted, organized, or cleaned',
            'Add before/after photos of your shop area to the Supporting Links field',
            'Reflect: how does knowing the robot\'s actual mass affect your subsystem\'s design decisions?'
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
    },
    {
        id: 11,
        title: 'Engineer Portfolio — Draft',
        week: 10,
        points: 75,
        phase: 'Portfolio',
        description: 'Use AI to help you draft your section of the team\'s Engineer Portfolio. Your section documents the design journey for your subsystem in a format that FIRST judges can evaluate.',
        requirements: [
            'Use the AI prompts below to draft each section of your subsystem page',
            'Problem Statement: What game challenge does your subsystem solve? What constraints did you face?',
            'Design Iterations: Describe at least 2 approaches you considered — include sketches, photos, or CAD screenshots',
            'Final Design Rationale: Why did you choose this approach? Reference data, weight, or performance',
            'Testing & Results: What did you measure or observe? What changed based on testing?',
            'Paste your AI-drafted text into the reflection field and annotate it — fix anything the AI got wrong'
        ]
    },
    {
        id: 12,
        title: 'Engineer Portfolio — Final',
        week: 11,
        points: 100,
        phase: 'Portfolio',
        description: 'Finalize and polish your portfolio section. This document will go to the FIRST judging panel — it must be accurate, professional, and tell the real story of your design work.',
        requirements: [
            'All four sections complete: Problem Statement, Design Iterations, Final Design, Testing & Results',
            'Minimum 2 photos or diagrams embedded (sketches, CAD, build photos, test data)',
            'Use AI to polish the writing — but every fact must be something you actually did',
            'Have a teammate read your draft and give written feedback (include their name)',
            'Export your final section as a PDF and submit the link in Supporting Links'
        ]
    }
];

// ============================================
// GRADING RUBRICS
// ============================================
const RUBRICS = {
    6: {
        categories: [
            { name: 'Post-Competition Observations', points: 15, criteria: [
                'References specific matches or moments (not vague generalities)',
                'Covers both successes and failures',
                'Describes root causes, not just symptoms'
            ]},
            { name: 'Proposed Modifications', points: 20, criteria: [
                'At least 2 modifications documented',
                'Each modification clearly states the problem it addresses',
                'Implementation details: materials, dimensions, or approach described',
                'Priority assigned and reasoning given'
            ]},
            { name: 'Weight Documentation', points: 15, criteria: [
                'All major components listed by name',
                'Quantities and unit masses provided for each component',
                'Totals calculated correctly',
                'Data submitted to team Weight Sheet'
            ]}
        ]
    },
    11: {
        categories: [
            { name: 'Problem Statement', points: 15, criteria: [
                'Clearly states what game challenge the subsystem addresses',
                'Mentions at least one design constraint (weight, space, rules)',
                'Written in first person — your perspective, not the team\'s'
            ]},
            { name: 'Design Iterations', points: 25, criteria: [
                'At least 2 distinct approaches documented',
                'Each approach includes visual evidence (sketch, photo, or CAD)',
                'Explains why each option was considered or rejected'
            ]},
            { name: 'Final Design Rationale', points: 20, criteria: [
                'States clearly what design was chosen',
                'References at least one data point, measurement, or performance metric',
                'Connects the decision back to the problem statement'
            ]},
            { name: 'Testing & Results', points: 15, criteria: [
                'Describes at least one specific test performed',
                'Includes an observable or measurable result',
                'Notes one thing that changed based on testing'
            ]}
        ]
    },
    12: {
        categories: [
            { name: 'Completeness', points: 20, criteria: [
                'All four sections present and substantive',
                'Minimum 2 photos or diagrams with captions',
                'Covers the full design journey from problem to final result'
            ]},
            { name: 'Technical Accuracy', points: 30, criteria: [
                'All facts, measurements, and claims are accurate',
                'AI-generated text has been reviewed and corrected',
                'Technical terminology used correctly for the subsystem'
            ]},
            { name: 'Professional Writing', points: 25, criteria: [
                'Clear, concise sentences — no filler phrases',
                'Consistent formatting throughout',
                'Reads like a professional engineering document, not a class assignment'
            ]},
            { name: 'Peer Review', points: 15, criteria: [
                'Teammate feedback included or referenced',
                'Evidence that feedback was acted on',
                'Reviewer\'s name noted'
            ]},
            { name: 'Submission', points: 10, criteria: [
                'PDF exported and link submitted in Supporting Links',
                'File is legible and properly formatted'
            ]}
        ]
    },
    4: {
        categories: [
            { name: 'Pugh Matrix', points: 25, criteria: [
                '3+ design options with descriptive names',
                '3+ criteria with appropriate weights (1-5)',
                'All cells scored (+, S, or -)',
                'Totals calculated correctly'
            ]},
            { name: 'Justification', points: 15, criteria: [
                'Explains why the winning design scored highest',
                'References specific criteria and scores',
                'Connects choice to project goals'
            ]},
            { name: 'Personal Contribution', points: 10, criteria: [
                'Describes your specific role in the decision process',
                'Concrete examples of your input'
            ]}
        ]
    }
};

function renderRubricCard(deliverableId) {
    const rubric = RUBRICS[deliverableId];
    if (!rubric) return '';
    const totalPts = rubric.categories.reduce((sum, c) => sum + c.points, 0);
    return `
        <div class="card" style="margin-bottom: 20px; border-left: 3px solid #8b5cf6;">
            <h4 style="margin-bottom: 0; cursor: pointer; display: flex; align-items: center; justify-content: space-between;"
                onclick="const d=this.nextElementSibling; const a=d.style.display==='none'?'block':'none'; d.style.display=a; this.querySelector('.toggle-icon').textContent=a==='none'?'▸':'▾';">
                <span><i class="fas fa-star"></i> Grading Rubric (${totalPts} pts)</span>
                <span class="toggle-icon" style="font-size: 16px;">▸</span>
            </h4>
            <div style="display: none; margin-top: 12px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--gray-200);">
                            <th style="text-align: left; padding: 8px;">Category</th>
                            <th style="text-align: center; padding: 8px; width: 60px;">Points</th>
                            <th style="text-align: left; padding: 8px;">What I'm Looking For</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rubric.categories.map(cat => `
                            <tr style="border-bottom: 1px solid var(--gray-100); vertical-align: top;">
                                <td style="padding: 8px; font-weight: 600;">${cat.name}</td>
                                <td style="padding: 8px; text-align: center; font-weight: 600;">${cat.points}</td>
                                <td style="padding: 8px;">
                                    <ul style="margin: 0; padding-left: 18px;">
                                        ${cat.criteria.map(c => `<li style="margin-bottom: 4px;">${c}</li>`).join('')}
                                    </ul>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ============================================
// APPLICATION STATE
// ============================================
let state = {
    student: null,
    weeklyReflections: {},
    deliverables: {},
    evidence: [],
    codeSnippets: [],
    viewedFeedback: [],  // Track which feedback notifications have been viewed
    currentWeek: 1,
    selectedWeek: 1,
    config: {
        skipReflectionWeeks: [],   // default — overwritten by backend on load
        skipDeliverableWeeks: [],
        expectedVersion: null
    }
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
            // config is not persisted in cloud state — restore default so it's never undefined
            state.config = { skipReflectionWeeks: [], skipDeliverableWeeks: [], expectedVersion: null };
            restoreEvidenceLocal();
            calculateCurrentWeek();
            hideAllModals();
            onAuthenticated();
        } else if (cloudData && cloudData.loadError) {
            // Server unreachable — show persistent banner, don't treat as new student
            hideAllModals();
            showOutageBanner(email, name);
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

        // Construct thumbnail URL using Google's thumbnail endpoint
        // This format works reliably for domain-shared files
        const thumbUrl = `https://drive.google.com/thumbnail?id=${uploadedFile.id}&sz=w400`;

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
        return { loadError: true };
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

    // Fetch remote config and start version-check polling
    fetchConfig();
    setInterval(fetchConfig, 5 * 60 * 1000);
}

async function fetchConfig() {
    try {
        const res = await fetch(CONFIG.SHEETS_API_URL + '?action=getConfig&_t=' + Date.now());
        const cfg = await res.json();
        if (cfg.error) return;

        state.config.skipReflectionWeeks  = cfg.skipReflectionWeeks  || [];
        state.config.skipDeliverableWeeks = cfg.skipDeliverableWeeks || [];

        const expected = cfg.expectedVersion;
        if (expected && expected !== CONFIG.VERSION) {
            if (!isDirty) {
                location.reload();
            } else {
                showUpdateBanner();
            }
        }

        updateUI();
    } catch(e) { /* silent — keep existing config */ }
}

function showUpdateBanner() {
    if (document.getElementById('updateBanner')) return;
    const banner = document.createElement('div');
    banner.id = 'updateBanner';
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#f59e0b;color:#1a1a1a;text-align:center;padding:12px 20px;font-weight:600;z-index:9999;font-size:14px;';
    banner.innerHTML = '⚠️ A new version of the portfolio is available. <a href="#" onclick="location.reload()" style="color:#1a1a1a;text-decoration:underline;font-weight:700;">Refresh the page</a> to update — your draft is auto-saved.';
    document.body.prepend(banner);
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
    const completedRequiredDeliverables = DELIVERABLES.filter(d => !d.optional && state.deliverables[d.id]?.status === 'completed').length;
    const requiredDeliverableCount = DELIVERABLES.filter(d => !d.optional).length;

    document.getElementById('completedCount').textContent = completedDeliverables + completedReflections;
    const requiredReflectionCount = 9 - state.config.skipReflectionWeeks.length;
    document.getElementById('pendingCount').textContent = (requiredDeliverableCount - completedRequiredDeliverables) + (requiredReflectionCount - completedReflections);
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
        const reflection = state.weeklyReflections[week];
        if (reflection.submitted) {
            // Use teacher grade if available, otherwise use default points
            if (reflection.teacherGrade !== undefined) {
                points += Number(reflection.teacherGrade) || 0;
            } else {
                points += CONFIG.POINTS.WEEKLY_REFLECTION;
            }
        }
    });
    DELIVERABLES.forEach(d => {
        const deliverable = state.deliverables[d.id];
        if (deliverable?.status === 'completed') {
            // Use teacher grade if available, otherwise use default points
            if (deliverable.teacherGrade !== undefined) {
                points += Number(deliverable.teacherGrade) || 0;
            } else {
                points += d.points;
            }
        }
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

    if (!state.config.skipReflectionWeeks.includes(state.currentWeek) && !state.weeklyReflections[state.currentWeek]?.submitted) {
        upcoming.push({ title: `Week ${state.currentWeek} Reflection`, due: 'Friday', points: 20, overdue: false });
    }

    const currentDeliverable = DELIVERABLES.find(d => d.week === state.currentWeek);
    if (currentDeliverable && !currentDeliverable.optional && state.deliverables[currentDeliverable.id]?.status !== 'completed') {
        upcoming.push({ title: currentDeliverable.title, due: `End of Week ${state.currentWeek}`, points: currentDeliverable.points, overdue: false });
    }

    for (let week = 1; week < state.currentWeek; week++) {
        if (!state.config.skipReflectionWeeks.includes(week) && !state.weeklyReflections[week]?.submitted) {
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
        <input type="date" class="contrib-date" min="2020-01-01" max="2030-12-31" required>
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
            <input type="date" class="contrib-date" min="2020-01-01" max="2030-12-31" value="${contrib.date}" required>
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
            <input type="date" class="contrib-date" min="2020-01-01" max="2030-12-31" required>
            <input type="text" class="contrib-task" placeholder="I designed the..." required>
        </div>
        <div class="contribution-item">
            <input type="date" class="contrib-date" min="2020-01-01" max="2030-12-31" required>
            <input type="text" class="contrib-task" placeholder="I built/coded/tested..." required>
        </div>
        <div class="contribution-item">
            <input type="date" class="contrib-date" min="2020-01-01" max="2030-12-31" required>
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
        if (date && task) {
            // Reject dates with unreasonable years (prevents year-10000 data corruption)
            const year = parseInt(date.substring(0, 4));
            if (year >= 2020 && year <= 2030) {
                contributions.push({ date, task });
            }
        }
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

    showCelebration(`Week ${data.week} Reflection Submitted!`);
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

    // For custom-form deliverables (4, 6), rawContent is not used — suppress to empty
    const textareaContent = ((id === 4 || id === 6) && existing.rawContent !== undefined) ? existing.rawContent : (existing.content || '');

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

        ${renderRubricCard(id)}

        <form id="deliverableForm" style="margin-top: 20px;">
            ${id === 4 ? `
            <div class="card" style="margin-bottom: 20px; border-left: 3px solid var(--primary);">
                <h4 style="margin-bottom: 0; cursor: pointer; display: flex; align-items: center; justify-content: space-between;"
                    onclick="const d=this.nextElementSibling; const a=d.style.display==='none'?'block':'none'; d.style.display=a; this.querySelector('.toggle-icon').textContent=a==='none'?'▸':'▾';">
                    <span><i class="fas fa-info-circle"></i> Instructions & Example</span>
                    <span class="toggle-icon" style="font-size: 16px;">▸</span>
                </h4>
                <div style="display: none; margin-top: 12px; font-size: 14px; color: var(--gray-600);">
                    <p style="margin-bottom: 10px;"><strong>A Pugh Matrix</strong> compares design options against a baseline using weighted criteria.</p>
                    <ol style="margin-left: 20px; margin-bottom: 14px;">
                        <li>Name your design options (Idea 1 is the baseline)</li>
                        <li>Choose 3-5 evaluation criteria (cost, durability, etc.)</li>
                        <li>Assign weights (1-5, higher = more important)</li>
                        <li>Score each option vs. baseline: <strong>+</strong> (better), <strong>S</strong> (same), <strong>-</strong> (worse)</li>
                        <li>Weighted scores are calculated automatically</li>
                        <li>Highest total = recommended design</li>
                    </ol>
                    <p style="margin-bottom: 8px;"><strong>Example:</strong></p>
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 8px;">
                        <thead>
                            <tr style="background: var(--gray-100);">
                                <th style="padding: 6px 8px; text-align: left; border: 1px solid var(--gray-200);">Criteria</th>
                                <th style="padding: 6px 8px; text-align: center; border: 1px solid var(--gray-200); width: 50px;">Weight</th>
                                <th style="padding: 6px 8px; text-align: center; border: 1px solid var(--gray-200);">Linkage (Baseline)</th>
                                <th style="padding: 6px 8px; text-align: center; border: 1px solid var(--gray-200);">Gear Drive</th>
                                <th style="padding: 6px 8px; text-align: center; border: 1px solid var(--gray-200);">Belt Drive</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 6px 8px; border: 1px solid var(--gray-200);">Cost</td>
                                <td style="padding: 6px 8px; text-align: center; border: 1px solid var(--gray-200);">3</td>
                                <td style="padding: 6px 8px; text-align: center; border: 1px solid var(--gray-200);">0</td>
                                <td style="padding: 6px 8px; text-align: center; border: 1px solid var(--gray-200);">+ (3)</td>
                                <td style="padding: 6px 8px; text-align: center; border: 1px solid var(--gray-200);">S (0)</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 8px; border: 1px solid var(--gray-200);">Durability</td>
                                <td style="padding: 6px 8px; text-align: center; border: 1px solid var(--gray-200);">4</td>
                                <td style="padding: 6px 8px; text-align: center; border: 1px solid var(--gray-200);">0</td>
                                <td style="padding: 6px 8px; text-align: center; border: 1px solid var(--gray-200);">S (0)</td>
                                <td style="padding: 6px 8px; text-align: center; border: 1px solid var(--gray-200);">- (-4)</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 8px; border: 1px solid var(--gray-200);">Ease of Fabrication</td>
                                <td style="padding: 6px 8px; text-align: center; border: 1px solid var(--gray-200);">2</td>
                                <td style="padding: 6px 8px; text-align: center; border: 1px solid var(--gray-200);">0</td>
                                <td style="padding: 6px 8px; text-align: center; border: 1px solid var(--gray-200);">+ (2)</td>
                                <td style="padding: 6px 8px; text-align: center; border: 1px solid var(--gray-200);">- (-2)</td>
                            </tr>
                            <tr style="background: var(--gray-50); font-weight: bold;">
                                <td style="padding: 6px 8px; border: 1px solid var(--gray-200);">TOTAL</td>
                                <td style="padding: 6px 8px; border: 1px solid var(--gray-200);"></td>
                                <td style="padding: 6px 8px; text-align: center; border: 1px solid var(--gray-200);">0</td>
                                <td style="padding: 6px 8px; text-align: center; border: 1px solid var(--gray-200); color: var(--success);">+5</td>
                                <td style="padding: 6px 8px; text-align: center; border: 1px solid var(--gray-200); color: var(--danger);">-6</td>
                            </tr>
                        </tbody>
                    </table>
                    <p style="font-style: italic;">Result: Gear Drive scores highest (+5). It's cheaper and easier to make, with equal durability.</p>
                </div>
            </div>

            <div class="card" style="margin-bottom: 20px; border-left: 3px solid var(--success);">
                <h4 style="margin-bottom: 12px;"><i class="fas fa-table"></i> Pugh Decision Matrix</h4>
                <p style="color: var(--gray-500); font-size: 13px; margin-bottom: 12px;">Name your design options, add criteria with weights, and score each option against the baseline.</p>

                <div style="margin-bottom: 12px;">
                    <label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 6px;">Design Options</label>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 140px;">
                            <label style="font-size: 11px; color: var(--gray-500);">Baseline (Idea 1)</label>
                            <input type="text" class="pugh-option" data-col="0" value="${(existing.options && existing.options[0]) || ''}" placeholder="e.g. Linkage Arm" style="width: 100%; padding: 6px; border: 1px solid var(--gray-200); border-radius: 4px;">
                        </div>
                        <div style="flex: 1; min-width: 140px;">
                            <label style="font-size: 11px; color: var(--gray-500);">Option 2</label>
                            <input type="text" class="pugh-option" data-col="1" value="${(existing.options && existing.options[1]) || ''}" placeholder="e.g. Gear Drive" style="width: 100%; padding: 6px; border: 1px solid var(--gray-200); border-radius: 4px;">
                        </div>
                        <div style="flex: 1; min-width: 140px;">
                            <label style="font-size: 11px; color: var(--gray-500);">Option 3</label>
                            <input type="text" class="pugh-option" data-col="2" value="${(existing.options && existing.options[2]) || ''}" placeholder="e.g. Belt Drive" style="width: 100%; padding: 6px; border: 1px solid var(--gray-200); border-radius: 4px;">
                        </div>
                    </div>
                </div>

                <table id="pughMatrix" style="width: 100%; border-collapse: collapse; text-align: center; font-size: 14px;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--gray-200);">
                            <th style="text-align: left; padding: 8px;">Criteria</th>
                            <th style="padding: 8px; width: 70px;">Weight</th>
                            <th style="padding: 8px;">Baseline</th>
                            <th style="padding: 8px;">Option 2</th>
                            <th style="padding: 8px;">Option 3</th>
                        </tr>
                    </thead>
                    <tbody id="pughRows">
                        ${renderPughRows(existing)}
                    </tbody>
                    <tfoot>
                        <tr style="border-top: 2px solid var(--gray-300); font-weight: bold; background: var(--gray-50);">
                            <td style="padding: 8px; text-align: left;">TOTAL</td>
                            <td style="padding: 8px;"></td>
                            <td style="padding: 8px;"><span class="pugh-total" data-col="0">0</span></td>
                            <td style="padding: 8px;"><span class="pugh-total" data-col="1">0</span></td>
                            <td style="padding: 8px;"><span class="pugh-total" data-col="2">0</span></td>
                        </tr>
                    </tfoot>
                </table>

                <div style="margin-top: 10px;">
                    <button type="button" class="btn btn-secondary" style="font-size: 13px; padding: 6px 12px;" onclick="addPughRow()">
                        <i class="fas fa-plus"></i> Add Criteria
                    </button>
                </div>
            </div>

            <div class="form-group">
                <label for="pughJustification">Justification: Why is the winning design the best choice? (15 pts)</label>
                <textarea id="pughJustification" rows="5" placeholder="Explain why the highest-scoring design is the best choice. Reference specific criteria and scores from your matrix. Connect your choice to the project goals...">${existing.justification || ''}</textarea>
            </div>

            <div class="form-group">
                <label for="pughContribution">My Contribution to This Decision (10 pts)</label>
                <textarea id="pughContribution" rows="4" placeholder="What was your specific role in the decision-making process? What criteria did you advocate for? What research or testing did you do to inform your scores?">${existing.contribution || ''}</textarea>
            </div>
            ` : id === 7 ? `
            <div class="card" style="margin-bottom: 20px; border-left: 4px solid #ef4444; background: #fef2f2;">
                <h4 style="margin-bottom: 10px; color: #b91c1c;"><i class="fas fa-exclamation-triangle"></i> Action Required This Week</h4>
                <p style="font-size: 14px; color: #7f1d1d; margin-bottom: 14px;">
                    The weight spreadsheet must be complete by end of week. Open it, claim your components, weigh them, and enter the data.
                </p>
                <a href="${CONFIG.WEIGHT_SHEET_URL}" target="_blank"
                   style="display: inline-block; background: #ef4444; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">
                    <i class="fas fa-table"></i> Open Team Weight Spreadsheet
                </a>
            </div>

            <div class="form-group">
                <label for="deliverableContent">Your Submission</label>
                <textarea id="deliverableContent" rows="10"
                    placeholder="1. Components I claimed and weighed (list each with mass)&#10;2. My 5S contributions (area, what I did)&#10;3. Reflection: how does the robot's mass affect my subsystem's design?">${existing.content || ''}</textarea>
            </div>
            ` : id === 6 ? `

            <div class="card" style="margin-bottom: 20px; border-left: 3px solid #f59e0b;">
                <h4 style="margin-bottom: 10px;"><i class="fas fa-binoculars"></i> Post-Competition Observations</h4>
                <p style="font-size: 13px; color: var(--gray-600); margin-bottom: 10px;">
                    Describe specific behaviors observed during competition matches. What worked? What failed? When and why?
                </p>
                <textarea id="compObservations" rows="6"
                    placeholder="e.g. During matches 3 and 7, the intake roller jammed when picking up game pieces at angles greater than ~30°. The shooter consistently hit targets from the center zone but missed from the sides due to inconsistent spin-up time..."
                    style="width: 100%; padding: 10px; border: 1px solid var(--gray-200); border-radius: 6px; font-size: 13px; resize: vertical; box-sizing: border-box;">${existing.observations || ''}</textarea>
            </div>

            <div class="card" style="margin-bottom: 20px; border-left: 3px solid #8b5cf6;">
                <h4 style="margin-bottom: 6px;"><i class="fas fa-wrench"></i> Proposed Subsystem Modifications</h4>
                <p style="font-size: 13px; color: var(--gray-600); margin-bottom: 12px;">
                    List each proposed change. Every modification must reference a specific observation and include enough detail for someone else to implement it.
                </p>
                <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 8px; min-width: 560px;">
                    <thead>
                        <tr style="background: var(--gray-100);">
                            <th style="padding: 8px; border: 1px solid var(--gray-200); text-align: left; width: 22%;">Problem Observed</th>
                            <th style="padding: 8px; border: 1px solid var(--gray-200); text-align: left; width: 28%;">Proposed Modification</th>
                            <th style="padding: 8px; border: 1px solid var(--gray-200); text-align: left; width: 33%;">Details (materials, dimensions, approach)</th>
                            <th style="padding: 8px; border: 1px solid var(--gray-200); text-align: center; width: 10%;">Priority</th>
                            <th style="padding: 8px; border: 1px solid var(--gray-200); width: 32px;"></th>
                        </tr>
                    </thead>
                    <tbody id="modsBody">
                        ${renderMod6Rows(existing.modifications || [])}
                    </tbody>
                </table>
                </div>
                <button type="button" class="btn btn-secondary" style="font-size: 13px; padding: 6px 12px;" onclick="addMod6Row()">
                    <i class="fas fa-plus"></i> Add Modification
                </button>
            </div>

            <div class="card" style="margin-bottom: 20px; border-left: 3px solid #10b981;">
                <h4 style="margin-bottom: 6px;"><i class="fas fa-weight-hanging"></i> Subsystem Weight Documentation</h4>
                <div style="margin-bottom: 12px;">
                    <label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 4px;">Subsystem Name</label>
                    <input type="text" id="subsystemName" value="${existing.subsystemName || ''}"
                        placeholder="e.g. Intake, Drivetrain, Shooter"
                        style="width: 100%; padding: 8px; border: 1px solid var(--gray-200); border-radius: 6px; font-size: 13px; box-sizing: border-box;">
                </div>
                <p style="font-size: 13px; color: var(--gray-600); margin-bottom: 12px;">
                    List every component in your subsystem. This data will be pushed to the team Weight Sheet.
                </p>
                <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 8px; min-width: 520px;">
                    <thead>
                        <tr style="background: var(--gray-100);">
                            <th style="padding: 8px; border: 1px solid var(--gray-200); text-align: left;">Component Name</th>
                            <th style="padding: 8px; border: 1px solid var(--gray-200); text-align: center; width: 60px;">Qty</th>
                            <th style="padding: 8px; border: 1px solid var(--gray-200); text-align: center; width: 110px;">Unit Mass (lbs)</th>
                            <th style="padding: 8px; border: 1px solid var(--gray-200); text-align: center; width: 110px;">Total (lbs)</th>
                            <th style="padding: 8px; border: 1px solid var(--gray-200); text-align: left;">Notes</th>
                            <th style="padding: 8px; border: 1px solid var(--gray-200); width: 32px;"></th>
                        </tr>
                    </thead>
                    <tbody id="weightBody">
                        ${renderWeight6Rows(existing.weightData || [])}
                    </tbody>
                    <tfoot>
                        <tr style="background: var(--gray-50); font-weight: 600;">
                            <td colspan="3" style="padding: 8px; border: 1px solid var(--gray-200); text-align: right;">Subsystem Total:</td>
                            <td style="padding: 8px; border: 1px solid var(--gray-200); text-align: center;" id="weightTotal">0.000 lbs</td>
                            <td colspan="2" style="border: 1px solid var(--gray-200);"></td>
                        </tr>
                    </tfoot>
                </table>
                </div>
                <button type="button" class="btn btn-secondary" style="font-size: 13px; padding: 6px 12px;" onclick="addWeight6Row()">
                    <i class="fas fa-plus"></i> Add Component
                </button>
            </div>

            ` : `
            <div class="form-group">
                <label for="deliverableContent">Your Submission</label>
                <textarea id="deliverableContent" rows="10" placeholder="Enter your deliverable content here. Include all required components...">${textareaContent}</textarea>
            </div>
            `}

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
    content.querySelectorAll('textarea, input, select').forEach(el => {
        el.addEventListener('input', markDirty);
        el.addEventListener('change', markDirty);
    });

    // Live calculation for Pugh Matrix totals
    if (id === 4) {
        content.querySelectorAll('.pugh-score, .pugh-weight').forEach(el => {
            el.addEventListener('change', updatePughTotals);
        });
        updatePughTotals();
    }

    // Live calculation for weight table totals
    if (id === 6) {
        content.addEventListener('input', (e) => {
            if (e.target.classList.contains('w6-qty') || e.target.classList.contains('w6-unit')) {
                calcWeight6Totals();
            }
        });
        calcWeight6Totals();
    }

    document.getElementById('deliverableForm').addEventListener('submit', (e) => {
        e.preventDefault();
        submitDeliverable(id);
    });

    modal.classList.add('active');
}

// ============================================
// PUGH MATRIX HELPERS
// ============================================
const PUGH_MIN_ROWS = 3;
const PUGH_MAX_ROWS = 8;
const PUGH_DEFAULT_ROWS = 5;

function renderPughRows(existing) {
    const criteria = existing.criteria || [];
    const rowCount = Math.max(criteria.length, PUGH_DEFAULT_ROWS);
    let html = '';
    for (let i = 0; i < rowCount; i++) {
        const c = criteria[i] || {};
        html += renderPughRow(i, c, rowCount);
    }
    return html;
}

function renderPughRow(i, c, totalRows) {
    const canRemove = totalRows > PUGH_MIN_ROWS;
    return `
        <tr class="pugh-row" data-row="${i}" style="border-bottom: 1px solid var(--gray-100);">
            <td style="padding: 6px 4px;">
                <input type="text" class="pugh-criteria" data-row="${i}" value="${c.name || ''}" placeholder="e.g. Cost, Weight, Speed"
                    style="width: 100%; padding: 4px 6px; border: 1px solid var(--gray-200); border-radius: 4px; font-size: 13px;">
            </td>
            <td style="padding: 6px 4px;">
                <select class="pugh-weight" data-row="${i}" style="width: 100%; padding: 4px; border: 1px solid var(--gray-200); border-radius: 4px; font-size: 13px;">
                    ${[1,2,3,4,5].map(w => `<option value="${w}" ${(c.weight || 3) == w ? 'selected' : ''}>${w}</option>`).join('')}
                </select>
            </td>
            <td style="padding: 6px 4px; text-align: center; color: var(--gray-400); font-weight: bold;">0</td>
            <td style="padding: 6px 4px;">
                <select class="pugh-score" data-row="${i}" data-col="1" style="width: 100%; padding: 4px; border: 1px solid var(--gray-200); border-radius: 4px; font-size: 13px;">
                    <option value="" ${!c.scores || c.scores[1] === undefined || c.scores[1] === '' ? 'selected' : ''}>—</option>
                    <option value="1" ${c.scores && c.scores[1] === 1 ? 'selected' : ''}>+ (better)</option>
                    <option value="0" ${c.scores && c.scores[1] === 0 ? 'selected' : ''}>S (same)</option>
                    <option value="-1" ${c.scores && c.scores[1] === -1 ? 'selected' : ''}>- (worse)</option>
                </select>
            </td>
            <td style="padding: 6px 4px;">
                <select class="pugh-score" data-row="${i}" data-col="2" style="width: 100%; padding: 4px; border: 1px solid var(--gray-200); border-radius: 4px; font-size: 13px;">
                    <option value="" ${!c.scores || c.scores[2] === undefined || c.scores[2] === '' ? 'selected' : ''}>—</option>
                    <option value="1" ${c.scores && c.scores[2] === 1 ? 'selected' : ''}>+ (better)</option>
                    <option value="0" ${c.scores && c.scores[2] === 0 ? 'selected' : ''}>S (same)</option>
                    <option value="-1" ${c.scores && c.scores[2] === -1 ? 'selected' : ''}>- (worse)</option>
                </select>
            </td>
            <td style="padding: 6px 2px; width: 30px;">
                ${canRemove ? `<button type="button" onclick="removePughRow(${i})" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 14px; padding: 2px;" title="Remove row"><i class="fas fa-times"></i></button>` : ''}
            </td>
        </tr>
    `;
}

function addPughRow() {
    const rows = document.querySelectorAll('.pugh-row');
    if (rows.length >= PUGH_MAX_ROWS) {
        showToast(`Maximum ${PUGH_MAX_ROWS} criteria allowed`, 'error');
        return;
    }
    const tbody = document.getElementById('pughRows');
    const newIndex = rows.length;
    tbody.insertAdjacentHTML('beforeend', renderPughRow(newIndex, {}, newIndex + 1));
    // Re-render remove buttons if we crossed from min to min+1
    refreshPughRemoveButtons();
    // Attach listeners to new elements
    tbody.querySelectorAll(`[data-row="${newIndex}"]`).forEach(el => {
        el.addEventListener('input', markDirty);
        el.addEventListener('change', () => { markDirty(); updatePughTotals(); });
    });
    updatePughTotals();
}

function removePughRow(index) {
    const rows = document.querySelectorAll('.pugh-row');
    if (rows.length <= PUGH_MIN_ROWS) return;
    rows[index].remove();
    // Re-index remaining rows
    document.querySelectorAll('.pugh-row').forEach((row, i) => {
        row.setAttribute('data-row', i);
        row.querySelectorAll('[data-row]').forEach(el => el.setAttribute('data-row', i));
    });
    refreshPughRemoveButtons();
    updatePughTotals();
}

function refreshPughRemoveButtons() {
    const rows = document.querySelectorAll('.pugh-row');
    rows.forEach((row, i) => {
        const lastTd = row.querySelector('td:last-child');
        if (rows.length <= PUGH_MIN_ROWS) {
            lastTd.innerHTML = '';
        } else if (!lastTd.querySelector('button')) {
            lastTd.innerHTML = `<button type="button" onclick="removePughRow(${i})" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 14px; padding: 2px;" title="Remove row"><i class="fas fa-times"></i></button>`;
        } else {
            lastTd.querySelector('button').setAttribute('onclick', `removePughRow(${i})`);
        }
    });
}

function updatePughTotals() {
    const totals = [0, 0, 0]; // baseline, option2, option3
    document.querySelectorAll('.pugh-row').forEach(row => {
        const weight = parseInt(row.querySelector('.pugh-weight')?.value) || 0;
        totals[0] += 0; // baseline always 0
        row.querySelectorAll('.pugh-score').forEach(sel => {
            const col = parseInt(sel.getAttribute('data-col'));
            const val = sel.value;
            if (val !== '') totals[col] += parseInt(val) * weight;
        });
    });
    document.querySelectorAll('.pugh-total').forEach(span => {
        const col = parseInt(span.getAttribute('data-col'));
        const val = totals[col];
        span.textContent = val > 0 ? `+${val}` : `${val}`;
        span.style.color = col === 0 ? 'var(--gray-600)' : val > 0 ? 'var(--success)' : val < 0 ? 'var(--danger)' : 'var(--gray-600)';
    });
}

function collectDeliverable4CustomData() {
    const options = [0, 1, 2].map(i =>
        document.querySelector(`.pugh-option[data-col="${i}"]`)?.value || ''
    );
    const criteria = [];
    document.querySelectorAll('.pugh-row').forEach(row => {
        const rowIdx = row.getAttribute('data-row');
        const name = row.querySelector('.pugh-criteria')?.value || '';
        const weight = parseInt(row.querySelector('.pugh-weight')?.value) || 3;
        const scores = [0]; // baseline always 0
        row.querySelectorAll('.pugh-score').forEach(sel => {
            scores.push(sel.value !== '' ? parseInt(sel.value) : '');
        });
        criteria.push({ name, weight, scores });
    });
    const justification = document.getElementById('pughJustification')?.value || '';
    const contribution = document.getElementById('pughContribution')?.value || '';
    return { options, criteria, justification, contribution };
}

function formatDeliverable4Content(customData) {
    const { options, criteria, justification, contribution } = customData;
    const optNames = [
        options[0] || 'Baseline',
        options[1] || 'Option 2',
        options[2] || 'Option 3'
    ];
    const scoreSymbol = (s) => s === 1 ? '+' : s === -1 ? '-' : s === 0 ? 'S' : '—';

    let text = '--- PUGH DECISION MATRIX ---\n';
    text += `Baseline: ${optNames[0]} | ${optNames[1]} | ${optNames[2]}\n\n`;

    // Header
    const cw = 22, sw = 12;
    text += 'Criteria (Weight)'.padEnd(cw) + '| ' + optNames[0].substring(0, sw - 2).padEnd(sw) + '| ' + optNames[1].substring(0, sw - 2).padEnd(sw) + '| ' + optNames[2].substring(0, sw - 2) + '\n';
    text += '-'.repeat(cw) + '|' + '-'.repeat(sw + 1) + '|' + '-'.repeat(sw + 1) + '|' + '-'.repeat(sw) + '\n';

    const totals = [0, 0, 0];
    criteria.forEach(c => {
        if (!c.name) return;
        const label = `${c.name} (${c.weight})`.padEnd(cw);
        const cells = c.scores.map((s, col) => {
            if (col === 0) return '0'.padEnd(sw);
            const weighted = s !== '' ? s * c.weight : '';
            if (s !== '' && s !== undefined) totals[col] += s * c.weight;
            const sym = scoreSymbol(s);
            return weighted !== '' ? `${sym} (${weighted > 0 ? '+' : ''}${weighted})`.padEnd(sw) : '—'.padEnd(sw);
        });
        text += label + '| ' + cells[0] + '| ' + cells[1] + '| ' + cells[2] + '\n';
    });

    const fmtTotal = (v) => v > 0 ? `+${v}` : `${v}`;
    text += 'TOTAL'.padEnd(cw) + '| ' + '0'.padEnd(sw) + '| ' + fmtTotal(totals[1]).padEnd(sw) + '| ' + fmtTotal(totals[2]) + '\n';

    text += '\n--- JUSTIFICATION ---\n' + justification + '\n';
    text += '\n--- MY CONTRIBUTION ---\n' + contribution;
    return text;
}

// ============================================
// DELIVERABLE 6 — POST-COMPETITION / WEIGHT
// ============================================

function renderMod6Rows(mods) {
    const rows = mods.length > 0 ? mods : [{}, {}]; // default 2 empty rows
    return rows.map((m) => `
        <tr class="mod6-row">
            <td style="padding: 4px;">
                <textarea class="mod6-problem" rows="2"
                    style="width:100%; padding:4px; border:1px solid var(--gray-200); border-radius:4px; font-size:12px; resize:vertical;"
                    placeholder="e.g. Intake jammed at steep angles">${m.problem || ''}</textarea>
            </td>
            <td style="padding: 4px;">
                <textarea class="mod6-mod" rows="2"
                    style="width:100%; padding:4px; border:1px solid var(--gray-200); border-radius:4px; font-size:12px; resize:vertical;"
                    placeholder="e.g. Widen roller gap from 1.5\" to 2\"">${m.modification || ''}</textarea>
            </td>
            <td style="padding: 4px;">
                <textarea class="mod6-details" rows="2"
                    style="width:100%; padding:4px; border:1px solid var(--gray-200); border-radius:4px; font-size:12px; resize:vertical;"
                    placeholder="Materials, dimensions, estimated build time, who will do it">${m.details || ''}</textarea>
            </td>
            <td style="padding: 4px; text-align:center;">
                <select class="mod6-priority"
                    style="padding:4px; border:1px solid var(--gray-200); border-radius:4px; font-size:12px; width:80px;">
                    <option value="High" ${(m.priority || '') === 'High' ? 'selected' : ''}>High</option>
                    <option value="Medium" ${(m.priority === 'Medium' || !m.priority) ? 'selected' : ''}>Medium</option>
                    <option value="Low" ${(m.priority || '') === 'Low' ? 'selected' : ''}>Low</option>
                </select>
            </td>
            <td style="padding: 4px; text-align:center;">
                <button type="button" onclick="this.closest('tr').remove()"
                    style="background:none; border:none; color:var(--gray-400); cursor:pointer; font-size:16px; padding:2px 4px;"
                    title="Remove row">×</button>
            </td>
        </tr>
    `).join('');
}

function renderWeight6Rows(items) {
    const rows = items.length > 0 ? items : [{}, {}, {}]; // default 3 empty rows
    return rows.map((w) => `
        <tr class="weight6-row">
            <td style="padding: 4px;">
                <input type="text" class="w6-component"
                    value="${w.component || ''}" placeholder="e.g. 4\" Mecanum Wheel"
                    style="width:100%; padding:5px; border:1px solid var(--gray-200); border-radius:4px; font-size:13px; box-sizing:border-box;">
            </td>
            <td style="padding: 4px; text-align:center;">
                <input type="number" class="w6-qty" min="0" step="1"
                    value="${w.qty || ''}" placeholder="1"
                    style="width:55px; padding:5px; border:1px solid var(--gray-200); border-radius:4px; font-size:13px; text-align:center;">
            </td>
            <td style="padding: 4px; text-align:center;">
                <input type="number" class="w6-unit" min="0" step="0.001"
                    value="${w.unitMass || ''}" placeholder="0.000"
                    style="width:88px; padding:5px; border:1px solid var(--gray-200); border-radius:4px; font-size:13px; text-align:center;">
            </td>
            <td style="padding: 4px; text-align:center; font-weight:600;" class="w6-row-total">
                ${w.totalMass != null && w.totalMass > 0 ? w.totalMass.toFixed(3) : '—'}
            </td>
            <td style="padding: 4px;">
                <input type="text" class="w6-notes"
                    value="${w.notes || ''}" placeholder="optional"
                    style="width:100%; padding:5px; border:1px solid var(--gray-200); border-radius:4px; font-size:12px; box-sizing:border-box;">
            </td>
            <td style="padding: 4px; text-align:center;">
                <button type="button" onclick="this.closest('tr').remove(); calcWeight6Totals();"
                    style="background:none; border:none; color:var(--gray-400); cursor:pointer; font-size:16px; padding:2px 4px;"
                    title="Remove row">×</button>
            </td>
        </tr>
    `).join('');
}

function addMod6Row() {
    const tbody = document.getElementById('modsBody');
    const tr = document.createElement('tr');
    tr.className = 'mod6-row';
    tr.innerHTML = `
        <td style="padding:4px;">
            <textarea class="mod6-problem" rows="2"
                style="width:100%; padding:4px; border:1px solid var(--gray-200); border-radius:4px; font-size:12px; resize:vertical;"
                placeholder="e.g. Intake jammed at steep angles"></textarea>
        </td>
        <td style="padding:4px;">
            <textarea class="mod6-mod" rows="2"
                style="width:100%; padding:4px; border:1px solid var(--gray-200); border-radius:4px; font-size:12px; resize:vertical;"
                placeholder="e.g. Widen roller gap from 1.5&quot; to 2&quot;"></textarea>
        </td>
        <td style="padding:4px;">
            <textarea class="mod6-details" rows="2"
                style="width:100%; padding:4px; border:1px solid var(--gray-200); border-radius:4px; font-size:12px; resize:vertical;"
                placeholder="Materials, dimensions, estimated build time, who will do it"></textarea>
        </td>
        <td style="padding:4px; text-align:center;">
            <select class="mod6-priority"
                style="padding:4px; border:1px solid var(--gray-200); border-radius:4px; font-size:12px; width:80px;">
                <option value="High">High</option>
                <option value="Medium" selected>Medium</option>
                <option value="Low">Low</option>
            </select>
        </td>
        <td style="padding:4px; text-align:center;">
            <button type="button" onclick="this.closest('tr').remove()"
                style="background:none; border:none; color:var(--gray-400); cursor:pointer; font-size:16px; padding:2px 4px;"
                title="Remove row">×</button>
        </td>
    `;
    tbody.appendChild(tr);
    tr.querySelectorAll('textarea, input, select').forEach(el => el.addEventListener('input', markDirty));
}

function addWeight6Row() {
    const tbody = document.getElementById('weightBody');
    const tr = document.createElement('tr');
    tr.className = 'weight6-row';
    tr.innerHTML = `
        <td style="padding:4px;">
            <input type="text" class="w6-component" placeholder="e.g. 4&quot; Mecanum Wheel"
                style="width:100%; padding:5px; border:1px solid var(--gray-200); border-radius:4px; font-size:13px; box-sizing:border-box;">
        </td>
        <td style="padding:4px; text-align:center;">
            <input type="number" class="w6-qty" min="0" step="1" placeholder="1"
                style="width:55px; padding:5px; border:1px solid var(--gray-200); border-radius:4px; font-size:13px; text-align:center;">
        </td>
        <td style="padding:4px; text-align:center;">
            <input type="number" class="w6-unit" min="0" step="0.001" placeholder="0.000"
                style="width:88px; padding:5px; border:1px solid var(--gray-200); border-radius:4px; font-size:13px; text-align:center;">
        </td>
        <td style="padding:4px; text-align:center; font-weight:600;" class="w6-row-total">—</td>
        <td style="padding:4px;">
            <input type="text" class="w6-notes" placeholder="optional"
                style="width:100%; padding:5px; border:1px solid var(--gray-200); border-radius:4px; font-size:12px; box-sizing:border-box;">
        </td>
        <td style="padding:4px; text-align:center;">
            <button type="button" onclick="this.closest('tr').remove(); calcWeight6Totals();"
                style="background:none; border:none; color:var(--gray-400); cursor:pointer; font-size:16px; padding:2px 4px;"
                title="Remove row">×</button>
        </td>
    `;
    tbody.appendChild(tr);
    tr.querySelectorAll('input').forEach(el => {
        el.addEventListener('input', (e) => {
            if (e.target.classList.contains('w6-qty') || e.target.classList.contains('w6-unit')) calcWeight6Totals();
            markDirty();
        });
    });
    calcWeight6Totals();
}

function calcWeight6Totals() {
    let grand = 0;
    document.querySelectorAll('.weight6-row').forEach(row => {
        const qty = parseFloat(row.querySelector('.w6-qty')?.value) || 0;
        const unit = parseFloat(row.querySelector('.w6-unit')?.value) || 0;
        const rowTotal = qty * unit;
        const cell = row.querySelector('.w6-row-total');
        if (cell) cell.textContent = (qty > 0 || unit > 0) ? rowTotal.toFixed(3) : '—';
        grand += rowTotal;
    });
    const totalEl = document.getElementById('weightTotal');
    if (totalEl) totalEl.textContent = grand.toFixed(3) + ' lbs';
}

function collectDeliverable6CustomData() {
    const observations = document.getElementById('compObservations')?.value || '';
    const subsystemName = document.getElementById('subsystemName')?.value || '';

    const modifications = [];
    document.querySelectorAll('.mod6-row').forEach(row => {
        const problem = row.querySelector('.mod6-problem')?.value || '';
        const modification = row.querySelector('.mod6-mod')?.value || '';
        const details = row.querySelector('.mod6-details')?.value || '';
        const priority = row.querySelector('.mod6-priority')?.value || 'Medium';
        if (problem.trim() || modification.trim()) {
            modifications.push({ problem, modification, details, priority });
        }
    });

    const weightData = [];
    document.querySelectorAll('.weight6-row').forEach(row => {
        const component = row.querySelector('.w6-component')?.value || '';
        const qty = parseFloat(row.querySelector('.w6-qty')?.value) || 0;
        const unitMass = parseFloat(row.querySelector('.w6-unit')?.value) || 0;
        const notes = row.querySelector('.w6-notes')?.value || '';
        if (component.trim()) {
            weightData.push({ component, qty, unitMass, totalMass: qty * unitMass, notes });
        }
    });

    return { observations, subsystemName, modifications, weightData };
}

function formatDeliverable6Content(customData) {
    const { observations, subsystemName, modifications, weightData } = customData;

    let text = '--- POST-COMPETITION OBSERVATIONS ---\n';
    text += (observations || '(none provided)') + '\n\n';

    text += '--- PROPOSED MODIFICATIONS ---\n';
    if (modifications.length === 0) {
        text += '(none documented)\n';
    } else {
        modifications.forEach((m, i) => {
            text += `\n[${i + 1}] PRIORITY: ${m.priority}\n`;
            text += `  Problem:      ${m.problem}\n`;
            text += `  Modification: ${m.modification}\n`;
            text += `  Details:      ${m.details}\n`;
        });
    }

    const label = subsystemName ? subsystemName.toUpperCase() : 'SUBSYSTEM';
    text += `\n--- WEIGHT INVENTORY: ${label} ---\n`;
    let grandTotal = 0;
    if (weightData.length === 0) {
        text += '(no components listed)\n';
    } else {
        weightData.forEach(w => {
            const line = `  ${w.component}: ${w.qty} × ${w.unitMass} lbs = ${w.totalMass.toFixed(3)} lbs`;
            text += w.notes ? `${line}  [${w.notes}]\n` : `${line}\n`;
            grandTotal += w.totalMass;
        });
        text += `  TOTAL: ${grandTotal.toFixed(3)} lbs\n`;
    }

    return text;
}

// ============================================
// SAVE / SUBMIT DELIVERABLES
// ============================================
function saveDeliverableDraft(id) {
    const customData = id === 4 ? collectDeliverable4CustomData()
                     : id === 6 ? collectDeliverable6CustomData()
                     : {};
    state.deliverables[id] = {
        ...state.deliverables[id],
        content: (id === 4 || id === 6) ? '' : document.getElementById('deliverableContent').value,
        links: document.getElementById('deliverableLinks').value,
        selfAssessment: document.getElementById('deliverableSelfAssessment').value,
        ...customData,
        status: 'in-progress',
        updatedAt: new Date().toISOString()
    };
    markDirty();
    updateUI();
    showToast('Draft saved!', 'success');
}

function submitDeliverable(id) {
    const deliverable = DELIVERABLES.find(d => d.id === id);

    if (id === 4) {
        const customData = collectDeliverable4CustomData();
        const namedCriteria = customData.criteria.filter(c => c.name.trim());
        if (namedCriteria.length < 3) {
            showToast('Please name at least 3 criteria in your matrix', 'error');
            return;
        }
        if (!customData.justification || customData.justification.length < 50) {
            showToast('Please provide a more detailed justification (at least 50 characters)', 'error');
            return;
        }
        if (!customData.contribution || customData.contribution.length < 30) {
            showToast('Please describe your contribution in more detail (at least 30 characters)', 'error');
            return;
        }
        const formattedContent = formatDeliverable4Content(customData);
        state.deliverables[id] = {
            content: formattedContent,
            rawContent: '',
            ...customData,
            links: document.getElementById('deliverableLinks').value,
            selfAssessment: document.getElementById('deliverableSelfAssessment').value,
            status: 'completed',
            submittedAt: new Date().toISOString()
        };
    } else if (id === 6) {
        const customData = collectDeliverable6CustomData();
        if (!customData.observations || customData.observations.length < 50) {
            showToast('Please describe your competition observations in more detail (at least 50 characters)', 'error');
            return;
        }
        if (customData.modifications.length < 2) {
            showToast('Please document at least 2 proposed modifications', 'error');
            return;
        }
        const undocumented = customData.modifications.filter(m => !m.details || m.details.trim().length < 20);
        if (undocumented.length > 0) {
            showToast('Each modification needs more detail — describe materials, dimensions, or approach (at least 20 characters)', 'error');
            return;
        }
        if (customData.weightData.length === 0) {
            showToast('Please add at least one component to the weight inventory', 'error');
            return;
        }
        if (!customData.subsystemName || !customData.subsystemName.trim()) {
            showToast('Please enter your subsystem name', 'error');
            return;
        }
        const formattedContent = formatDeliverable6Content(customData);
        state.deliverables[id] = {
            content: formattedContent,
            rawContent: '',
            ...customData,
            links: document.getElementById('deliverableLinks').value,
            selfAssessment: document.getElementById('deliverableSelfAssessment').value,
            status: 'completed',
            submittedAt: new Date().toISOString()
        };
    } else {
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
    }

    saveToCloud(); // immediate save on submission
    updateUI();
    document.getElementById('deliverableModal').classList.remove('active');
    showCelebration(`${deliverable.title} Submitted!`);
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

        case 'portfolio-draft':
            instructions = 'Use this prompt to draft your Engineer Portfolio section with AI:';
            prompt = buildPortfolioDraftPrompt();
            break;

        case 'portfolio-polish':
            instructions = 'Use this prompt to polish your draft into final form:';
            prompt = `You are helping a high school student finalize their FIRST Robotics Engineer Portfolio section for submission to competition judges.

Subsystem: ${formatTeamName(state.student?.team || 'subsystem')}
Student name: ${state.student?.name || '[name]'}

Here is my draft. Please:
1. Improve grammar, clarity, and professional tone
2. Make sure each section has a clear heading
3. Replace vague phrases like "we worked on" with specific technical language
4. Do NOT add facts — only improve what is already written
5. Keep it under 1 page (about 500 words) so it fits the portfolio format

My draft:
[PASTE YOUR DRAFT HERE]`;
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

function buildPortfolioDraftPrompt() {
    const team = state.student?.team || 'subsystem';
    const name = state.student?.name || '[your name]';

    const subsystemGuidance = {
        drivetrain: {
            label: 'Drivetrain',
            hints: [
                'Drive base type (tank, swerve, mecanum, etc.) and why it was chosen',
                'Wheel size, motor selection, gear ratio or belt ratio',
                'How traction, turning radius, and speed were balanced',
                'How the drivetrain handled defense or field obstacles'
            ],
            questions: [
                'What drive base did you choose and what alternatives did you consider?',
                'What was your target top speed and how did you calculate the gear ratio?',
                'How did the drivetrain perform at competition vs. in testing?'
            ]
        },
        collector: {
            label: 'Collector / Intake',
            hints: [
                'Game piece being collected and what made it difficult',
                'Intake geometry (rollers, belts, compliant wheels) and why',
                'Ground clearance, intake angle, and compression distance',
                'Reliability improvements made after testing'
            ],
            questions: [
                'What were the main challenges collecting the game piece reliably?',
                'What intake geometry did you try first, and why did you change it?',
                'How did you measure collection success rate in testing?'
            ]
        },
        hopper: {
            label: 'Hopper / Storage',
            hints: [
                'How many game pieces must be stored and how they are indexed',
                'Material choices to reduce jam risk',
                'Sensor integration (beam breaks, limit switches) if any',
                'Feed path from intake to shooter'
            ],
            questions: [
                'How did game pieces move from the intake through the hopper?',
                'What jam conditions did you encounter and how did you solve them?',
                'How did you ensure consistent delivery to the shooter?'
            ]
        },
        shooter: {
            label: 'Shooter / Launcher',
            hints: [
                'Shooter type (flywheel, puncher, catapult) and rationale',
                'Target exit velocity and how you calculated or measured it',
                'Hood angle adjustment mechanism if applicable',
                'Repeatability data — shot consistency across multiple attempts'
            ],
            questions: [
                'What exit velocity did you target and how did you determine it?',
                'How many design iterations did the shooter go through?',
                'What was your shooting accuracy at competition distance?'
            ]
        },
        climber: {
            label: 'Climber / Endgame',
            hints: [
                'Climb mechanism type (hook, telescoping arm, winch, etc.)',
                'Load analysis — estimated robot weight the climber must support',
                'Time to complete climb and how it was measured',
                'Safety considerations and failure modes tested'
            ],
            questions: [
                'What forces does your climber need to handle and how did you verify it?',
                'How long does a successful climb take, and how did you optimize that?',
                'What failure mode were you most concerned about and how did you address it?'
            ]
        },
        programming: {
            label: 'Programming / Autonomous',
            hints: [
                'Languages and frameworks used (Java/WPILib, Python, etc.)',
                'Autonomous routines developed and their scoring value',
                'Vision or sensor integration (Limelight, AprilTags, encoders)',
                'Closed-loop control implemented (PID, motion profiling)'
            ],
            questions: [
                'What autonomous routines did you write and how reliably did they run?',
                'What sensor feedback did you use and how did you tune it?',
                'What was the hardest software problem you solved this season?'
            ]
        }
    };

    const sub = subsystemGuidance[team] || {
        label: formatTeamName(team),
        hints: ['Key mechanism description', 'Design alternatives considered', 'Testing data collected'],
        questions: ['What challenge did your subsystem solve?', 'What design iterations did you go through?', 'How did you test and validate performance?']
    };

    return `You are helping ${name}, a high school FIRST Robotics student, write their Engineer Portfolio section for the ${sub.label} subsystem. This will be submitted to FIRST judges at competition.

The portfolio follows this structure (keep each section to 2–4 sentences):

**1. Problem Statement**
What game challenge does the ${sub.label} need to solve? What constraints existed (weight, rules, space)?

**2. Design Iterations**
What approaches did the team consider? What did you personally work on or evaluate?
Include: ${sub.hints[0]}, ${sub.hints[1]}

**3. Final Design Rationale**
What was chosen and why? Reference a specific measurement or performance result.
Include: ${sub.hints[2]}

**4. Testing & Results**
What did you test? What did you observe or measure? What changed?
${sub.hints[3] ? 'Include: ' + sub.hints[3] : ''}

---
To help you write this, answer the following questions in your own words first, then I will format them into the portfolio:

${sub.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

[ANSWER THE QUESTIONS ABOVE, THEN PASTE YOUR ANSWERS HERE]

Write in first person (I/we) and keep the total under 500 words. Do not make up facts — only use what the student provides.`;
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

function showCelebration(message) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    overlay.innerHTML = `
        <div style="font-size: 120px; animation: egyptian 0.6s ease-in-out infinite;">🤖</div>
        <div style="color: white; font-size: 28px; font-weight: bold; margin-top: 20px; text-align: center; padding: 0 20px;">
            ${message}
        </div>
        <div style="color: #10b981; font-size: 18px; margin-top: 10px;">
            <i class="fas fa-check-circle"></i> Submitted successfully!
        </div>
    `;

    // Add Egyptian walk animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes egyptian {
            0%, 100% { transform: translateX(-30px) skewY(-5deg); }
            25% { transform: translateX(0px) skewY(5deg) scaleX(-1); }
            50% { transform: translateX(30px) skewY(-5deg); }
            75% { transform: translateX(0px) skewY(5deg) scaleX(-1); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    // Click to dismiss or auto-dismiss after 3 seconds
    overlay.addEventListener('click', () => overlay.remove());
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.style.animation = 'fadeIn 0.3s ease reverse';
            setTimeout(() => overlay.remove(), 300);
        }
    }, 3000);
}

function showOutageBanner(email, name) {
    const existing = document.getElementById('outageBanner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'outageBanner';
    banner.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
        background: #92400e; color: #fef3c7;
        padding: 14px 20px; display: flex; align-items: center; gap: 12px;
        font-size: 14px; font-weight: 500; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;
    banner.innerHTML = `
        <i class="fas fa-exclamation-triangle" style="font-size: 18px; flex-shrink:0;"></i>
        <span style="flex:1;">
            <strong>Unable to load your portfolio.</strong>
            The server may be temporarily unavailable — your work is safe.
            Refresh the page to try again, or wait a moment and click Retry.
        </span>
        <button onclick="retryCloudLoad('${email}','${name.replace(/'/g,"\\'")}');this.closest('#outageBanner').remove();"
            style="background:#d97706; color:#fff; border:none; border-radius:6px;
                   padding:8px 16px; cursor:pointer; font-weight:600; white-space:nowrap;">
            Retry
        </button>
    `;
    document.body.prepend(banner);
}

async function retryCloudLoad(email, name) {
    const cloudData = await loadStudentFromCloud(email);
    if (cloudData && cloudData.student) {
        state = cloudData;
        state.student.name = name;
        state.config = { skipReflectionWeeks: [], skipDeliverableWeeks: [], expectedVersion: null };
        restoreEvidenceLocal();
        calculateCurrentWeek();
        hideAllModals();
        onAuthenticated();
    } else if (cloudData && cloudData.loadError) {
        showOutageBanner(email, name);
        showToast('Still unable to reach the server — try again in a moment.', 'error');
    } else {
        // New student (no record found)
        document.getElementById('profileEmail').textContent = email;
        document.getElementById('profileModal').classList.add('active');
        state.student = { email, name };
        initProfileForm();
    }
}

// Expose for inline onclick handlers
window.showToast = showToast;
window.retryCloudLoad = retryCloudLoad;
window.saveDeliverableDraft = saveDeliverableDraft;
window.generatePracticeQuestions = generatePracticeQuestions;

// ============================================
// AI FEEDBACK MODULE (test mode only)
// ============================================
const AI_FEEDBACK_ENABLED = window.location.pathname.includes('test');

if (AI_FEEDBACK_ENABLED) {
    // Inject AI feedback modal into the page
    document.addEventListener('DOMContentLoaded', () => {
        const modalHtml = `
            <div class="modal" id="aiFeedbackModal">
                <div class="modal-content modal-large">
                    <button class="modal-close" onclick="document.getElementById('aiFeedbackModal').classList.remove('active')">&times;</button>
                    <div id="aiFeedbackContent">
                        <div style="text-align: center; padding: 40px;">
                            <i class="fas fa-robot" style="font-size: 48px; color: var(--primary); margin-bottom: 16px;"></i>
                            <h2>AI Review</h2>
                            <p style="color: var(--gray-600);">Analyzing your submission...</p>
                            <div class="loading-spinner" style="margin: 20px auto;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Add AI review button to reflection form
        const reflectionActions = document.querySelector('#weeklyReflectionForm .form-actions');
        if (reflectionActions) {
            const aiBtn = document.createElement('button');
            aiBtn.type = 'button';
            aiBtn.className = 'btn btn-secondary';
            aiBtn.innerHTML = '<i class="fas fa-robot"></i> AI Review';
            aiBtn.style.cssText = 'background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none;';
            aiBtn.addEventListener('click', () => requestAIFeedback('reflection'));
            reflectionActions.insertBefore(aiBtn, reflectionActions.firstChild);
        }

        // Add CSS for AI feedback display
        const style = document.createElement('style');
        style.textContent = `
            .ai-score-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
            .ai-score-label { width: 110px; font-size: 13px; font-weight: 500; }
            .ai-score-track { flex: 1; height: 8px; background: var(--gray-200); border-radius: 4px; overflow: hidden; }
            .ai-score-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
            .ai-score-value { width: 30px; text-align: right; font-size: 13px; font-weight: 600; }
            .ai-level-badge { display: inline-block; font-size: 32px; font-weight: 700; width: 56px; height: 56px; line-height: 56px; text-align: center; border-radius: 12px; }
            .ai-level-A { background: #e8f5e9; color: #2e7d32; }
            .ai-level-B { background: #e3f2fd; color: #1565c0; }
            .ai-level-C { background: #fff3e0; color: #e65100; }
            .ai-level-D { background: #fce4ec; color: #c62828; }
            .ai-section { margin-bottom: 16px; }
            .ai-section h4 { margin-bottom: 8px; font-size: 14px; color: var(--gray-700); }
            .ai-improvement { padding: 8px 12px; background: var(--gray-50); border-left: 3px solid var(--primary); margin-bottom: 6px; border-radius: 0 4px 4px 0; font-size: 13px; }
            .ai-example-box { padding: 12px; background: #f0f7ff; border: 1px solid #c2deff; border-radius: 8px; font-size: 13px; line-height: 1.6; }
        `;
        document.head.appendChild(style);
    });

    function requestAIFeedback(type, deliverableId) {
        const modal = document.getElementById('aiFeedbackModal');
        const contentEl = document.getElementById('aiFeedbackContent');

        // Show loading state
        contentEl.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-robot" style="font-size: 48px; color: #764ba2; margin-bottom: 16px; display: block;"></i>
                <h2 style="margin-bottom: 8px;">Analyzing Your Submission</h2>
                <p style="color: var(--gray-600); margin-bottom: 24px;">The AI is reviewing your work for specificity, detail, completeness, and insight...</p>
                <div style="width: 40px; height: 40px; border: 3px solid var(--gray-200); border-top-color: #764ba2; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>
            <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
        `;
        modal.classList.add('active');

        // Gather submission data
        let payload = { action: 'getAIFeedback', type, email: state.student?.email };

        if (type === 'reflection') {
            const data = getReflectionFormData();
            payload.week = data.week;
            payload.content = {
                contributions: data.contributions,
                challenges: data.challenges,
                solutions: data.solutions,
                goals: data.goals
            };
            payload.rubricScores = data.rubric;
        } else if (type === 'deliverable') {
            const deliverable = DELIVERABLES.find(d => d.id === deliverableId);
            payload.title = deliverable?.title || `Deliverable ${deliverableId}`;
            payload.week = deliverable?.week;
            payload.content = {
                text: document.getElementById('deliverableContent').value
            };
        }

        // Call the backend
        fetch(CONFIG.SHEETS_API_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        .then(r => r.json())
        .then(result => {
            if (result.error) {
                contentEl.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <i class="fas fa-exclamation-circle" style="font-size: 48px; color: var(--danger); margin-bottom: 16px; display: block;"></i>
                        <h2>Unable to Get Feedback</h2>
                        <p style="color: var(--gray-600);">${result.error}</p>
                    </div>
                `;
                return;
            }
            displayAIFeedback(result.feedback, type);
        })
        .catch(err => {
            contentEl.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <i class="fas fa-exclamation-circle" style="font-size: 48px; color: var(--danger); margin-bottom: 16px; display: block;"></i>
                    <h2>Connection Error</h2>
                    <p style="color: var(--gray-600);">Could not reach the server. Please try again.</p>
                </div>
            `;
        });
    }

    function displayAIFeedback(feedback, type) {
        const contentEl = document.getElementById('aiFeedbackContent');
        const scoreColors = { 1: '#c62828', 2: '#e65100', 3: '#1565c0', 4: '#2e7d32' };

        contentEl.innerHTML = `
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
                <div class="ai-level-badge ai-level-${feedback.level}">${feedback.level}</div>
                <div>
                    <h2 style="margin: 0 0 4px 0;">AI Review</h2>
                    <p style="color: var(--gray-600); margin: 0; font-size: 14px;">${feedback.summary}</p>
                </div>
            </div>

            <div class="ai-section">
                <h4><i class="fas fa-chart-bar"></i> Quality Scores</h4>
                ${['specificity', 'detail', 'completeness', 'insight'].map(key => `
                    <div class="ai-score-bar">
                        <span class="ai-score-label">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        <div class="ai-score-track">
                            <div class="ai-score-fill" style="width: ${(feedback.scores[key] / 4) * 100}%; background: ${scoreColors[feedback.scores[key]] || '#999'};"></div>
                        </div>
                        <span class="ai-score-value">${feedback.scores[key]}/4</span>
                    </div>
                `).join('')}
            </div>

            <div class="ai-section">
                <h4><i class="fas fa-star" style="color: #f9a825;"></i> Strengths</h4>
                ${feedback.strengths.map(s => `<div class="ai-improvement" style="border-left-color: var(--success);">${s}</div>`).join('')}
            </div>

            <div class="ai-section">
                <h4><i class="fas fa-arrow-up" style="color: var(--primary);"></i> How to Improve</h4>
                ${feedback.improvements.map(i => `<div class="ai-improvement">${i}</div>`).join('')}
            </div>

            <div class="ai-section">
                <h4><i class="fas fa-edit"></i> Example Improvement</h4>
                <div class="ai-example-box">${feedback.example}</div>
            </div>

            <div style="text-align: center; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--gray-200);">
                <p style="color: var(--gray-500); font-size: 12px; margin-bottom: 12px;">Use this feedback to improve your submission, then submit when ready.</p>
                <button class="btn btn-secondary" onclick="document.getElementById('aiFeedbackModal').classList.remove('active')">
                    <i class="fas fa-arrow-left"></i> Back to Editing
                </button>
            </div>
        `;
    }

    // Patch the deliverable form to include AI review button
    const _originalOpenDeliverableForm = openDeliverableForm;
    openDeliverableForm = function(id) {
        _originalOpenDeliverableForm(id);
        // Inject AI review button into deliverable form actions
        const formActions = document.querySelector('#deliverableForm .form-actions');
        if (formActions) {
            const aiBtn = document.createElement('button');
            aiBtn.type = 'button';
            aiBtn.className = 'btn btn-secondary';
            aiBtn.innerHTML = '<i class="fas fa-robot"></i> AI Review';
            aiBtn.style.cssText = 'background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none;';
            aiBtn.addEventListener('click', () => requestAIFeedback('deliverable', id));
            formActions.insertBefore(aiBtn, formActions.firstChild);
        }
    };

    window.requestAIFeedback = requestAIFeedback;
}
