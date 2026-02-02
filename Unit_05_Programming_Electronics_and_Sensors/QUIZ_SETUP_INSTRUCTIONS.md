# Graded Quiz Setup Instructions

Follow these steps to set up the graded quiz with Google Sheets integration and Google Sign-In authentication.

---

## Part 1: Google Sheets Setup (5 minutes)

### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Click "+ Blank" to create a new spreadsheet
3. Name it something like "Arduino Quiz Results - Lesson 6"

### Step 2: Add Apps Script
1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any default code in the editor
3. Open the file `GoogleAppsScript_QuizSubmission.js` from your lessons folder
4. Copy ALL the code from that file
5. Paste it into the Apps Script editor
6. Click the **Save** icon (💾) and name it "Quiz Submission Handler"

### Step 3: Deploy as Web App
1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure settings:
   - **Description:** "Quiz submission endpoint"
   - **Execute as:** "Me" (your account)
   - **Who has access:** "Anyone"
     - ⚠️ **Important:** This must be "Anyone" so students can submit without signing in to the script
5. Click **Deploy**
6. **Copy the Web App URL** - you'll need this in Step 4!
   - It will look like: `https://script.google.com/macros/s/AKfycbz.../exec`

### Step 4: Update the Quiz HTML File
1. Open `Lesson_06_Quiz_Graded.html` in a text editor
2. Find this line near the top of the `<script>` section:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
   ```
3. Replace `'YOUR_GOOGLE_SCRIPT_URL_HERE'` with your Web App URL from Step 3:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz.../exec';
   ```
4. Save the file

---

## Part 2: Google OAuth Setup (10 minutes)

To enable Google Sign-In, you need to create a Google Cloud Project and get an OAuth Client ID.

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click **New Project**
4. Name it "Arduino Quiz App" (or similar)
5. Click **Create**
6. Wait for the project to be created, then select it

### Step 2: Enable Google Identity Services
1. In the left sidebar, click **APIs & Services** → **Library**
2. Search for "Google Identity"
3. Click **Google Identity Services API**
4. Click **Enable**

### Step 3: Configure OAuth Consent Screen
1. In the left sidebar, click **OAuth consent screen**
2. Choose **Internal** if you have a Google Workspace (school domain)
   - OR choose **External** if using regular Gmail accounts
3. Click **Create**
4. Fill in required fields:
   - **App name:** "Arduino Quiz"
   - **User support email:** Your email
   - **Developer contact email:** Your email
5. Click **Save and Continue**
6. Skip the "Scopes" section → Click **Save and Continue**
7. Skip "Test users" (if External) → Click **Save and Continue**
8. Review and click **Back to Dashboard**

### Step 4: Create OAuth Client ID
1. In the left sidebar, click **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Choose **Application type:** "Web application"
4. **Name:** "Arduino Quiz Web Client"
5. Under **Authorized JavaScript origins**, click **+ Add URI**:
   - If testing locally: Add `http://localhost` or `file://`
   - If hosting online: Add your website URL (e.g., `https://yourschool.edu`)
   - You can add multiple URIs (one per line)
6. Click **Create**
7. **Copy the Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)

### Step 5: Update the Quiz HTML File
1. Open `Lesson_06_Quiz_Graded.html` in a text editor
2. Find this line:
   ```javascript
   const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';
   ```
3. Replace `'YOUR_GOOGLE_CLIENT_ID_HERE'` with your Client ID:
   ```javascript
   const GOOGLE_CLIENT_ID = '123456789-abc123.apps.googleusercontent.com';
   ```
4. Save the file

---

## Part 3: Testing (5 minutes)

### Step 1: Test the Quiz
1. Open `Lesson_06_Quiz_Graded.html` in a web browser
2. Click "Sign in with Google"
3. Sign in with your Google account
4. Take the quiz (you can answer quickly for testing)
5. Click "Submit Quiz"

### Step 2: Verify Data in Google Sheet
1. Go back to your Google Sheet
2. You should see:
   - Headers in row 1 (Timestamp, Email, Name, Score, etc.)
   - Your test submission in row 2
   - Color-coded scores:
     - Green cells = correct answers or high score
     - Red cells = incorrect answers or low score

### Step 3: Test Multiple Submissions
1. Click "Retake Quiz" in the results page
2. Take it again with different answers
3. Verify the second submission appears in the Google Sheet

---

## Part 4: Deploying to Students

### Option A: Local Files
If students access files from a shared drive or local network:
1. Put all lesson files (including `Lesson_06_Quiz_Graded.html`) in a shared folder
2. Students open the HTML file directly in their browser
3. They sign in with their school Google accounts
4. Results automatically submit to your Google Sheet

### Option B: Web Hosting
If you have a school website or Google Sites:
1. Upload `Lesson_06_Quiz_Graded.html` to your web server
2. Share the URL with students
3. They access it through their browser
4. Results automatically submit to your Google Sheet

### Option C: Google Classroom
1. Upload `Lesson_06_Quiz_Graded.html` as a Material in Google Classroom
2. Students download and open it in their browser
3. OR host it online and share the link in Google Classroom

---

## Troubleshooting

### Problem: "Sign in with Google" button doesn't appear
**Solution:**
- Make sure you've added the Google Client ID to the HTML file
- Check browser console for errors (F12 → Console tab)
- Ensure JavaScript origins are configured correctly in Google Cloud Console

### Problem: Quiz submits but data doesn't appear in Google Sheet
**Solution:**
- Check that the Google Script URL in the HTML file is correct
- Make sure the Apps Script deployment is set to "Anyone" access
- Look at the Apps Script execution logs (Apps Script editor → Executions)

### Problem: Students get "Authorization required" error
**Solution:**
- The Apps Script must be deployed with "Execute as: Me" and "Who has access: Anyone"
- You may need to authorize the script the first time (it will prompt you)

### Problem: Can't sign in with school Google accounts
**Solution:**
- If using Google Workspace (school domain), make sure OAuth consent screen is set to "Internal"
- Check with your school IT - they may need to approve the app

---

## Understanding the Data

### Google Sheet Columns:
- **Timestamp:** When the quiz was submitted
- **Email:** Student's Google email (verified, cannot be faked)
- **Name:** Student's name from their Google account
- **Score:** Number of correct answers (out of 20)
- **Percentage:** Score as a percentage
- **Attempt #:** Which attempt this is (1 or 2)
- **Q1-Q20:** Individual question results (1 = correct, 0 = incorrect)

### Color Coding:
- **Green background:** Correct answer or high score (90%+)
- **Yellow background:** Good score (80-89%)
- **Light orange background:** Satisfactory (70-79%)
- **Red background:** Incorrect answer or low score (<70%)

### Exporting to Google Classroom:
1. In the Google Sheet, select the data you want to export
2. Go to **File** → **Download** → **Comma-separated values (.csv)**
3. Import the CSV into Google Classroom gradebook

---

## Security Notes

### Why "Anyone" access is safe:
- The Apps Script only accepts POST requests with specific data format
- Students can only submit their quiz results, not read or modify other data
- The Google Sheet itself is only accessible to you (the owner)
- Student authentication via Google Sign-In prevents impersonation

### Student Privacy:
- Only you (the teacher) can see the Google Sheet with results
- Students see their own scores and feedback after submission
- Email addresses are used for verification only

---

## Support

If you encounter issues during setup:
1. Check the browser console for errors (F12 → Console)
2. Check Apps Script execution logs (Apps Script editor → Executions)
3. Verify all URLs and IDs are copied correctly
4. Make sure the Google Sheet is not accidentally deleted or moved

---

## Summary

Once set up, here's what happens:
1. ✅ Student opens `Lesson_06_Quiz_Graded.html`
2. ✅ Student signs in with Google (verifies identity)
3. ✅ Student takes quiz with shuffled answers (prevents cheating)
4. ✅ Student submits quiz
5. ✅ Results automatically saved to your Google Sheet
6. ✅ Student sees score and feedback immediately
7. ✅ Student can retake once if needed (tracked in Google Sheet)

You'll have a complete, color-coded gradebook in Google Sheets with verified student identities!
