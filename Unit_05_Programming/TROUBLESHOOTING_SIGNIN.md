# Troubleshooting "Access Denied" Error - Google Sign-In

## Common Causes

The "Access Denied" error when signing in is almost always related to Google OAuth Client ID configuration.

## Solution 1: Configure Authorized Domains (Most Common Fix)

### Step 1: Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. In the left menu, go to **APIs & Services > Credentials**

### Step 2: Find Your OAuth 2.0 Client ID
1. Look for your Client ID in the list (starts with a number like `351912540436-...`)
2. Click the edit icon (pencil) next to it

### Step 3: Configure Authorized JavaScript Origins
Add these origins:
- `http://localhost`
- `http://127.0.0.1`
- `file://` (if testing locally)
- Your actual domain if hosted online (e.g., `https://yourdomain.com`)

### Step 4: Configure Authorized Redirect URIs
Add these URIs:
- `http://localhost`
- `http://127.0.0.1`
- Your actual domain if hosted online

### Step 5: Save Changes
Click **Save** at the bottom

## Solution 2: Use a Simpler Approach - Remove Restricted Domains

### Option A: Create a New OAuth Client ID (Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services > Credentials**
3. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
4. Application type: **Web application**
5. Name: `Unit 5 Quiz - Web Client`
6. **Authorized JavaScript origins**: Add:
   - `http://localhost:8080`
   - `http://localhost`
   - `file://`
7. **Authorized redirect URIs**: Leave empty for now
8. Click **Create**
9. Copy the new Client ID
10. Replace the `GOOGLE_CLIENT_ID` in your HTML file (line 641)

### Option B: Simplify the Current Client

1. Edit your existing OAuth Client
2. Under **Authorized JavaScript origins**, add ALL of these:
   ```
   http://localhost
   http://localhost:8080
   http://localhost:3000
   http://127.0.0.1
   file://
   ```
3. Save and wait 5-10 minutes for changes to propagate

## Solution 3: Test Locally with a Web Server

The issue might be that you're opening the HTML file directly (`file://` protocol). Some browsers block OAuth on `file://` URLs.

### Start a Simple Web Server:

**Option A: Using Python (if installed)**
```bash
# Python 3
cd Unit_05_Programming
python -m http.server 8080

# Then open: http://localhost:8080/Lesson_06_Quiz_Graded.html
```

**Option B: Using Node.js (if installed)**
```bash
npx http-server Unit_05_Programming -p 8080

# Then open: http://localhost:8080/Lesson_06_Quiz_Graded.html
```

**Option C: Using VS Code Live Server Extension**
1. Install "Live Server" extension in VS Code
2. Right-click the HTML file
3. Select "Open with Live Server"

## Solution 4: Check OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services > OAuth consent screen**
3. Check the configuration:
   - **User Type**: Should be "External" (allows anyone to sign in)
   - **Application name**: Set a name
   - **Authorized domains**: Add your domain (leave empty if testing locally)
4. Add test users if your app is in "Testing" mode:
   - Scroll to **Test users**
   - Add your email and any student emails you want to test with

## Solution 5: Enable Google+ API (Legacy, rarely needed)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services > Library**
3. Search for "Google+ API"
4. Click **Enable** if it's not already enabled

## Quick Test

To verify your OAuth Client ID is working, try this minimal test HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <title>OAuth Test</title>
    <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>
<body>
    <h1>Google Sign-In Test</h1>
    <div id="g_id_onload"
         data-client_id="YOUR_CLIENT_ID_HERE"
         data-callback="handleCredentialResponse">
    </div>
    <div class="g_id_signin" data-type="standard"></div>

    <script>
        function handleCredentialResponse(response) {
            console.log("Success!");
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            alert("Signed in as: " + payload.email);
        }
    </script>
</body>
</html>
```

Replace `YOUR_CLIENT_ID_HERE` with your actual Client ID and test it.

## Still Not Working?

If none of the above solutions work:

1. **Create a completely new OAuth Client ID** following Solution 2, Option A
2. **Test with a different browser** (Chrome, Firefox, Edge)
3. **Clear browser cache and cookies**
4. **Make sure you're accessing via http:// or https://**, not file://
5. **Wait 5-10 minutes** after making OAuth configuration changes

## Error Details

Common error messages and what they mean:

- **"Access denied: [Client ID] has not been granted access"**
  → Your Client ID isn't configured for the domain you're testing on
  → Fix: Add authorized JavaScript origins

- **"redirect_uri_mismatch"**
  → The redirect URI doesn't match what's configured
  → Fix: Add correct redirect URIs in OAuth settings

- **"idpiframe_initialization_failed"**
  → Third-party cookies are blocked
  → Fix: Enable cookies in browser settings or use a web server

- **"popup_closed_by_user"**
  → User closed the popup before completing sign-in
  → Not an error - user action
