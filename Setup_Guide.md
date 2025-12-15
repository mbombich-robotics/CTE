# Arduino Lesson Portal - Setup Guide

## 🎉 What You Now Have

A complete lesson portal with:
- **Main landing page** (index.html) - Navigate to all lessons
- **4 interactive presentations** (Days 71-74)
- **Looping animations** on title screens
- **Copy buttons** on code examples
- **Scrollable slides** - no content clipping

---

## 📁 File Organization

Make sure all files are in the **same folder**:

```
Arduino_Lessons/
├── index.html                                  ← START HERE
├── Day_71_Arduino_Introduction_v2.html
├── Day_72_Variables_Serial_Monitor_v2.html
├── Day_73_Digital_Input_Control.html
├── Day_74_Analog_PWM.html
└── Day_75_Quiz_Questions.md
```

---

## 🚀 How to Use

### Option 1: Local Files (Current Setup)

1. **Download all files** to one folder on your computer
2. **Double-click `index.html`** to open in your browser
3. **Click any lesson card** to start that lesson
4. **Navigate** using arrow keys or on-screen buttons
5. **Press F11** for fullscreen mode

### Option 2: Simple Local Web Server (Better)

If links don't work properly with file:// protocol:

**Python (if installed):**
```bash
# In the folder with your files:
python -m http.server 8000

# Then open browser to:
http://localhost:8000
```

**VS Code:**
- Install "Live Server" extension
- Right-click index.html → "Open with Live Server"

---

## 🎯 Using the Portal

### Landing Page Features:

**Each lesson card shows:**
- Day number and date
- Lesson title
- Description
- Topics covered
- Duration
- Status (Ready/Not Ready)

**Click any card** to open that lesson

**Hover effects** - Cards lift and glow

### Within Lessons:

**Navigation:**
- Arrow keys (← →) or Space
- On-screen Previous/Next buttons
- Current slide number displayed

**Code Features:**
- Scrollable code blocks (if long)
- "Copy Code" buttons on complete programs
- Click to copy → Paste into Arduino IDE

**Interactive Elements:**
- Clickable simulations (buttons, sliders)
- Expandable sections
- Interactive quiz questions with feedback

---

## 📺 Presenting in Class

### Setup:
1. **Connect laptop to projector**
2. **Open index.html** in browser
3. **Press F11** for fullscreen
4. **Click the day's lesson**

### During Lesson:
- **Arrow keys** to advance slides
- **Click code** to copy when students need it
- **Scroll slides** if needed (content won't clip)
- **Use interactive demos** for engagement

### After Class:
- **Share index.html link** (if on network drive)
- **Or share individual lesson files**
- Students can review at home

---

## 🌐 Hosting Options (Future)

### If You Want to Host Online:

**Option 1: GitHub Pages (Free)**
1. Create GitHub account
2. Create repository
3. Upload all HTML files
4. Enable GitHub Pages
5. Share the URL with students

**Option 2: School Server**
- Upload all files to school web server
- Students access via school network
- No external hosting needed

**Option 3: Google Drive**
- Upload all files
- Share folder with "View" access
- Students download and open locally

---

## 🔧 Customization

### Update the Index Page:

Edit `index.html` to change:
- Lesson descriptions
- Topics covered
- Dates
- Durations
- Your name/course title

Look for sections like:
```html
<div class="lesson-number">Day 71 • Monday</div>
<h2 class="lesson-title">Arduino Introduction</h2>
<p class="lesson-description">
    Your description here
</p>
```

### Add More Lessons:

Copy a lesson card block and update:
- Day number
- Title
- Description
- Topics list
- File link
- Duration

---

## ✨ Features Summary

### Index Page:
✅ Professional tech aesthetic
✅ Hover animations
✅ Clear lesson organization
✅ Topic previews
✅ Duration indicators
✅ Status badges
✅ Responsive design (works on tablets)

### Lesson Presentations:
✅ Scrollable slides (no clipping)
✅ Scrollable code blocks (compact)
✅ Copy buttons (one-click copy)
✅ Interactive simulations
✅ Looping animations
✅ Quiz questions with feedback
✅ Keyboard navigation

---

## 🎓 Student Access

### Give Students the Folder:
1. Put all files in a shared drive
2. Students open `index.html`
3. They can navigate all lessons
4. Review at their own pace

### Or Individual Files:
- Share specific day's HTML file
- They open it directly
- Good for homework review

---

## 📱 Mobile/Tablet Use

The presentations work on tablets:
- Touch navigation (swipe or tap buttons)
- Responsive design
- Copy buttons work
- May need to scroll more

**Recommendation:** Best on laptop/desktop for classroom use

---

## 🔍 Troubleshooting

### Links Don't Work:
- Make sure all files are in same folder
- Try using a local web server (see Option 2)
- Check file names match exactly

### Animations Don't Play:
- Refresh the page
- Try a different browser (Chrome recommended)
- Check browser allows JavaScript

### Code Copy Doesn't Work:
- Browser must allow clipboard access
- Try Ctrl+C if button fails
- Check browser isn't blocking scripts

### Slides Cut Off:
- This should be fixed now with scrolling
- Try different zoom level (100% recommended)
- Scroll the slide content

---

## 💡 Tips for Best Experience

1. **Use Chrome or Edge** - Best compatibility
2. **100% browser zoom** - Optimal viewing
3. **Fullscreen (F11)** - For presenting
4. **Same folder** - Keep all files together
5. **No special characters** - in folder names

---

## 🎉 You're Ready!

**To Start Teaching:**
1. Open `index.html`
2. Click Day 71
3. Press F11 for fullscreen
4. Use arrow keys to navigate
5. Engage students with interactive elements!

**Everything is self-contained** - no internet required once files are downloaded!
