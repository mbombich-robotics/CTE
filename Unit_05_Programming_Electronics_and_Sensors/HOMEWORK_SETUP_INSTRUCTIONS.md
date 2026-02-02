# Homework Submission System - Setup Instructions

This guide will help you set up the homework submission system for Unit 5 Programming lessons. Students will be able to submit their Arduino code through web forms that automatically store submissions in Google Sheets.

---

## Overview

The homework submission system consists of:
- **4 HTML submission forms** (Lessons 2-5)
- **1 Google Apps Script** that receives and organizes submissions
- **1 Google Sheet** with separate tabs for each lesson

---

## Step 1: Create the Google Sheet

1. **Go to Google Sheets**: [sheets.google.com](https://sheets.google.com)

2. **Create a new spreadsheet**
   - Click "Blank" to create a new sheet
   - Name it: **Unit 5 Homework Submissions**

3. **Leave it as-is for now**
   - The Google Apps Script will automatically create the tabs and headers when the first submissions come in
   - Each lesson will get its own tab (Lesson 2, Lesson 3, Lesson 4, Lesson 5)

---

## Step 2: Set Up Google Apps Script

1. **Open Apps Script Editor**
   - In your Google Sheet, click **Extensions** → **Apps Script**

2. **Replace the default code**
   - Delete any existing code in the editor
   - Open the file: `GoogleAppsScript_HomeworkSubmission.js`
   - Copy ALL the code from that file
   - Paste it into the Apps Script editor

3. **Save the script**
   - Click the **Save** icon (💾) or press `Ctrl+S` / `Cmd+S`
   - Name the project: **Homework Submission Handler**

---

## Step 3: Deploy as Web App

1. **Click "Deploy" → "New deployment"**

2. **Configure the deployment**
   - Click the gear icon ⚙️ next to "Select type"
   - Choose **Web app**

3. **Set the following options:**
   - **Description**: `Homework Submission System`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone`
     - ⚠️ **Important**: Must be "Anyone" for students to submit without signing in

4. **Click "Deploy"**

5. **Authorize the app**
   - Click "Authorize access"
   - Choose your Google account
   - If you see a warning "Google hasn't verified this app":
     - Click "Advanced"
     - Click "Go to [project name] (unsafe)"
   - Click "Allow" to grant permissions

6. **Copy the Web App URL**
   - You'll see a URL that looks like:
     ```
     https://script.google.com/macros/s/AKfycby.../exec
     ```
   - **Copy this entire URL** - you'll need it in the next step

---

## Step 4: Update the Homework HTML Files

You need to add your Web App URL to **each** of the 4 homework submission files:

### Files to Update:
- `Lesson_02_Homework.html`
- `Lesson_03_Homework.html`
- `Lesson_04_Homework.html`
- `Lesson_05_Homework.html`

### For Each File:

1. **Open the file** in a text editor (VS Code, Notepad++, etc.)

2. **Find line 269** (or search for):
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
   ```

3. **Replace the placeholder** with your actual URL:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
   ```

4. **Save the file**

5. **Repeat for all 4 homework files**

---

## Step 5: Test the System

1. **Open one of the homework files** in a web browser (e.g., `Lesson_02_Homework.html`)

2. **Fill out the test submission:**
   - Email: `test.student@vicksburgschools.org`
   - Name: `Test Student`
   - Code: Paste some Arduino code
   - Notes: `This is a test submission`

3. **Click "Submit Homework"**
   - You should see a loading spinner
   - Then a success message

4. **Check your Google Sheet**
   - Refresh the spreadsheet
   - You should see a new tab: **Lesson 2**
   - The tab should have headers and your test submission

5. **Verify the data:**
   - ✅ Timestamp is correct
   - ✅ Student info is captured
   - ✅ Code is displayed
   - ✅ Status shows "Submitted" with green background

---

## Step 6: Share with Students

### Option 1: Google Classroom
1. Upload each homework HTML file as a material
2. Students download and open in their browser
3. They fill out the form and submit

### Option 2: Web Hosting
1. Upload the homework files to your school's web server
2. Share the direct links with students
3. Students click the link and submit directly

### Option 3: Shared Drive
1. Place homework files in a shared Google Drive folder
2. Students can open HTML files directly from Drive
3. Chrome/Edge will render them properly

---

## Understanding the Gradebook

### Sheet Structure

Each lesson has its own tab with these columns:

| Column | Purpose | Who Fills |
|--------|---------|-----------|
| **A - Timestamp** | When submitted | Auto |
| **B - Student Email** | Identification | Student |
| **C - Student Name** | Display name | Student |
| **D - Assignment** | Assignment name | Auto |
| **E - Code Submitted** | Arduino code | Student |
| **F - Notes** | Student comments | Student |
| **G - Status** | Submitted/Graded | Auto/Teacher |
| **H - Grade** | Score | Teacher |
| **I - Feedback** | Teacher comments | Teacher |

### Color Coding

- **🟢 Green (#d4edda)**: New submission
- **🟡 Yellow (#fff3cd)**: Resubmission (student submitted again)
- **🔵 Blue**: Graded (manually change when done)

### Handling Resubmissions

- If a student submits the same assignment twice (same email + same assignment), the system will:
  - **Update the existing row** with the new submission
  - **Highlight it in yellow**
  - **Change status to "Resubmitted"**
- This prevents duplicate entries

---

## Grading Workflow

1. **Review submissions** in each lesson tab
2. **Test the student's code** (copy/paste into Arduino IDE)
3. **Enter grade** in column H
4. **Add feedback** in column I
5. **Update status** in column G to "Graded"
6. *Optional*: Change row color to blue to indicate grading complete

---

## Exporting Grades

### To CSV:
1. Click on a lesson tab
2. **File** → **Download** → **Comma Separated Values (.csv)**
3. Import into your gradebook software

### To PDF:
1. Click on a lesson tab
2. **File** → **Download** → **PDF**
3. Choose "Current sheet" only

---

## Troubleshooting

### Students see "There was an error submitting"

**Possible causes:**
1. **Web App URL not updated** in the HTML file
2. **Wrong "Who has access" setting** - must be "Anyone"
3. **Script not deployed** or deployment disabled

**Fix:**
- Re-check Step 4 (URL replacement)
- Re-deploy the web app with "Anyone" access

---

### Submissions not appearing in the sheet

**Possible causes:**
1. Students are opening an **old cached version** of the HTML file
2. **Browser blocking the request** (very rare)

**Fix:**
- Have students hard-refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Try a different browser (Chrome recommended)

---

### Duplicate submissions creating new rows instead of updating

**This is normal if:**
- Different assignment name (Lesson 2 vs Lesson 3)
- Different email address (student@school.org vs student@gmail.com)

**The system ONLY updates if:**
- Same email **AND** same assignment name

---

### Students can't access the form

**Make sure:**
- HTML files are not corrupted (open in text editor to verify)
- Files are shared with students properly
- Students are using a modern browser (Chrome, Firefox, Edge)

---

## Updating the Script

If you need to modify the Google Apps Script later:

1. **Go to your Google Sheet**
2. **Extensions** → **Apps Script**
3. **Make your changes**
4. **Save** (Ctrl+S / Cmd+S)
5. **Deploy** → **Manage deployments**
6. **Click the pencil icon** next to your deployment
7. **Change version** to "New version"
8. **Click "Deploy"**

**Note:** You do NOT need to update the URL in the HTML files unless you create a completely new deployment.

---

## Security Notes

- ✅ **No student authentication required** - students can submit without signing in
- ✅ **Submissions are append-only** - students cannot view or delete others' submissions
- ✅ **Teacher-only access** - only you can see the Google Sheet with all submissions
- ⚠️ **Email validation** - students can enter any email, so verify submissions manually

---

## Quick Reference

| Task | File/Location |
|------|---------------|
| View submissions | Open Google Sheet |
| Edit submission handler | Extensions → Apps Script |
| Update web app URL | Edit HTML files, line 269 |
| Add new lesson | Create new HTML file, update script if needed |
| Export grades | File → Download → CSV |

---

## Support

If you encounter issues not covered here:

1. **Check the browser console** (F12) for JavaScript errors
2. **Check Apps Script logs**: Apps Script Editor → Execution log
3. **Test with your own email** to verify the flow works

---

**Setup Complete!** 🎉

Your homework submission system is now ready for student use.

Students will:
1. Complete their Arduino assignment
2. Open the homework HTML file for that lesson
3. Paste their code and submit
4. Receive confirmation

You will:
1. See all submissions organized by lesson
2. Grade submissions directly in the spreadsheet
3. Export grades when ready

---

**Applied Engineering & Robotics** | Unit 5 Programming
