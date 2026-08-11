// ============================================================
// AER PHOTO BOOTH — Apps Script Backend  v1.0.0
// ============================================================
// One-time setup:
//   1. Create a new Apps Script project (separate from portfolio projects).
//   2. Paste this file into the editor.
//   3. Project Settings → Script Properties → add:
//        Key:   PHOTO_BOOTH_FOLDER_ID
//        Value: <ID of the Google Drive folder where photos will be saved>
//      The folder should be owned by you; the script will create
//      date-named subfolders inside it automatically.
//   4. Deploy → New deployment → Web app
//        Execute as: Me
//        Access: Anyone
//   5. Copy the deployment URL into photo-booth.html (PHOTO_BOOTH_URL constant).
// ============================================================

const PHOTO_BOOTH_VERSION = 'v1.0.0';

function doGet() {
  return ContentService
    .createTextOutput('Photo Booth Backend ' + PHOTO_BOOTH_VERSION + ' — OK')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    var data   = JSON.parse(e.postData.contents);
    var action = data.action;
    if (action === 'uploadPhoto') return jsonResponse(handleUploadPhoto(data));
    if (action === 'sendEmail')   return jsonResponse(handleSendEmail(data));
    return jsonResponse({ success: false, error: 'Unknown action: ' + action });
  } catch (err) {
    Logger.log('doPost error: ' + err);
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Upload a single photo to Drive ───────────────────────────────────────────
function handleUploadPhoto(data) {
  var name      = (data.name    || 'Unknown').replace(/[^a-zA-Z0-9 _-]/g, '');
  var subject   = (data.subject || 'Photo'  ).replace(/[^a-zA-Z0-9 _-]/g, '');
  var imageData = data.imageData; // base64, no data:… prefix
  var index     = data.index || 1;

  var folderId = PropertiesService.getScriptProperties().getProperty('PHOTO_BOOTH_FOLDER_ID');
  if (!folderId) return { success: false, error: 'PHOTO_BOOTH_FOLDER_ID not set in Script Properties.' };

  try {
    var rootFolder  = DriveApp.getFolderById(folderId);
    var dateStr     = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    var dateFolders = rootFolder.getFoldersByName(dateStr);
    var dateFolder  = dateFolders.hasNext() ? dateFolders.next() : rootFolder.createFolder(dateStr);

    var timeStr  = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'HHmmss');
    var safeName = name.replace(/ /g, '_');
    var safeSub  = subject.replace(/ /g, '_');
    var filename = safeName + '_' + safeSub + '_' + index + '_' + timeStr + '.jpg';

    var imageBytes = Utilities.base64Decode(imageData);
    var blob       = Utilities.newBlob(imageBytes, 'image/jpeg', filename);
    var file       = dateFolder.createFile(blob);
    // Share within domain only (district policy blocks public sharing)
    file.setSharing(DriveApp.Access.DOMAIN, DriveApp.Permission.VIEW);

    return { success: true, fileId: file.getId(), fileUrl: file.getUrl(), filename: filename };
  } catch (err) {
    Logger.log('uploadPhoto error: ' + err);
    return { success: false, error: err.toString() };
  }
}

// ── Send email with links to all uploaded photos ──────────────────────────────
function handleSendEmail(data) {
  var email   = data.email   || '';
  var name    = data.name    || 'Student';
  var subject = data.subject || 'Photo';
  var files   = data.files   || []; // [{filename, fileUrl}, ...]

  if (!email)        return { success: false, error: 'No email address provided.' };
  if (!files.length) return { success: false, error: 'No files to send.' };

  try {
    var dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMMM d, yyyy');

    var rows = files.map(function(f, i) {
      return '<tr style="border-bottom:1px solid #e8eaed;">' +
        '<td style="padding:8px 14px;color:#5f6368;font-size:13px;">Photo ' + (i + 1) + '</td>' +
        '<td style="padding:8px 14px;"><a href="' + f.fileUrl + '" style="color:#1a73e8;font-size:13px;">' + f.filename + '</a></td>' +
        '</tr>';
    }).join('');

    var htmlBody =
      '<div style="font-family:Arial,sans-serif;max-width:540px;color:#202124;">' +
      '<h2 style="margin-bottom:2px;">📷 Your Photo Booth Photos</h2>' +
      '<p style="color:#5f6368;margin-top:0;font-size:13px;">' + dateStr + ' &nbsp;·&nbsp; ' + subject + '</p>' +
      '<p>Hi ' + name + ',</p>' +
      '<p>Here are your photos from today\'s session. Click any link to open in Google Drive.</p>' +
      '<table style="width:100%;border-collapse:collapse;border:1px solid #e8eaed;margin-bottom:24px;">' +
      '<tr style="background:#f8f9fa;">' +
      '<th style="padding:8px 14px;text-align:left;font-size:12px;color:#5f6368;font-weight:600;">#</th>' +
      '<th style="padding:8px 14px;text-align:left;font-size:12px;color:#5f6368;font-weight:600;">FILE</th>' +
      '</tr>' + rows + '</table>' +
      '<h3 style="font-size:14px;">Adding photos to your Design Brief</h3>' +
      '<ol style="font-size:13px;line-height:2;">' +
      '<li>Click a photo link above to open it in Google Drive.</li>' +
      '<li>Click the <strong>download</strong> button (⬇) in the top-right corner.</li>' +
      '<li>Open your Design Brief &rarr; <strong>Insert &rarr; Image &rarr; Upload from computer</strong>.</li>' +
      '</ol>' +
      '<p style="font-size:11px;color:#9aa0a6;margin-top:28px;border-top:1px solid #e8eaed;padding-top:12px;">' +
      'Sent automatically by the AER Photo Booth</p>' +
      '</div>';

    MailApp.sendEmail({
      to:       email,
      subject:  'Photo Booth — ' + subject + ' (' + dateStr + ')',
      htmlBody: htmlBody
    });

    return { success: true };
  } catch (err) {
    Logger.log('sendEmail error: ' + err);
    return { success: false, error: err.toString() };
  }
}
