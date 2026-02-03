// Robotics Portfolio - Main Application (Google Auth Edition)

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================
const CONFIG = {
    // Google Sheets Web App URL (deploy your Apps Script and paste URL here)
    SHEETS_API_URL: 'https://script.google.com/a/macros/vicksburgschools.org/s/AKfycbyn2W1iQxkKT5MbzSxROvod3pdT7omegWkvOQkoWv7jJVI9Ff2eox_i30EE1-8TNZ0G/exec',

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
        description: 'Navigate a test track demonstrating line following capability.',
        requirements: [
            'Robot follows line through curves',
            'Handles intersections appropriately',
            'Recovers from minor errors',
            'Completes track within time limit'
        ]
    },
    {
        id: 2,
        title: 'Line Following Final Practical',
        week: 2,
        points: 75,
        phase: 'linefollow',
        description: 'Timed run on standardized track with advanced features.',
        requirements: [
            'Complete track with minimal errors',
            'Best of 3 attempts scored',
            'Points for speed and consistency',
            'Bonus for handling edge cases'
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
            'Wiring diagram (hand-drawn or digital)',
            'Code with comments explaining each section',
            'Distance accuracy data table (5+ distances)',
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
    currentWeek: 1,
    selectedWeek: 1
};

let autoSaveTimer = null;
let isDirty = false;

// ============================================
// GOOGLE SIGN-IN INITIALIZATION
// ============================================
window.onload = function () {
    google.accounts.id.initialize({
        client_id: CONFIG.GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById('googleSignInBtn'),
        { theme: 'outline', size: 'large', width: 300, text: 'signin_with' }
    );

    // Show sign-in modal on page load
    document.getElementById('signinModal').classList.add('active');

    // Init navigation and static components immediately
    initNavigation();
    initDeliverables();
    initCodeLibrary();

    // Wire sign-out button
    document.getElementById('signOutBtn').addEventListener('click', signOut);
};

// ============================================
// GOOGLE AUTH HANDLERS
// ============================================
function handleCredentialResponse(response) {
    const payload = decodeJwtPayload(response.credential);
    const email = payload.email;
    const name = payload.name;

    // Dismiss sign-in modal
    document.getElementById('signinModal').classList.remove('active');

    // Attempt cloud load
    loadStudentFromCloud(email).then(cloudData => {
        if (cloudData && cloudData.student) {
            // Returning student
            state = cloudData;
            state.student.name = name; // refresh display name
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
    });
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

    setSaveIndicator('saving');

    try {
        // Strip base64 image data from evidence before sending — Sheets cells have a character limit
        const evidenceMeta = state.evidence.map(({ type, week, filename, uploadedAt }) => ({ type, week, filename, uploadedAt }));

        await fetch(CONFIG.SHEETS_API_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({
                action: 'sync',
                student: state.student,
                weeklyReflections: state.weeklyReflections,
                deliverables: state.deliverables,
                evidence: evidenceMeta,
                codeSnippets: state.codeSnippets,
                timestamp: new Date().toISOString()
            })
        });
        isDirty = false;
        setSaveIndicator('saved');
    } catch (error) {
        console.error('Save to cloud failed:', error);
        setSaveIndicator('error');
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

    selectWeek(state.currentWeek);
}

function selectWeek(week) {
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

    // Restore evidence thumbnails for the selected week from state
    const preview = document.getElementById('evidencePreview');
    preview.innerHTML = '';
    state.evidence
        .filter(ev => ev.week === state.selectedWeek && ev.data)
        .forEach(ev => {
            const thumb = document.createElement('div');
            thumb.className = 'evidence-thumb';
            thumb.innerHTML = `
                <img src="${ev.data}" alt="Evidence">
                <button type="button" class="remove-btn" onclick="this.parentElement.remove()">
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

    return {
        week: state.selectedWeek,
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
    markDirty();
    showToast('Draft saved!', 'success');
}

function submitWeeklyReflection(e) {
    e.preventDefault();
    const data = getReflectionFormData();

    if (data.contributions.length < 3) {
        showToast('Please add at least 3 contributions', 'error');
        return;
    }

    data.submitted = true;
    data.submittedAt = new Date().toISOString();
    state.weeklyReflections[data.week] = data;
    saveToCloud(); // immediate save on submission
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

            state.evidence.push({
                type: 'weekly',
                week: state.selectedWeek,
                data: e.target.result,
                filename: file.name,
                uploadedAt: new Date().toISOString()
            });
            markDirty();
        };
        reader.readAsDataURL(file);
    });
}

function loadEvidenceGallery() {
    const gallery = document.getElementById('evidenceGallery');

    if (state.evidence.length === 0) {
        gallery.innerHTML = '<p class="placeholder-text">No evidence uploaded yet.</p>';
        return;
    }

    gallery.innerHTML = state.evidence.map(item => `
        <div class="gallery-item" data-type="${item.type}">
            <img src="${item.data}" alt="${item.filename}">
            <div class="gallery-item-info">
                <div class="date">${new Date(item.uploadedAt).toLocaleDateString()}</div>
                <div class="caption">Week ${item.week}</div>
            </div>
        </div>
    `).join('');
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
            <div class="form-group">
                <label for="deliverableContent">Your Submission</label>
                <textarea id="deliverableContent" rows="8" placeholder="Describe what you did, paste your code, explain your process...">${existing.content || ''}</textarea>
            </div>

            <div class="form-group">
                <label for="deliverableLinks">Supporting Links (photos, videos, code)</label>
                <textarea id="deliverableLinks" rows="3" placeholder="https://drive.google.com/...">${existing.links || ''}</textarea>
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

    // Attach dirty listeners to the new textareas inside the modal
    content.querySelectorAll('textarea').forEach(el => {
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

    if (!content || content.length < 50) {
        showToast('Please provide more detail (at least 50 characters)', 'error');
        return;
    }

    state.deliverables[id] = {
        content,
        links: document.getElementById('deliverableLinks').value,
        status: 'completed',
        submittedAt: new Date().toISOString()
    };

    saveToCloud(); // immediate save on submission
    updateUI();
    document.getElementById('deliverableModal').classList.remove('active');
    showToast(`${deliverable.title} submitted! (+${deliverable.points} pts)`, 'success');
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

// Expose for inline onclick handlers
window.showToast = showToast;
window.saveDeliverableDraft = saveDeliverableDraft;
window.copySnippet = copySnippet;
window.showResource = showResource;
