# Unit 5 Quiz - Google Apps Script Setup Instructions

This guide will help you set up the Google Apps Script to track quiz access logs and submissions.

## Overview

The quiz now tracks two types of events:
1. **Access Logs**: When a student signs in and views the quiz
2. **Quiz Submissions**: When a student submits their completed quiz

Both events are logged to separate sheets in your Google Spreadsheet.

## Step 0: Configure Google OAuth (Required First!)

### Create OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the required APIs:
   - Go to **APIs & Services > Library**
   - Search for "Google Sign-In" and enable it
4. Configure OAuth Consent Screen:
   - Go to **APIs & Services > OAuth consent screen**
   - User Type: **External** (allows anyone to sign in)
   - App name: `Unit 5 Quiz`
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue**
   - Scopes: Skip for now (click **Save and Continue**)
   - Test users: Add your email and any test accounts
   - Click **Save and Continue**
5. Create OAuth Client ID:
   - Go to **APIs & Services > Credentials**
   - Click **+ CREATE CREDENTIALS** > **OAuth client ID**
   - Application type: **Web application**
   - Name: `Quiz Web Client`
   - **Authorized JavaScript origins**: Add these:
     ```
     http://localhost
     http://localhost:8080
     http://127.0.0.1
     ```
   - Click **Create**
   - Copy the **Client ID** (looks like: `123456789-abcdef.apps.googleusercontent.com`)

**IMPORTANT**: You must update line 641 in `Lesson_06_Quiz_Graded.html` with your new Client ID:
```javascript
const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
```

## Step 1: Create a Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "Unit 5 Quiz Results"
4. Copy the Spreadsheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the `SPREADSHEET_ID` part

## Step 2: Create the Apps Script

1. In your Google Spreadsheet, go to **Extensions > Apps Script**
2. Delete any default code in the editor
3. Copy all the code from `GoogleAppsScript_QuizLogger.gs`
4. Paste it into the Apps Script editor
5. **IMPORTANT**: Update line 5 with your Spreadsheet ID:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
   ```

## Step 3: Deploy as Web App

1. Click the **Deploy** button (top right) > **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: "Unit 5 Quiz Logger"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. Review permissions and click **Authorize access**
7. Choose your Google account
8. Click **Advanced** > **Go to [Your Project Name] (unsafe)**
9. Click **Allow**
10. Copy the **Web App URL** that appears

## Step 4: Update the Quiz HTML

1. Open `Lesson_06_Quiz_Graded.html`
2. Find line 638 (the `GOOGLE_SCRIPT_URL` constant)
3. Replace the URL with your new Web App URL:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_WEB_APP_URL_HERE';
   ```

## Step 5: Test the Setup

**IMPORTANT**: You must run the quiz through a local web server, not by opening the file directly.

### Start a Local Web Server

Choose one method:

**Method A: Python (Easiest)**
```bash
cd c:\Users\matt\StudioProjects\lessons\Unit_05_Programming
python -m http.server 8080
```
Then open: `http://localhost:8080/Lesson_06_Quiz_Graded.html`

**Method B: Node.js**
```bash
cd c:\Users\matt\StudioProjects\lessons\Unit_05_Programming
npx http-server -p 8080
```
Then open: `http://localhost:8080/Lesson_06_Quiz_Graded.html`

**Method C: VS Code Live Server**
1. Install "Live Server" extension
2. Right-click `Lesson_06_Quiz_Graded.html`
3. Select "Open with Live Server"

### Test Sign-In and Logging

1. Open the quiz through your local web server
2. Sign in with a test Google account
3. Check your Google Spreadsheet - you should see:
   - A new sheet named "Access Log" with your sign-in record
4. Complete and submit the quiz
5. Check your spreadsheet again - you should see:
   - A new sheet named "Quiz Submissions" with your submission

**Troubleshooting**: If you get an "Access Denied" error, see `TROUBLESHOOTING_SIGNIN.md`

## What Gets Logged

### Access Log Sheet
- **Timestamp**: When the student signed in
- **Student Name**: From Google account
- **Email**: Student's email address
- **Current Attempts Used**: How many submissions they've already made
- **Action**: "Viewed Quiz"

### Quiz Submissions Sheet
- **Timestamp**: When the quiz was submitted
- **Student Name**: From Google account
- **Email**: Student's email address
- **Score**: Number correct (out of 25)
- **Max Score**: 25
- **Percentage**: Score percentage (color-coded)
  - Green (90%+): Excellent
  - Blue (80-89%): Good
  - Orange (70-79%): Passing
  - Red (Below 70%): Needs improvement
- **Attempt Number**: 1 or 2
- **Detailed Answers**: JSON array of answers (can be parsed for analysis)

## Monitoring Student Access

You can now see:
- **Who previewed the quiz**: Check Access Log for students who signed in but never submitted
- **Multiple access attempts**: Students who signed in multiple times
- **Time spent**: Compare access timestamp to submission timestamp
- **Submission attempts**: Compare attempt numbers in Quiz Submissions

## Troubleshooting

### "Access logged" appears in browser console but no data in sheet
- Check that you updated the `SPREADSHEET_ID` in the Apps Script
- Make sure you deployed as "Anyone" can access

### "Error submitting to Google Sheets" message
- Verify the Web App URL in the HTML matches your deployment URL
- Re-deploy the Apps Script and update the URL

### Sheets not appearing automatically
- Run the Apps Script once manually to initialize the sheets
- Or submit one test quiz to create them automatically

## Privacy Note

Remind students that:
- Signing in and viewing the quiz is logged
- This prevents them from "previewing" questions without it being tracked
- They should be ready to take the quiz before signing in
