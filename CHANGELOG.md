# Changelog

## Portfolio System Versions

| Component | Current Version |
|-----------|----------------|
| Robotics Student Portal (app.js) | v2.8.5 |
| Robotics Backend (google-apps-script.js) | v2.9.8 |
| FRC Backend (google-apps-script.js) | v2.9.8 |
| Teacher Portal (teacher-portal.js) | v2.9.8 |

---

## 2026-02-09

### Student Portal v2.8.5 / Backend v2.9.8 / Teacher Portal v2.9.8
- **Fixed week calculation bug**: Changed from `Math.ceil()` to `Math.floor() + 1` so Feb 9 correctly shows as week 2 instead of week 1
- **Fixed "behind" status in teacher portal**: Students no longer marked as "behind" until Friday 3pm deadline passes for each week (was incorrectly marking everyone as behind on Monday of week 2)
- **Added overdue deliverables to student dashboard**: Deliverables from previous weeks now show in "Due This Week" section if not completed

## 2026-02-08

### School Board Presentation
- Updated "5 Industry-Standard Technologies" section: replaced "Arduino microcontroller programming" with "Embedded systems programming" and added "Electromechanical systems integration"
- Embedded Slide 4 and Hero photos from `Schoolboard Presentation Photos` folder
- Removed camera emoji watermarks from embedded photos
- Reduced hero photo width from 80% to 68% to prevent text clipping
- Moved navigation buttons and slide number from `bottom: 40px` to `bottom: 12px` to prevent overlapping content on slide 7
- Scaled down slide 12 font sizes and spacing to fit within viewport

---

## 2026-02-07

### Teacher Portal v2.9.7
- Sort grade report alphabetically by student last name

### Teacher Portal v2.9.5 / Backend v2.9.5
- Add "Send Reminders" button to the Students Behind card on the teacher portal dashboard
- Reminder emails now include a direct link to the student portfolio
- Added `sendRemindersWeb` API endpoint to both Robotics and FRC backends

### Backend v2.9.4
- Fixed reminder email logic: changed loop from `w < currentWeek` to `w <= currentWeek` so Saturday reminders cover the current (Friday-due) week

### Backend v2.9.3
- Enabled reminder email functionality (was previously commented out)
- Emails signed "Mr. B" with formatted HTML body listing missing weeks

### Teacher Portal v2.9.5
- Fixed points display to use actual teacher-entered grades instead of fixed 20 points per entry

### Student Portal v2.8.4 / Backend v2.9.2
- Persist `viewedFeedback` array across sessions via cloud save (saveFullState)
- Added viewedFeedback to both `saveToCloud` payload and backend `saveFullState` handler

### Student Portal v2.8.3
- Fixed dashboard not refreshing when navigating back (added `updateUI()` call)
- Updated `calculatePoints()` to use actual teacher grades instead of fixed 20 points

### Student Portal v2.8.2
- Fixed teacher feedback (grade and comments) disappearing when switching between weeks
- Root cause: `captureReflectionFormData`, `saveReflectionDraft`, and `submitWeeklyReflection` were overwriting state without preserving `teacherGrade` and `teacherFeedback`
- Added `viewedFeedback` tracking so feedback notifications disappear once viewed

### Student Portal v2.8.1
- Fixed clicking feedback notification leading to white screen (`navigateTo('reflections')` changed to `navigateTo('weekly')` — page ID is `weeklyPage`)
- Updated student portal API URL to current backend deployment

### Backend v2.9.4 (Teacher Portal)
- Fixed column alignment for grading after adding self-assessment column
- Added feedback notification system to student dashboard

### Backend v2.9.3 (Teacher Portal)
- Fixed ungraded indicator using wrong column index after self-assessment addition

### Backend v2.9.0 / Teacher Portal v2.9.2
- Added self-assessment column to weekly reflections sheet
- Self-assessment scores displayed in teacher portal student view

### Teacher Portal v2.9.0
- Added evidence data to `loadAllData` API and merged into teacher portal display

### Teacher Portal v2.8.6–v2.8.9
- Multiple iterations fixing Google Drive evidence photo thumbnails in teacher portal
- Final solution: try thumbnail first, fall back to click-to-view card

---

## 2026-02-06

### Teacher Portal v2.8.0–v2.8.4
- **v2.8.0**: Added inline grading to teacher portal student detail view
- **v2.8.1**: Added Grade Report feature (printable report of all students)
- **v2.8.2**: Updated API URLs for new deployments
- **v2.8.3**: Fixed CORS issue with grade save by removing Content-Type header
- **v2.8.4**: Added grade persistence and ungraded work indicator

### Student Portal v2.8.5
- Added Egyptian walk robot animation on submission
- Show self-assessment scores in reflection view

### Backend v2.8.0
- Updated backend versions and refreshed API URLs for both classes

### Backend v2.7.0–v2.7.5
- **v2.7.0**: Added Google Drive integration for evidence photos (OAuth2 token client, drive.file scope)
- Fixed evidence photos disappearing after page refresh with Drive metadata support
- Fixed FRC evidence thumbnails not displaying for Drive-based photos
- Added version numbers to sign-in modals on both student portfolios
- Added auto-update for Evidence sheet headers

### Teacher Portal v2.6.0–v2.7.3
- **v2.6.0**: Added version display to portfolios and teacher portal
- **v2.6.1**: Fixed sync reliability by removing no-cors mode
- **v2.6.2**: Updated evidence display in teacher portal
- **v2.7.0**: Google Drive integration for evidence photos
- **v2.7.1**: Fixed clickable evidence images
- **v2.7.2**: Fixed Google Sign-In race condition
- **v2.7.3**: Added version display to teacher portal sign-in
- **v2.7.4**: Debug logging and timeout for Sign-In
- **v2.7.5**: Fixed syntax error in evidence display template

### Other
- Added Google Sign-In retry mechanism to student portals
- Updated Robotics deliverables #1 and #2 with track requirements

---

## 2026-02-05

- Added image compression to fix multi-photo upload localStorage quota issue
- Fixed Google Sheets 50,000 character limit blocking multiple evidence photos (moved to Drive storage)
- Updated portfolio backend URLs to use new Evidence sheet deployments
- Added version logging to portfolio apps for troubleshooting
- Updated grading system in teacher portal

---

## 2026-02-04

- Fixed evidence photos disappearing on reload and missing from teacher portal
- Created teacher portal (initial version)
- Added alternative code slide to Lesson 8, video card to Unit 8

---

## 2026-02-03

- Fixed autosave: sync form data to state before saving or switching weeks
- Added red IC chip favicon site-wide
- Unified sidebar navigation across all unit pages, removed midterm link
- Switched Apps Script URLs from org-scoped to open-access path
- Fixed evidence screenshots disappearing and data not saving to Google Sheets
- Wired up Apps Script backends and updated period labels
- Fixed Robotics Apps Script labels and stale reminder date

---

## 2026-02-02

- Added Google Sign-In authentication to both portfolio systems
- Reorganized curriculum structure and added new units (Unit 5, Unit 8)

---

## Pre-Portfolio (2025–2026)

- Course lesson content: Units 1–5, 8
- Quizzes, homework scripts, practical exercises
- Budget planning documents
- Initial curriculum site setup with GitHub Pages
