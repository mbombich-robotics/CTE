# FRC Portfolio System - Setup Instructions

## Overview

This portfolio system allows students to track their FIRST Robotics contributions through a web interface that syncs with Google Sheets for teacher monitoring.

**System Components:**
- `index.html` - Student portfolio interface
- `styles.css` - Styling
- `app.js` - Application logic
- `google-apps-script.js` - Backend for Google Sheets integration

---

## Teacher Setup (One-Time)

### Step 1: Create the Google Sheet Database

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it something like "FRC Portfolio Database - [Your Class]"
3. Keep this spreadsheet open - you'll need it for the next step

### Step 2: Set Up the Google Apps Script Backend

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any default code in the editor
3. Copy the entire contents of `google-apps-script.js` and paste it
4. Click **File > Save** (or Ctrl+S)
5. Name the project "FRC Portfolio Backend"
6. Click **Run > Run function > initializeSheets** to create the database structure
   - You'll need to authorize the script when prompted
   - Click "Review Permissions" > Choose your account > "Allow"

### Step 3: Deploy as Web App

1. Click **Deploy > New deployment**
2. Click the gear icon and select **Web app**
3. Configure:
   - **Description**: "FRC Portfolio API"
   - **Execute as**: Me
   - **Who has access**: Anyone (or "Anyone with Google account" for more security)
4. Click **Deploy**
5. **Copy the Web App URL** - it will look like:
   `https://script.google.com/macros/s/ABC123.../exec`

### Step 4: Configure the Portfolio System

1. Open `app.js` in a text editor
2. Find this line near the top:
   ```javascript
   SHEETS_API_URL: 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL',
   ```
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL` with your actual Web App URL
4. Also update the semester start date:
   ```javascript
   SEMESTER_START: new Date('2025-01-06'),  // Change to your start date
   ```
5. Save the file

### Step 5: Host the Portfolio System

**Option A: GitHub Pages (Recommended)**

1. Create a new GitHub repository (e.g., "frc-portfolio")
2. Upload all files from the FRC_Portfolio_System folder
3. Go to repository **Settings > Pages**
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click Save
7. Your site will be available at: `https://[username].github.io/frc-portfolio`

**Option B: Local/School Server**

1. Copy the FRC_Portfolio_System folder to your school's web server
2. Or share via Google Drive/OneDrive and have students download

**Option C: Each Student Hosts Their Own**

1. Have each student fork your GitHub repository
2. They enable GitHub Pages on their fork
3. Each student has their own URL

---

## Student Setup

### For Students:

1. Go to the portfolio URL provided by your teacher
2. Enter your information:
   - Full name
   - School email
   - Subsystem team
   - Class period
3. Click "Start My Portfolio"

Your data will be saved locally in your browser AND synced to the class Google Sheet.

---

## How It Works

### Data Flow

```
Student Browser                    Google Sheets
     |                                  |
     |  1. Student fills form           |
     |  2. Data saved locally           |
     |  3. Data synced to Sheets  ---->  |
     |                                  |
     |  4. Teacher views Sheets         |
     |  5. Teacher can grade            |
     |  6. Team data loads       <----  |
```

### Student Features

- **Dashboard**: Overview of progress, upcoming deadlines
- **Weekly Reflections**: Submit contributions, evidence, challenges, goals
- **Deliverables**: Complete major assignments with detailed submissions
- **Evidence Gallery**: View all uploaded photos/screenshots
- **Team View**: See subsystem team's combined progress
- **Final Portfolio**: AI-assisted portfolio generation and export

### Teacher Features (In Google Sheets)

- **Students sheet**: All registered students with last sync time
- **Weekly Reflections sheet**: All submitted reflections with contributions
- **Deliverables sheet**: All submitted work with space for grades
- **Activity Log sheet**: Track all student activity
- **Custom menu**: Tools for generating reports and sending reminders

---

## Grading Workflow

### Viewing Student Work

1. Open your Google Sheet database
2. Check the "Weekly Reflections" sheet for weekly submissions
3. Check the "Deliverables" sheet for major assignments
4. Add grades in the "Grade" column

### Running Reports

1. In your Google Sheet, click **FRC Portfolio > Generate Summary Report**
2. A new "Summary Report" sheet will be created with:
   - Total students, reflections, deliverables
   - Per-student progress table
   - Estimated points

### Sending Reminders

1. Click **FRC Portfolio > Send Reminder Emails**
2. Review the execution log to see who has missing work
3. Uncomment the email code in Apps Script if you want to send actual emails

---

## Point Values (Total: 900 points)

| Item | Points | Frequency | Total |
|------|--------|-----------|-------|
| Weekly Reflections | 20 | 9 weeks | 180 |
| Game Analysis | 50 | Week 1 | 50 |
| Subsystem Research | 50 | Week 2 | 50 |
| Design Contribution | 75 | Week 3 | 75 |
| Decision Matrix | 50 | Week 4 | 50 |
| Prototype Documentation | 75 | Week 5 | 75 |
| Testing Log | 50 | Week 6 | 50 |
| Integration Report | 50 | Week 7 | 50 |
| Technical Summary | 75 | Week 8 | 75 |
| Portfolio Entry | 100 | Week 9 | 100 |
| Final Presentation | 100 | Week 9 | 100 |
| **TOTAL** | | | **900** |

---

## Customization

### Changing Teams/Subsystems

Edit the team options in `index.html`:
```html
<select id="setupTeam" required>
    <option value="">Select your team...</option>
    <option value="drivetrain">Drivetrain</option>
    <!-- Add or modify options here -->
</select>
```

Also update the `formatTeamName()` function in `app.js`.

### Changing Class Periods

Edit the period options in `index.html`:
```html
<select id="setupPeriod" required>
    <option value="">Select your period...</option>
    <!-- Add or modify options here -->
</select>
```

### Modifying Point Values

Edit the `DELIVERABLES` array and `CONFIG.POINTS` in `app.js`.

### Changing the Timeline

Update the `SEMESTER_START` date in `app.js` to match your semester.

---

## Troubleshooting

### "Data not syncing to Google Sheets"

1. Check that the Web App URL is correct in `app.js`
2. Make sure the Apps Script is deployed and accessible
3. Check browser console (F12) for errors
4. Try re-deploying the Apps Script

### "Student can't access the portfolio"

1. Verify the hosting URL is correct
2. Check that all files (index.html, styles.css, app.js) are uploaded
3. Try a different browser or clear cache

### "Changes not saving"

1. Data is saved to browser localStorage - different browsers = different data
2. Students should use the same browser/computer
3. Data also syncs to Google Sheets as backup

### "Google Sheets shows errors"

1. Run **FRC Portfolio > Initialize Sheets** from the custom menu
2. Check that all required sheets exist
3. Look at the Activity Log sheet for error details

---

## Security Notes

- Student data is stored in browser localStorage (on their device)
- Data synced to Google Sheets is visible to anyone with sheet access
- The Web App runs with teacher's Google account permissions
- Consider setting "Who has access" to "Anyone with Google account" for added security
- Don't store sensitive information (passwords, SSN, etc.)

---

## Support

For issues with the portfolio system, check:
1. Browser developer console (F12) for JavaScript errors
2. Apps Script execution log for backend errors
3. Google Sheets for data integrity issues

---

## Quick Start Checklist

- [ ] Create Google Sheet
- [ ] Add Apps Script backend
- [ ] Deploy as Web App
- [ ] Copy Web App URL to app.js
- [ ] Update semester start date in app.js
- [ ] Host files (GitHub Pages or school server)
- [ ] Test with a sample student account
- [ ] Share URL with students
- [ ] Monitor Google Sheet for submissions
