// Robotics Portfolio - Main Application (Google Auth Edition)

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================
// Placeholder image (data URI - won't be blocked by firewalls)
const PLACEHOLDER_IMG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2UwZTBlMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QaG90bzwvdGV4dD48L3N2Zz4=';

const CONFIG = {
    // App version - update when deploying changes
    VERSION: 'v2.9.14',

    // Google Sheets Web App URL (deploy your Apps Script and paste URL here)
    SHEETS_API_URL: 'https://script.google.com/macros/s/AKfycbyEWj9KQMlPPtdTcv0ZVoBoJv0dKvaVfSm_E75wgqjqmbKN-vcjkgNmcg76CD5CDS5m/exec',

    // Google OAuth Client ID
    GOOGLE_CLIENT_ID: '1002661691088-8g0dskdehhmgc8jigbua15l3ih7td4ka.apps.googleusercontent.com',

    // Semester start date (adjust for your semester)
    SEMESTER_START: new Date('2026-02-02'),

    // Point values
    POINTS: {
        WEEKLY_REFLECTION: 20,
        TOTAL_POSSIBLE: 800
    },

    // Auto-save interval in milliseconds
    AUTO_SAVE_INTERVAL: 30000
};

// ============================================
// WEEK TOPICS
// ============================================
const WEEK_TOPICS = {
    1: { title: 'Line Following Refinement', phase: 'linefollow', focus: 'PID control, calibration, track testing' },
    2: { title: 'Line Following Mastery', phase: 'linefollow', focus: 'Final practical, optimization' },
    3: { title: 'Ultrasonic Sensor Basics', phase: 'scanner', focus: 'HC-SR04 wiring, distance measurement' },
    4: { title: 'Servo & Scanner Build', phase: 'scanner', focus: 'Servo control, mounting, CAD design' },
    5: { title: 'Scanning Algorithm', phase: 'scanner', focus: 'Data arrays, obstacle detection' },
    6: { title: 'Claw Design', phase: 'claw', focus: 'Gripper mechanisms, CAD, assembly' },
    7: { title: 'Claw Programming', phase: 'claw', focus: 'Servo control, grip functions' },
    8: { title: 'Integrated Systems', phase: 'claw', focus: 'Scanner + claw + drive integration' },
    9: { title: 'Final Integration', phase: 'final', focus: 'Full system demo, presentation' }
};

// ============================================
// DELIVERABLES DATA
// ============================================
const DELIVERABLES = [
    {
        id: 1,
        title: 'Line Following Practical #1',
        week: 1,
        points: 50,
        phase: 'linefollow',
        description: 'Complete Track #1 with curves in under 1 minute.',
        timeLimit: 60, // seconds
        requirements: [
            'Tune the line following IR sensor for your track',
            'Follow the line through curves',
            'Complete Track #1 in under 1 minute'
        ]
    },
    {
        id: 2,
        title: 'Line Following Practical #2',
        week: 2,
        points: 75,
        phase: 'linefollow',
        description: 'Complete Track #2 with sharp curves in under 2 minutes.',
        timeLimit: 120, // seconds
        requirements: [
            'Navigate a longer track with sharp curves',
            'Complete Track #2 in under 2 minutes',
            'Best of 3 attempts scored'
        ]
    },
    {
        id: 3,
        title: 'Ultrasonic Sensor Lab Report',
        week: 3,
        points: 40,
        phase: 'scanner',
        description: 'Document your ultrasonic sensor setup and testing.',
        requirements: [
            'Wire connections list (Arduino pin → sensor pin)',
            'Code with comments explaining each section',
            'Distance accuracy data table (5 distances, 3 readings each)',
            'Observations about sensor behavior'
        ]
    },
    {
        id: 4,
        title: 'Scanner Assembly',
        week: 4,
        points: 50,
        phase: 'scanner',
        description: 'Build the servo-mounted scanning mechanism.',
        requirements: [
            'Physical scanner mechanism mounted to robot',
            'Sweep code that moves sensor 0° to 180°',
            'Photos of your assembly process',
            'CAD design file (bonus: +15 points if 3D printed)'
        ]
    },
    {
        id: 5,
        title: 'Scanning Practical',
        week: 5,
        points: 75,
        phase: 'scanner',
        description: 'Demonstrate obstacle detection using your scanner.',
        requirements: [
            'Scan environment and identify nearest obstacle',
            'Report obstacle distance and direction',
            'Identify clearest path direction',
            'Serial output showing scan results'
        ]
    },
    {
        id: 6,
        title: 'Claw Design Document',
        week: 6,
        points: 50,
        phase: 'claw',
        description: 'Design your claw mechanism before building.',
        requirements: [
            'Sketch or CAD of claw mechanism',
            'Parts list with sources/costs',
            'Explanation of design choices',
            'How it will mount to your robot'
        ]
    },
    {
        id: 7,
        title: 'Claw Control Code',
        week: 7,
        points: 50,
        phase: 'claw',
        description: 'Working code to control your claw mechanism.',
        requirements: [
            'open() and close() functions',
            'Partial grip function (percentage)',
            'Button or serial control input',
            'Video demonstrating claw operation'
        ]
    },
    {
        id: 8,
        title: 'Claw Practical',
        week: 8,
        points: 75,
        phase: 'claw',
        description: 'Pick up and transport an object to a target zone.',
        requirements: [
            'Pick up object from designated location',
            'Transport without dropping',
            'Place in target zone accurately',
            'Bonus for autonomous operation'
        ]
    },
    {
        id: 9,
        title: 'Final Robot Demonstration',
        week: 9,
        points: 100,
        phase: 'final',
        description: 'Demonstrate all three capabilities and present your work.',
        requirements: [
            'Line following demonstration',
            'Obstacle scanning demonstration',
            'Object manipulation with claw',
            'Individual presentation (3-5 min) explaining your work'
        ]
    }
];

// ============================================
// CODE RESOURCES
// ============================================
const RESOURCES = {
    ultrasonic: {
        title: 'HC-SR04 Wiring Guide',
        content: `
## HC-SR04 Ultrasonic Sensor Wiring

### Connections to Arduino RP2040

| HC-SR04 Pin | Arduino Pin |
|-------------|-------------|
| VCC | 5V |
| GND | GND |
| TRIG | GPIO 2 |
| ECHO | GPIO 3 |

### Important Notes
- The HC-SR04 needs 5V power but works with 3.3V logic
- Keep wires short to reduce noise
- Mount sensor away from motors to avoid vibration interference
`
    },
    ultraCode: {
        title: 'Distance Measurement Code',
        content: `
## Basic Ultrasonic Distance Code

\`\`\`cpp
// HC-SR04 with Arduino RP2040
const int trigPin = 2;
const int echoPin = 3;

void setup() {
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

long getDistance() {
  // Send trigger pulse
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Measure echo time
  long duration = pulseIn(echoPin, HIGH);

  // Convert to centimeters
  // Speed of sound = 343 m/s = 0.034 cm/µs
  // Divide by 2 for round trip
  long distance = duration * 0.034 / 2;

  return distance;
}

void loop() {
  long dist = getDistance();
  Serial.print("Distance: ");
  Serial.print(dist);
  Serial.println(" cm");
  delay(100);
}
\`\`\`
`
    },
    scanCode: {
        title: 'Scanning Sweep Code',
        content: `
## Servo Scanning Code

\`\`\`cpp
#include <Servo.h>

Servo scanServo;
const int servoPin = 4;
const int trigPin = 2;
const int echoPin = 3;

// Store scan data
int distances[19]; // 0° to 180° in 10° steps

void setup() {
  Serial.begin(115200);
  scanServo.attach(servoPin);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

long getDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH, 30000);
  if (duration == 0) return 999; // No echo = far away
  return duration * 0.034 / 2;
}

void scan() {
  Serial.println("Starting scan...");

  for (int i = 0; i <= 18; i++) {
    int angle = i * 10;
    scanServo.write(angle);
    delay(100); // Let servo settle

    distances[i] = getDistance();

    Serial.print(angle);
    Serial.print("°: ");
    Serial.print(distances[i]);
    Serial.println(" cm");
  }

  // Find closest obstacle
  int minDist = 999;
  int minAngle = 90;
  for (int i = 0; i <= 18; i++) {
    if (distances[i] < minDist) {
      minDist = distances[i];
      minAngle = i * 10;
    }
  }

  Serial.print("Closest obstacle: ");
  Serial.print(minDist);
  Serial.print(" cm at ");
  Serial.print(minAngle);
  Serial.println("°");
}

void loop() {
  scan();
  delay(2000);
}
\`\`\`
`
    },
    servoCode: {
        title: 'Servo Control Code',
        content: `
## Basic Servo Control

\`\`\`cpp
#include <Servo.h>

Servo myServo;
const int servoPin = 5;

void setup() {
  myServo.attach(servoPin);
  Serial.begin(115200);
}

void loop() {
  // Move to specific angles
  myServo.write(0);    // Full one direction
  delay(1000);

  myServo.write(90);   // Center position
  delay(1000);

  myServo.write(180);  // Full other direction
  delay(1000);
}
\`\`\`

### Servo Tips
- Most servos have 0-180° range
- Some "continuous rotation" servos work differently
- Don't force servo past its limits
- Use \`delay()\` to let servo reach position
`
    },
    clawCode: {
        title: 'Claw Functions Code',
        content: `
## Claw Control Functions

\`\`\`cpp
#include <Servo.h>

Servo clawServo;
const int clawPin = 5;

// Adjust these for YOUR claw
const int OPEN_POS = 10;     // Fully open
const int CLOSED_POS = 90;   // Fully closed

void setup() {
  clawServo.attach(clawPin);
  Serial.begin(115200);
  openClaw();
}

void openClaw() {
  clawServo.write(OPEN_POS);
  Serial.println("Claw OPEN");
}

void closeClaw() {
  clawServo.write(CLOSED_POS);
  Serial.println("Claw CLOSED");
}

// Grip at a percentage (0 = open, 100 = closed)
void gripPercent(int percent) {
  percent = constrain(percent, 0, 100);
  int pos = map(percent, 0, 100, OPEN_POS, CLOSED_POS);
  clawServo.write(pos);
  Serial.print("Grip: ");
  Serial.print(percent);
  Serial.println("%");
}

void loop() {
  // Example: control via Serial
  if (Serial.available()) {
    char cmd = Serial.read();
    if (cmd == 'o') openClaw();
    if (cmd == 'c') closeClaw();
    if (cmd == 'h') gripPercent(50); // Half grip
  }
}
\`\`\`
`
    },
    debug: {
        title: 'Common Problems & Fixes',
        content: `
## Troubleshooting Guide

### Servo Not Moving
1. Check power - servos need 5V and decent current
2. Verify signal wire on correct pin
3. Make sure \`servo.attach(pin)\` is called
4. Try a different servo to rule out hardware

### Ultrasonic Reading 0 or 999
1. Check wiring - TRIG and ECHO might be swapped
2. Verify 5V power to sensor
3. Make sure nothing is too close (< 2cm)
4. Check for loose connections

### Robot Driving Erratically
1. Check battery voltage - low battery = weird behavior
2. Verify motor connections aren't loose
3. Look for shorts in wiring
4. Test motors individually

### Code Won't Upload
1. Select correct board in Arduino IDE
2. Check COM port selection
3. Try pressing reset button during upload
4. Disconnect any wires from TX/RX pins

### Serial Monitor Shows Garbage
1. Match baud rate (usually 115200)
2. Check USB cable is data-capable
3. Close and reopen Serial Monitor
`
    },
    serial: {
        title: 'Using Serial Monitor',
        content: `
## Serial Monitor Guide

### Setup
\`\`\`cpp
void setup() {
  Serial.begin(115200);  // Match this in Serial Monitor!
}
\`\`\`

### Printing Values
\`\`\`cpp
// Print text
Serial.println("Hello!");

// Print numbers
int distance = 42;
Serial.println(distance);

// Print with labels
Serial.print("Distance: ");
Serial.print(distance);
Serial.println(" cm");
\`\`\`

### Reading Input
\`\`\`cpp
void loop() {
  if (Serial.available()) {
    char c = Serial.read();
    Serial.print("You typed: ");
    Serial.println(c);
  }
}
\`\`\`

### Tips
- \`print()\` stays on same line
- \`println()\` adds new line
- Open Serial Monitor with Ctrl+Shift+M
- Make sure baud rate matches your code
`
    }
};

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
    initCodeLibrary();

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
const DRIVE_FOLDER_NAME = 'Portfolio Evidence';
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
            codeSnippets: [],
            currentWeek: 1,
            selectedWeek: 1
        };
        isDirty = false;
        formInitialized = false;

        // Reset sidebar
        document.getElementById('saveStatus').style.display = 'none';
        document.getElementById('signOutBtn').style.display = 'none';
        document.getElementById('studentName').textContent = 'Not Signed In';
        document.getElementById('projectBadge').textContent = 'No Project';
        document.getElementById('avatarInitials').textContent = '--';
        document.getElementById('progressFill').style.width = '0%';
        document.getElementById('progressText').textContent = '0 / 800 pts';

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
                codeSnippets: state.codeSnippets,
                viewedFeedback: state.viewedFeedback || [],
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
    // Clone to clear any stale event listeners
    const fresh = form.cloneNode(true);
    form.parentNode.replaceChild(fresh, form);

    fresh.addEventListener('submit', (e) => {
        e.preventDefault();
        state.student = {
            name: state.student.name,
            email: state.student.email,
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

    // Watch for dynamically added contribution rows
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

    if (pageId === 'dashboard') updateUI();
    if (pageId === 'evidence') loadEvidenceGallery();
    if (pageId === 'code') loadCodeSnippets();
}

// ============================================
// UI UPDATES
// ============================================
function updateUI() {
    if (!state.student) return;

    document.getElementById('avatarInitials').textContent = getInitials(state.student.name);
    document.getElementById('studentName').textContent = state.student.name;

    const phase = getCurrentPhase();
    document.getElementById('projectBadge').textContent = phase.name;

    const completedDeliverables = Object.values(state.deliverables).filter(d => d.status === 'completed').length;
    const completedReflections = Object.keys(state.weeklyReflections).filter(k => state.weeklyReflections[k].submitted).length;

    document.getElementById('completedCount').textContent = completedDeliverables + completedReflections;
    document.getElementById('pendingCount').textContent = (9 - completedDeliverables) + (9 - completedReflections);
    document.getElementById('totalPoints').textContent = calculatePoints();
    document.getElementById('currentWeek').textContent = state.currentWeek;

    const progress = calculateProgress();
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = `${calculatePoints()} / ${CONFIG.POINTS.TOTAL_POSSIBLE} pts`;

    updatePhaseIndicators();
    updateUpcoming();
    updateWeekButtons();
    updateDeliverablesList();
    updateWeekTopic();
    updateFeedbackNotification();
}

function updateFeedbackNotification() {
    const notification = document.getElementById('feedbackNotification');
    const list = document.getElementById('feedbackNotificationList');
    const viewed = state.viewedFeedback || [];

    const gradedItems = [];

    // Check reflections for teacher feedback
    Object.entries(state.weeklyReflections).forEach(([week, reflection]) => {
        if (reflection.submitted && (reflection.teacherGrade !== undefined || reflection.teacherFeedback)) {
            const key = `reflection-${week}`;
            if (!viewed.includes(key)) {
                gradedItems.push({
                    type: 'reflection',
                    key: key,
                    week: week,
                    label: `Week ${week} Reflection`,
                    grade: reflection.teacherGrade,
                    hasFeedback: !!reflection.teacherFeedback
                });
            }
        }
    });

    // Check deliverables for teacher feedback
    Object.entries(state.deliverables).forEach(([id, deliverable]) => {
        if (deliverable.status === 'completed' && (deliverable.teacherGrade !== undefined || deliverable.teacherFeedback)) {
            const key = `deliverable-${id}`;
            if (!viewed.includes(key)) {
                const title = DELIVERABLES.find(d => d.id == id)?.title || `Deliverable ${id}`;
                gradedItems.push({
                    type: 'deliverable',
                    key: key,
                    id: id,
                    label: title,
                    grade: deliverable.teacherGrade,
                    hasFeedback: !!deliverable.teacherFeedback
                });
            }
        }
    });

    if (gradedItems.length === 0) {
        notification.style.display = 'none';
        return;
    }

    notification.style.display = 'block';
    list.innerHTML = gradedItems.map(item => `
        <a href="#" onclick="event.preventDefault(); markFeedbackViewed('${item.key}'); ${item.type === 'reflection' ? `navigateTo('weekly'); selectWeek(${item.week});` : `navigateTo('deliverables'); openDeliverable(${item.id});`}"
           style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; background: white; border-radius: 8px; text-decoration: none; color: inherit;">
            <i class="fas ${item.type === 'reflection' ? 'fa-calendar-check' : 'fa-file-alt'}" style="color: var(--success);"></i>
            <div style="flex: 1;">
                <div style="font-weight: 500;">${item.label}</div>
                <div style="font-size: 12px; color: var(--gray-500);">
                    ${item.grade !== undefined ? `Grade: ${item.grade}` : ''}
                    ${item.grade !== undefined && item.hasFeedback ? ' • ' : ''}
                    ${item.hasFeedback ? 'Written feedback available' : ''}
                </div>
            </div>
            <i class="fas fa-chevron-right" style="color: var(--gray-400);"></i>
        </a>
    `).join('');
}

function markFeedbackViewed(key) {
    if (!state.viewedFeedback) state.viewedFeedback = [];
    if (!state.viewedFeedback.includes(key)) {
        state.viewedFeedback.push(key);
        markDirty();
    }
}

function getCurrentPhase() {
    if (state.currentWeek <= 2) return { name: 'Line Following', key: 'linefollow' };
    if (state.currentWeek <= 5) return { name: 'Ultrasonic Scanner', key: 'scanner' };
    if (state.currentWeek <= 8) return { name: 'Servo Claw', key: 'claw' };
    return { name: 'Final Demo', key: 'final' };
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
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7) + 1;
    state.currentWeek = Math.min(Math.max(1, diffWeeks), 9);
}

function updatePhaseIndicators() {
    const phases = ['linefollow', 'scanner', 'claw', 'final'];
    const phaseElements = {
        linefollow: document.getElementById('phaseLineFollow'),
        scanner:    document.getElementById('phaseScanner'),
        claw:       document.getElementById('phaseClaw'),
        final:      document.getElementById('phaseFinal')
    };

    const currentIndex = phases.indexOf(getCurrentPhase().key);

    phases.forEach((phase, index) => {
        const el = phaseElements[phase];
        if (!el) return;
        if (index < currentIndex)      { el.textContent = 'Complete';    el.style.color = '#4caf50'; }
        else if (index === currentIndex) { el.textContent = 'In Progress'; el.style.color = '#1a73e8'; }
        else                            { el.textContent = 'Upcoming';   el.style.color = '#9aa0a6'; }
    });
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
        // Check for overdue deliverables from previous weeks
        const overdueDeliverable = DELIVERABLES.find(d => d.week === week);
        if (overdueDeliverable && state.deliverables[overdueDeliverable.id]?.status !== 'completed') {
            upcoming.unshift({ title: overdueDeliverable.title, due: 'OVERDUE', points: overdueDeliverable.points, overdue: true });
        }
    }

    list.innerHTML = upcoming.length === 0
        ? '<p style="color: var(--success); padding: 20px; text-align: center;"><i class="fas fa-check-circle"></i> All caught up!</p>'
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

function updateWeekTopic() {
    const topic = WEEK_TOPICS[state.selectedWeek];
    const topicEl = document.getElementById('weekTopic');
    if (topic && topicEl) {
        topicEl.innerHTML = `
            <div class="card" style="background: var(--primary-light); border-left: 4px solid var(--primary);">
                <h4 style="margin-bottom: 5px;">Week ${state.selectedWeek}: ${topic.title}</h4>
                <p style="color: var(--gray-600); margin: 0;">Focus: ${topic.focus}</p>
            </div>
        `;
    }
}

function updateDeliverablesList() {
    const list = document.getElementById('deliverablesList');
    const activePhase = document.querySelector('.phase-tab.active')?.dataset.phase || 'all';

    const filtered = activePhase === 'all' ? DELIVERABLES : DELIVERABLES.filter(d => d.phase === activePhase);

    list.innerHTML = filtered.map(d => {
        const status = state.deliverables[d.id]?.status || 'pending';
        const isCurrent = d.week === state.currentWeek;
        return `
            <div class="deliverable-card ${status} ${isCurrent ? 'current' : ''}" data-id="${d.id}">
                <div class="deliverable-number">${status === 'completed' ? '<i class="fas fa-check"></i>' : d.id}</div>
                <div class="deliverable-info">
                    <div class="deliverable-title">${d.title}</div>
                    <div class="deliverable-meta">
                        <span>Week ${d.week}</span>
                        <span>${formatPhase(d.phase)}</span>
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

    document.querySelectorAll('.phase-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.phase-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updateDeliverablesList();
        });
    });
}

// ============================================
// WEEKLY REFLECTIONS
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
    updateWeekButtons();
    updateWeekTopic();

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

    // Restore evidence thumbnails for the selected week from state
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

    // Hide validation errors when loading
    document.getElementById('validationErrors').style.display = 'none';

    // Show teacher feedback if available
    showTeacherFeedback(data);
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

function clearReflectionForm() {
    document.getElementById('weeklyReflectionForm').reset();
    document.getElementById('contributionList').innerHTML = `
        <div class="contribution-item">
            <input type="date" class="contrib-date" required>
            <input type="text" class="contrib-task" placeholder="I wired the..." required>
        </div>
        <div class="contribution-item">
            <input type="date" class="contrib-date" required>
            <input type="text" class="contrib-task" placeholder="I coded the..." required>
        </div>
        <div class="contribution-item">
            <input type="date" class="contrib-date" required>
            <input type="text" class="contrib-task" placeholder="I tested/debugged..." required>
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
        // Preserve teacher feedback (read-only from student perspective)
        data.teacherGrade = existing.teacherGrade;
        data.teacherFeedback = existing.teacherFeedback;
    }
    state.weeklyReflections[state.selectedWeek] = data;
}

function saveReflectionDraft() {
    const data = getReflectionFormData();
    data.submitted = false;
    // Preserve teacher feedback (read-only from student perspective)
    const existing = state.weeklyReflections[data.week];
    if (existing) {
        data.teacherGrade = existing.teacherGrade;
        data.teacherFeedback = existing.teacherFeedback;
    }
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
    // Preserve teacher feedback (read-only from student perspective)
    const existing = state.weeklyReflections[data.week];
    if (existing) {
        data.teacherGrade = existing.teacherGrade;
        data.teacherFeedback = existing.teacherFeedback;
    }
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
    });
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = '';
    });
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '';
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

function loadEvidenceGallery() {
    const gallery = document.getElementById('evidenceGallery');

    if (state.evidence.length === 0) {
        gallery.innerHTML = '<p class="placeholder-text">No evidence uploaded yet.</p>';
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
        </div>

        <div class="card" style="background: var(--gray-50);">
            <h4 style="margin-bottom: 12px;">Requirements</h4>
            <ul style="margin-left: 20px;">
                ${deliverable.requirements.map(r => `<li style="margin-bottom: 8px;">${r}</li>`).join('')}
            </ul>
        </div>

        <form id="deliverableForm" style="margin-top: 20px;">
            ${deliverable.timeLimit ? `
            <div class="form-group">
                <label for="completionTime">Completion Time (seconds)</label>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <input type="number" id="completionTime" min="0" max="${deliverable.timeLimit * 2}" step="1"
                           value="${existing.completionTime || ''}"
                           placeholder="e.g. 45"
                           style="width: 120px;">
                    <span style="color: var(--gray-500); font-size: 14px;">
                        Time limit: ${deliverable.timeLimit} seconds (${Math.floor(deliverable.timeLimit / 60)}:${String(deliverable.timeLimit % 60).padStart(2, '0')})
                    </span>
                </div>
            </div>
            ` : ''}

            ${id === 3 ? `
            <div class="card" style="margin-bottom: 20px; border-left: 3px solid var(--primary);">
                <h4 style="margin-bottom: 12px;"><i class="fas fa-plug"></i> Wire Connections</h4>
                <p style="color: var(--gray-500); font-size: 13px; margin-bottom: 12px;">List each wire from your Arduino to the HC-SR04 sensor</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--gray-200);">
                            <th style="text-align: left; padding: 8px; font-size: 14px;">Arduino Pin</th>
                            <th style="text-align: center; padding: 8px; font-size: 14px;">→</th>
                            <th style="text-align: left; padding: 8px; font-size: 14px;">Sensor Pin</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${[0,1,2,3].map(i => {
                            const w = (existing.wiring && existing.wiring[i]) || {};
                            return `<tr>
                                <td style="padding: 6px 8px;"><input type="text" class="wiring-arduino" data-row="${i}" value="${w.arduino || ''}" placeholder="e.g. 5V, GND, Pin 9" style="width: 100%; padding: 6px; border: 1px solid var(--gray-200); border-radius: 4px;"></td>
                                <td style="text-align: center; color: var(--gray-400);">→</td>
                                <td style="padding: 6px 8px;"><input type="text" class="wiring-sensor" data-row="${i}" value="${w.sensor || ''}" placeholder="e.g. VCC, GND, TRIG" style="width: 100%; padding: 6px; border: 1px solid var(--gray-200); border-radius: 4px;"></td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <div class="card" style="margin-bottom: 20px; border-left: 3px solid var(--success);">
                <h4 style="margin-bottom: 12px;"><i class="fas fa-ruler"></i> Distance Accuracy Test</h4>
                <p style="color: var(--gray-500); font-size: 13px; margin-bottom: 12px;">Place an object at each distance and record 3 sensor readings</p>
                <table style="width: 100%; border-collapse: collapse; text-align: center;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--gray-200);">
                            <th style="padding: 8px; font-size: 14px;">Actual (cm)</th>
                            <th style="padding: 8px; font-size: 14px;">Reading 1</th>
                            <th style="padding: 8px; font-size: 14px;">Reading 2</th>
                            <th style="padding: 8px; font-size: 14px;">Reading 3</th>
                            <th style="padding: 8px; font-size: 14px;">Avg Error</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${[5, 10, 20, 50, 100].map((dist, i) => {
                            const row = (existing.accuracyData && existing.accuracyData[i]) || {};
                            return `<tr style="border-bottom: 1px solid var(--gray-100);">
                                <td style="padding: 6px 8px; font-weight: bold;">${dist}</td>
                                <td style="padding: 6px 4px;"><input type="number" class="accuracy-reading" data-row="${i}" data-col="r1" value="${row.r1 || ''}" placeholder="cm" style="width: 70px; padding: 4px; text-align: center; border: 1px solid var(--gray-200); border-radius: 4px;"></td>
                                <td style="padding: 6px 4px;"><input type="number" class="accuracy-reading" data-row="${i}" data-col="r2" value="${row.r2 || ''}" placeholder="cm" style="width: 70px; padding: 4px; text-align: center; border: 1px solid var(--gray-200); border-radius: 4px;"></td>
                                <td style="padding: 6px 4px;"><input type="number" class="accuracy-reading" data-row="${i}" data-col="r3" value="${row.r3 || ''}" placeholder="cm" style="width: 70px; padding: 4px; text-align: center; border: 1px solid var(--gray-200); border-radius: 4px;"></td>
                                <td style="padding: 6px 8px;"><span class="avg-error" data-row="${i}" style="font-weight: bold; color: var(--gray-500);">—</span></td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            ` : ''}

            <div class="form-group">
                <label for="deliverableContent">${id === 3 ? 'Code & Observations' : 'Your Submission'}</label>
                <textarea id="deliverableContent" rows="8" placeholder="${id === 3 ? 'Paste your code with comments, and describe your observations about sensor behavior...' : 'Describe what you did, paste your code, explain your process...'}">${id === 3 ? (existing.rawContent || existing.content || '') : (existing.content || '')}</textarea>
            </div>

            <div class="form-group">
                <label for="deliverableLinks">Supporting Links (photos, videos, code)</label>
                <textarea id="deliverableLinks" rows="3" placeholder="https://drive.google.com/...">${existing.links || ''}</textarea>
            </div>

            <div class="form-group">
                <label for="deliverableSelfAssessment">Self-Assessment (1-10)</label>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <input type="number" id="deliverableSelfAssessment" min="1" max="10" value="${existing.selfAssessment || ''}"
                           style="width: 80px;" placeholder="1-10">
                    <span style="color: var(--gray-500); font-size: 13px;">
                        How well did you meet the requirements?
                    </span>
                </div>
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="saveDeliverableDraft(${id})">
                    <i class="fas fa-save"></i> Save Draft
                </button>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-paper-plane"></i> Submit
                </button>
            </div>
        </form>
    `;

    // Attach dirty listeners to form inputs
    content.querySelectorAll('textarea, input').forEach(el => {
        el.addEventListener('input', markDirty);
    });

    // Auto-calculate average error for deliverable 3 accuracy table
    if (id === 3) {
        const distances = [5, 10, 20, 50, 100];
        function updateAvgErrors() {
            distances.forEach((dist, i) => {
                const r1 = parseFloat(document.querySelector(`.accuracy-reading[data-row="${i}"][data-col="r1"]`)?.value);
                const r2 = parseFloat(document.querySelector(`.accuracy-reading[data-row="${i}"][data-col="r2"]`)?.value);
                const r3 = parseFloat(document.querySelector(`.accuracy-reading[data-row="${i}"][data-col="r3"]`)?.value);
                const span = document.querySelector(`.avg-error[data-row="${i}"]`);
                const readings = [r1, r2, r3].filter(v => !isNaN(v));
                if (readings.length > 0) {
                    const avgError = readings.reduce((sum, r) => sum + Math.abs(r - dist), 0) / readings.length;
                    span.textContent = avgError.toFixed(1) + ' cm';
                    span.style.color = avgError <= 2 ? 'var(--success)' : avgError <= 5 ? '#f59e0b' : 'var(--danger)';
                } else {
                    span.textContent = '—';
                    span.style.color = 'var(--gray-500)';
                }
            });
        }
        content.querySelectorAll('.accuracy-reading').forEach(el => {
            el.addEventListener('input', updateAvgErrors);
        });
        updateAvgErrors(); // Calculate on load if data exists
    }

    document.getElementById('deliverableForm').addEventListener('submit', (e) => {
        e.preventDefault();
        submitDeliverable(id);
    });

    modal.classList.add('active');
}

function collectDeliverable3CustomData() {
    const wiring = [0,1,2,3].map(i => ({
        arduino: document.querySelector(`.wiring-arduino[data-row="${i}"]`)?.value || '',
        sensor: document.querySelector(`.wiring-sensor[data-row="${i}"]`)?.value || ''
    }));
    const distances = [5, 10, 20, 50, 100];
    const accuracyData = distances.map((dist, i) => ({
        actual: dist,
        r1: document.querySelector(`.accuracy-reading[data-row="${i}"][data-col="r1"]`)?.value || '',
        r2: document.querySelector(`.accuracy-reading[data-row="${i}"][data-col="r2"]`)?.value || '',
        r3: document.querySelector(`.accuracy-reading[data-row="${i}"][data-col="r3"]`)?.value || ''
    }));
    return { wiring, accuracyData };
}

function saveDeliverableDraft(id) {
    const completionTimeEl = document.getElementById('completionTime');
    state.deliverables[id] = {
        ...state.deliverables[id],
        content: document.getElementById('deliverableContent').value,
        links: document.getElementById('deliverableLinks').value,
        selfAssessment: document.getElementById('deliverableSelfAssessment').value,
        completionTime: completionTimeEl ? parseInt(completionTimeEl.value) || null : null,
        ...(id === 3 ? collectDeliverable3CustomData() : {}),
        status: 'in-progress',
        updatedAt: new Date().toISOString()
    };
    markDirty();
    updateUI();
    showToast('Draft saved!', 'success');
}

function formatDeliverable3Content(content, customData) {
    const { wiring, accuracyData } = customData;
    let formatted = '--- WIRE CONNECTIONS ---\n';
    wiring.forEach(w => {
        if (w.arduino || w.sensor) {
            formatted += `${w.arduino} → ${w.sensor}\n`;
        }
    });
    formatted += '\n--- DISTANCE ACCURACY TEST ---\n';
    formatted += 'Actual(cm) | Reading1 | Reading2 | Reading3 | Avg Error\n';
    formatted += '-----------|----------|----------|----------|---------\n';
    const distances = [5, 10, 20, 50, 100];
    accuracyData.forEach((row, i) => {
        const readings = [row.r1, row.r2, row.r3].map(r => parseFloat(r)).filter(r => !isNaN(r));
        const avgError = readings.length > 0
            ? (readings.reduce((sum, r) => sum + Math.abs(r - distances[i]), 0) / readings.length).toFixed(1)
            : '—';
        formatted += `${String(distances[i]).padEnd(10)} | ${String(row.r1 || '—').padEnd(8)} | ${String(row.r2 || '—').padEnd(8)} | ${String(row.r3 || '—').padEnd(8)} | ${avgError}\n`;
    });
    formatted += '\n--- CODE & OBSERVATIONS ---\n' + content;
    return formatted;
}

function submitDeliverable(id) {
    const deliverable = DELIVERABLES.find(d => d.id === id);
    const content = document.getElementById('deliverableContent').value;
    const completionTimeEl = document.getElementById('completionTime');

    if (!content || content.length < 50) {
        showToast('Please provide more detail (at least 50 characters)', 'error');
        return;
    }

    const customData = id === 3 ? collectDeliverable3CustomData() : {};
    const finalContent = id === 3 ? formatDeliverable3Content(content, customData) : content;

    state.deliverables[id] = {
        content: finalContent,
        rawContent: id === 3 ? content : undefined,
        links: document.getElementById('deliverableLinks').value,
        selfAssessment: document.getElementById('deliverableSelfAssessment').value,
        completionTime: completionTimeEl ? parseInt(completionTimeEl.value) || null : null,
        ...customData,
        status: 'completed',
        submittedAt: new Date().toISOString()
    };

    saveToCloud(); // immediate save on submission
    updateUI();
    document.getElementById('deliverableModal').classList.remove('active');
    showCelebration(`${deliverable.title} Submitted!`);
}

// ============================================
// CODE LIBRARY
// ============================================
function initCodeLibrary() {
    document.getElementById('codeSnippetForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveCodeSnippet();
    });
}

function saveCodeSnippet() {
    const snippet = {
        id: Date.now(),
        title: document.getElementById('snippetTitle').value,
        category: document.getElementById('snippetCategory').value,
        code: document.getElementById('snippetCode').value,
        notes: document.getElementById('snippetNotes').value,
        createdAt: new Date().toISOString()
    };

    state.codeSnippets.push(snippet);
    markDirty();
    document.getElementById('codeSnippetForm').reset();
    loadCodeSnippets();
    showToast('Code snippet saved!', 'success');
}

function loadCodeSnippets() {
    const list = document.getElementById('snippetsList');

    if (state.codeSnippets.length === 0) {
        list.innerHTML = '<p class="placeholder-text">No code snippets saved yet.</p>';
        return;
    }

    list.innerHTML = state.codeSnippets.map(s => `
        <div class="card" style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <h4 style="margin-bottom: 5px;">${s.title}</h4>
                    <span style="font-size: 12px; color: var(--gray-600);">${formatCategory(s.category)}</span>
                </div>
                <button class="btn btn-small btn-secondary" onclick="copySnippet(${s.id})">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <pre style="background: var(--gray-900); color: #fff; padding: 12px; border-radius: 6px; margin-top: 10px; overflow-x: auto; font-size: 12px;"><code>${escapeHtml(s.code)}</code></pre>
            ${s.notes ? `<p style="margin-top: 8px; font-size: 13px; color: var(--gray-600);"><strong>Notes:</strong> ${s.notes}</p>` : ''}
        </div>
    `).join('');
}

function copySnippet(id) {
    const snippet = state.codeSnippets.find(s => s.id === id);
    if (snippet) {
        navigator.clipboard.writeText(snippet.code);
        showToast('Copied to clipboard!', 'success');
    }
}

// ============================================
// RESOURCES
// ============================================
function showResource(key) {
    const resource = RESOURCES[key];
    if (!resource) return;

    const modal = document.getElementById('resourceModal');
    const content = document.getElementById('resourceContent');

    let html = resource.content
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/```cpp([\s\S]*?)```/g, '<pre style="background:#1e1e1e;color:#ddd;padding:15px;border-radius:8px;overflow-x:auto;"><code>$1</code></pre>')
        .replace(/```([\s\S]*?)```/g, '<pre style="background:#1e1e1e;color:#ddd;padding:15px;border-radius:8px;overflow-x:auto;"><code>$1</code></pre>')
        .replace(/`(.*?)`/g, '<code style="background:#f0f0f0;padding:2px 6px;border-radius:3px;">$1</code>')
        .replace(/^\| (.*) \|$/gm, (match) => {
            const cells = match.split('|').filter(c => c.trim());
            return '<tr>' + cells.map(c => `<td style="padding:8px;border:1px solid #ddd;">${c.trim()}</td>`).join('') + '</tr>';
        })
        .replace(/^- (.*$)/gm, '<li>$1</li>')
        .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>');

    content.innerHTML = `<h2>${resource.title}</h2>${html}`;
    modal.classList.add('active');
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

function formatPhase(phase) {
    const names = { linefollow: 'Line Following', scanner: 'Ultrasonic Scanner', claw: 'Servo Claw', final: 'Final Demo' };
    return names[phase] || phase;
}

function formatStatus(status) {
    const labels = { pending: 'Not Started', 'in-progress': 'In Progress', completed: 'Completed' };
    return labels[status] || status;
}

function formatCategory(cat) {
    const names = { linefollow: 'Line Following', ultrasonic: 'Ultrasonic Sensor', servo: 'Servo Control', claw: 'Claw Mechanism', motors: 'Motor Control', other: 'Other' };
    return names[cat] || cat;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

// Expose for inline onclick handlers
window.showToast = showToast;
window.saveDeliverableDraft = saveDeliverableDraft;
window.copySnippet = copySnippet;
window.showResource = showResource;

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
