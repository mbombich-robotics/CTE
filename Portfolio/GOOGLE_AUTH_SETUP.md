# Google Authentication Setup Guide

## Overview

The portfolio system now uses Google Sign-In for authentication. Students sign in with their school Google account, and all their work is automatically saved to the cloud.

## Benefits

- **Access from any device** - Students can work from any computer
- **Auto-save** - Drafts are automatically saved every 30 seconds
- **Persistent storage** - Work is never lost
- **Single sign-on** - Uses school Google accounts
- **Teacher oversight** - All data visible in your Google Sheet

---

## Setup Instructions for Teachers

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Select a project" → "New Project"
3. Name it "Robotics Portfolio" → Create
4. Wait for project creation (you'll see a notification)

### Step 2: Enable Google Sign-In

1. In your project, go to "APIs & Services" → "Enabled APIs & services"
2. Click "+ ENABLE APIS AND SERVICES"
3. Search for "Google Drive API" → Enable
4. Search for "Google Sheets API" → Enable

### Step 3: Create OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "Internal" (for school domain) → Create
3. Fill in:
   - **App name**: Robotics Portfolio
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Click "Save and Continue"
5. Skip "Scopes" (click Save and Continue)
6. Skip "Test users" (click Save and Continue)

### Step 4: Create OAuth Client ID

1. Go to "APIs & Services" → "Credentials"
2. Click "+ CREATE CREDENTIALS" → "OAuth client ID"
3. Application type: "Web application"
4. Name: "Robotics Portfolio Web"
5. Authorized JavaScript origins:
   - `http://localhost:8000` (for local testing)
   - Your GitHub Pages URL (e.g., `https://yourusername.github.io`)
6. Authorized redirect URIs:
   - `http://localhost:8000` (for local testing)
   - Your GitHub Pages URL (e.g., `https://yourusername.github.io/robotics-portfolio`)
7. Click "Create"
8. **SAVE YOUR CLIENT ID** - you'll need this!

### Step 5: Configure the Portfolio System

1. Open `index.html` in a text editor
2. Find this line near the top:
   ```html
   <meta name="google-signin-client_id" content="YOUR_CLIENT_ID_HERE">
   ```
3. Replace `YOUR_CLIENT_ID_HERE` with your actual Client ID
4. Save the file

### Step 6: Set Up Google Sheets Backend

1. Create a new Google Sheet (same as before)
2. Extensions → Apps Script
3. Paste the `google-apps-script-auth.js` code
4. Deploy as Web App
5. Copy the Web App URL
6. Open `app.js` and update `SHEETS_API_URL`

### Step 7: Deploy the Portfolio

**Option A: GitHub Pages (Recommended)**
1. Push your files to GitHub
2. Enable GitHub Pages in repository settings
3. Students access via your GitHub Pages URL

**Option B: School Server**
1. Upload files to your school's web server
2. Make sure HTTPS is enabled (required for Google Sign-In)

---

## Student Experience

### First Time

1. Student goes to portfolio URL
2. Clicks "Sign in with Google"
3. Selects their school Google account
4. Grants permissions (one time)
5. Creates their portfolio profile
6. Starts working

### Returning Student

1. Student goes to portfolio URL
2. Clicks "Sign in with Google"
3. Selects their account
4. **All previous work automatically loads**
5. Can continue where they left off

### Auto-Save

- Drafts automatically save every 30 seconds
- No "save" button needed
- Green indicator shows "Saved" status
- Works even if they close the browser

---

## Privacy & Security

### What Data Is Stored

- Student name and email
- Weekly reflections (drafts and submitted)
- Deliverables (drafts and submitted)
- Evidence photos (as data URLs or links)
- Code snippets

### Where It's Stored

- **Google Sheets** - In your Google Drive
- **Browser cache** - Temporary copy for faster loading

### Who Can Access

- **Students** - Only their own data
- **Teacher** - All student data (via Google Sheet)
- **No one else** - Data is private to your Google account

### Permissions Required

Students grant these permissions:
- **See their email address** - Used as unique identifier
- **See their basic profile** - Name and photo
- **No access to Drive or other data** - Portfolio doesn't access anything else

---

## Troubleshooting

### "Unauthorized" Error

**Cause**: OAuth Client ID not configured correctly
**Fix**:
1. Check that your domain is in "Authorized JavaScript origins"
2. Make sure you're using HTTPS (not HTTP)
3. Try incognito mode to clear cache

### "Access Denied" Error

**Cause**: OAuth consent screen not set to "Internal"
**Fix**:
1. Go to OAuth consent screen in Google Cloud
2. Change to "Internal"
3. This restricts to your school domain

### Student Can't Sign In

**Cause**: They're using personal Google account
**Fix**: Make sure they select their school Google account (@yourschool.edu)

### Data Not Saving

**Cause**: Google Sheets API URL not configured
**Fix**:
1. Check `SHEETS_API_URL` in `app.js`
2. Make sure Apps Script is deployed as Web App
3. Check Apps Script execution log for errors

### "Sign In with Google" Button Not Appearing

**Cause**: Google Sign-In library not loading
**Fix**:
1. Check browser console for errors
2. Make sure you're accessing via HTTP/HTTPS (not file://)
3. Check that Client ID is correct in HTML

---

## Testing

Before rolling out to students:

1. **Test Sign-In**: Try signing in with your school account
2. **Test Save**: Create a reflection, close browser, reopen - should load
3. **Test Multi-Device**: Sign in from different computer - data should be there
4. **Test Submission**: Submit work, check Google Sheet - should appear
5. **Test Auto-Save**: Make changes, wait 30 seconds, refresh - should persist

---

## Maintenance

### Monitoring Usage

1. Open your Google Sheet
2. Check "Activity Log" tab for all student activity
3. Use "Summary Report" for class overview

### Backup

Your Google Sheet is automatically backed up by Google Drive. For extra safety:
1. File → Make a copy (monthly)
2. Store in a "Backups" folder

### Student Support

Common student questions:
- **"I can't access my work!"** → Make sure using school account
- **"My work disappeared!"** → Check if signed in with correct account
- **"Can I work at home?"** → Yes, just sign in with school account
- **"Do I need to save?"** → No, auto-saves every 30 seconds

---

## Rollout Checklist

- [ ] Google Cloud project created
- [ ] OAuth configured with school domain
- [ ] Client ID added to index.html
- [ ] Google Sheet created with Apps Script
- [ ] Portfolio deployed (GitHub Pages or school server)
- [ ] Tested with your own account
- [ ] Tested from multiple devices
- [ ] Student instructions prepared
- [ ] URL shared with students

---

## For Students: Quick Start

**Step 1**: Go to the portfolio URL your teacher provides

**Step 2**: Click "Sign in with Google"

**Step 3**: Choose your **school Google account** (@yourschool.edu)

**Step 4**: Click "Allow" when asked for permissions

**Step 5**: Fill in your name and class information

**Step 6**: Start documenting your work!

**Remember**: Your work auto-saves. You can access it from any computer by signing in.

---

## Support Resources

- **Google Cloud Console**: https://console.cloud.google.com
- **Google Sheets API**: https://developers.google.com/sheets/api
- **OAuth 2.0 Setup**: https://developers.google.com/identity/protocols/oauth2

For technical issues, check:
1. Browser console (F12) for JavaScript errors
2. Google Apps Script execution log
3. Google Cloud Console quota limits
