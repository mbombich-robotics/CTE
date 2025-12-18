# Quiz System Quick Reference

## Files Created

### For Students:
- **`Lesson_06_Quiz.html`** - Practice quiz (unlimited attempts, no submission)
- **`Lesson_06_Quiz_Graded.html`** - Graded quiz (requires Google sign-in, 2 attempts max)

### For You (Teacher):
- **`GoogleAppsScript_QuizSubmission.js`** - Backend code for Google Sheets
- **`QUIZ_SETUP_INSTRUCTIONS.md`** - Complete setup guide (read this!)
- **`QUIZ_QUICK_REFERENCE.md`** - This file

---

## Quick Setup Checklist

- [ ] Create Google Sheet for results
- [ ] Add Apps Script code to sheet
- [ ] Deploy Apps Script as Web App
- [ ] Copy Web App URL into `Lesson_06_Quiz_Graded.html`
- [ ] Create Google Cloud Project
- [ ] Enable Google Identity Services API
- [ ] Configure OAuth consent screen
- [ ] Create OAuth Client ID
- [ ] Copy Client ID into `Lesson_06_Quiz_Graded.html`
- [ ] Test with your own Google account
- [ ] Share quiz file/link with students

---

## Key Features

### Practice Quiz (Lesson_06_Quiz.html)
- ✅ No sign-in required
- ✅ Unlimited attempts
- ✅ Instant feedback with explanations
- ✅ No data submission
- ✅ Use for studying before the graded quiz

### Graded Quiz (Lesson_06_Quiz_Graded.html)
- ✅ Google Sign-In required (verifies identity via email)
- ✅ 2 attempts maximum per student
- ✅ Shuffled answer options (different for each student)
- ✅ Instant feedback with explanations
- ✅ Auto-submits to Google Sheets
- ✅ Records: Email, Name, Score, Timestamp, Individual answers

---

## Student Experience

### Taking the Practice Quiz:
1. Open `Lesson_06_Quiz.html` in browser
2. Answer 20 questions
3. Click "Submit Quiz"
4. See score and review incorrect answers
5. Click "Retake Quiz" to try again (unlimited)

### Taking the Graded Quiz:
1. Open `Lesson_06_Quiz_Graded.html` in browser
2. Click "Sign in with Google"
3. Sign in with school Google account
4. Answer 20 questions (shuffled options)
5. Click "Submit Quiz"
6. See score and review incorrect answers
7. Can retake ONCE if desired (attempt #2)

---

## Teacher Dashboard (Google Sheet)

### What You'll See:
| Timestamp | Email | Name | Score | % | Attempt | Q1 | Q2 | ... | Q20 |
|-----------|-------|------|-------|---|---------|----|----|-----|-----|
| 1/15/25 2:30 PM | john@school.edu | John Doe | 18 | 90% | 1 | 1 | 1 | ... | 0 |

### Color Coding:
- **Green cells** = Correct (or 90%+ score)
- **Yellow cells** = 80-89% score
- **Orange cells** = 70-79% score
- **Red cells** = Incorrect (or <70% score)

### Data Columns:
- **Timestamp:** When submitted
- **Email:** Student's verified Google email (cannot be faked)
- **Name:** Student's name from Google account
- **Score:** Correct answers out of 20
- **Percentage:** Score as %
- **Attempt #:** 1 or 2
- **Q1-Q20:** Individual answers (1=correct, 0=incorrect)

---

## Common Student Questions

**Q: Can I practice before taking the graded quiz?**
A: Yes! Use `Lesson_06_Quiz.html` (practice version) as many times as you want.

**Q: What if I fail the graded quiz?**
A: You get ONE retake. Use it wisely! Practice first.

**Q: Are the questions the same on the practice and graded quiz?**
A: Yes, same questions, but the answer options are shuffled on the graded version.

**Q: Why do I need to sign in with Google?**
A: To verify your identity and prevent cheating.

**Q: Can I change my answers after submitting?**
A: No, but you can retake the quiz once (your second attempt will be recorded).

**Q: Will the teacher see which questions I got wrong?**
A: Yes, the teacher can see your individual question results in the Google Sheet.

---

## Updating Questions

If you need to modify quiz questions in the future:

### Practice Quiz:
1. Edit `Lesson_06_Quiz.html`
2. Find the `answerKey` object in the JavaScript
3. Update question text, options, correct answer, or explanation
4. Save the file

### Graded Quiz:
1. Edit `Lesson_06_Quiz_Graded.html`
2. Find the `questionData` object in the JavaScript
3. Update question text, options array, correct index, or explanation
4. Save the file

**Note:** Keep the same number of questions (20) for the Google Sheet to work correctly.

---

## Security Features

### Prevents Cheating:
- ✅ Google Sign-In verifies student identity via email
- ✅ Answer options are shuffled differently for each student
- ✅ Attempt tracking prevents unlimited retakes
- ✅ Timestamp shows when quiz was taken

### Privacy:
- ✅ Only teacher can access Google Sheet with results
- ✅ Students only see their own scores
- ✅ Email addresses used for verification only

---

## Troubleshooting Quick Fixes

### "Sign in with Google" button doesn't work
→ Check that GOOGLE_CLIENT_ID is set correctly in the HTML file

### Results don't appear in Google Sheet
→ Check that GOOGLE_SCRIPT_URL is set correctly in the HTML file
→ Verify Apps Script is deployed with "Anyone" access

### Students can't sign in
→ Check OAuth consent screen settings
→ If school Google Workspace, set to "Internal" type

### "Retake Quiz" button is disabled after first attempt
→ This is correct! Students get exactly 2 attempts (tracked in localStorage)

---

## Tips for Classroom Use

### Before Quiz Day:
1. Tell students to practice with `Lesson_06_Quiz.html` first
2. Remind them they only get 2 attempts on the graded quiz
3. Test the graded quiz yourself to make sure it's working

### During Quiz Day:
1. Share the `Lesson_06_Quiz_Graded.html` file or link
2. Have students sign in and take the quiz
3. Monitor the Google Sheet in real-time to see submissions

### After Quiz Day:
1. Review the Google Sheet for patterns (which questions were hardest?)
2. Export data to CSV for gradebook import
3. Use wrong-answer data to guide review sessions

---

## Exporting Grades

### To CSV:
1. Open Google Sheet
2. **File** → **Download** → **Comma-separated values (.csv)**
3. Open in Excel or import to gradebook

### To Google Classroom:
1. In Google Sheet, select Name, Email, and Score columns
2. Copy the data
3. Paste into Google Classroom gradebook

---

## Version History

### Version 1.0 (Current)
- Practice quiz with unlimited attempts
- Graded quiz with Google Sign-In authentication
- Google Sheets integration
- Shuffled answer options
- 2 attempts maximum
- Instant feedback with explanations
- Color-coded gradebook

---

## Support

If you run into issues:
1. Read the full setup instructions in `QUIZ_SETUP_INSTRUCTIONS.md`
2. Check browser console for JavaScript errors (F12 → Console)
3. Verify all URLs and IDs are correctly set in the HTML files
4. Test with a different browser or incognito mode
