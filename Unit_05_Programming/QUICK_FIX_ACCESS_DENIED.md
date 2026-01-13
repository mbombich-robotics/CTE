# Quick Fix: "Access Denied" Error

## Most Likely Cause
You're opening the HTML file directly (`file://`) instead of through a web server, OR your OAuth Client ID isn't configured correctly.

## Fastest Solution

### Step 1: Start a Web Server
Open Command Prompt in the `Unit_05_Programming` folder and run:

```bash
python -m http.server 8080
```

### Step 2: Open in Browser
Visit: `http://localhost:8080/Lesson_06_Quiz_Graded.html`

### Step 3: Configure OAuth (if still failing)

1. Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)
2. Find your OAuth Client ID
3. Click the edit icon (pencil)
4. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:8080
   http://localhost
   http://127.0.0.1
   ```
5. Click **Save**
6. Wait 2-5 minutes for changes to take effect
7. Try signing in again

## Still Not Working?

### Option A: Create New OAuth Client ID
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Type: **Web application**
4. Name: `Quiz Test`
5. Authorized JavaScript origins:
   - `http://localhost`
   - `http://localhost:8080`
6. Click **Create**
7. Copy the Client ID
8. Update line 641 in `Lesson_06_Quiz_Graded.html`:
   ```javascript
   const GOOGLE_CLIENT_ID = 'PASTE_NEW_CLIENT_ID_HERE';
   ```
9. Refresh the page and try again

### Option B: Check OAuth Consent Screen
1. Go to [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)
2. Make sure:
   - User Type is **External**
   - Publishing status is **Testing** or **In Production**
3. If in Testing mode, add your email as a test user:
   - Scroll to **Test users**
   - Click **+ ADD USERS**
   - Add your email

## Testing Checklist
- [ ] Using `http://localhost:8080/...` not `file://...`
- [ ] OAuth Client ID configured with authorized origins
- [ ] Waited 2-5 minutes after OAuth changes
- [ ] Tested in an incognito/private browser window
- [ ] Cleared browser cache and cookies

## Still Stuck?
See the full troubleshooting guide: `TROUBLESHOOTING_SIGNIN.md`
