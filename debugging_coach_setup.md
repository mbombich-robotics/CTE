# 🐛 AI Debugging Coach - Setup Instructions

A Socratic-method AI assistant that teaches students to debug their own code instead of just giving answers.

## 🎯 What This Does

The debugging coach:
- **Asks guiding questions** instead of providing solutions
- **Teaches debugging methodology** (read errors, add print statements, trace execution)
- **Adapts to different languages** (Python, JavaScript, Java, C++, C#)
- **Celebrates learning** and builds confidence
- **Uses real Claude AI** through a secure backend

## 📋 Prerequisites

1. **Node.js** - Download from https://nodejs.org (LTS version)
2. **Claude API Key** - Get from https://console.anthropic.com

## 🚀 Quick Start

### Step 1: Install Dependencies

Open terminal/command prompt in the `lessons` folder and run:

```bash
npm init -y
npm install express cors @anthropic-ai/sdk
```

### Step 2: Set Your API Key

**On Windows (PowerShell):**
```powershell
$env:ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

**On Windows (Command Prompt):**
```cmd
set ANTHROPIC_API_KEY=sk-ant-your-key-here
```

**On Mac/Linux:**
```bash
export ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Step 3: Start the Server

```bash
node debugging_coach_server.js
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║        🐛 AI DEBUGGING COACH SERVER                        ║
║                                                            ║
║  Server running on: http://localhost:3000                  ║
║  API Key Status: ✅ Configured                             ║
║                                                            ║
║  Open debugging_coach.html in your browser to start!      ║
╚════════════════════════════════════════════════════════════╝
```

### Step 4: Open the Interface

Open `debugging_coach.html` in your web browser (double-click the file or drag it into a browser).

## 💰 Cost Estimate

**Claude API Pricing:**
- Model: Claude 3.5 Sonnet
- Cost: ~$0.015 per message (input + output)
- Average debugging session: 10-15 messages = **$0.15-0.25**

**For a classroom:**
- 100 students × 50 sessions/year = 5,000 sessions
- Estimated cost: **$750-1,250 per year**
- Per student: **$7.50-12.50 per year**

Much cheaper than textbooks!

## 🎓 How to Use (For Students)

1. **Paste broken code** into the left panel
2. **Copy error message** if you have one
3. **Select programming language** from dropdown
4. **Click "Start Debugging Session"**
5. **Answer the coach's questions** - think deeply!
6. **Try the suggestions** in your actual code editor
7. **Report back** what you discovered

## 🧪 Example Session

**Student pastes:**
```python
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)

result = calculate_average([])
print(result)
```

**Error:**
```
ZeroDivisionError: division by zero
```

**Coach asks:**
> I can see the error! Before we fix it, tell me: What do you think "division by zero" means? And where in your code might that be happening?

**Student responds:**
> It's trying to divide by zero somewhere... maybe on the line with `len(numbers)`?

**Coach guides:**
> Exactly right! Now think about this: what is `len(numbers)` when you pass an empty list `[]`?

And so on... The coach NEVER just says "add an if statement to check for empty list" - it guides the student to that realization.

## 🔧 Troubleshooting

### "Connection Error" message
- Make sure the server is running (see terminal output)
- Check that server shows "API Key Status: ✅ Configured"
- Verify you're accessing http://localhost:3000

### Server won't start
- Check Node.js is installed: `node --version`
- Make sure you ran `npm install`
- Check port 3000 isn't already in use

### API Key issues
- Get key from https://console.anthropic.com/settings/keys
- Make sure you set the environment variable in the same terminal window
- Try setting it again and restarting the server

## 🎨 Customization

### Change the coaching style
Edit the `SYSTEM_PROMPT` in `debugging_coach_server.js` to adjust:
- Question difficulty
- Amount of hints given
- Tone (more/less strict)
- Focus areas (algorithms, syntax, style)

### Add more languages
Edit the dropdown in `debugging_coach.html`:
```html
<option value="rust">Rust</option>
<option value="go">Go</option>
```

### Change model
In `debugging_coach_server.js`, change:
```javascript
model: 'claude-3-5-sonnet-20241022'
```
to:
```javascript
model: 'claude-3-5-haiku-20241022'  // Cheaper, faster, less sophisticated
```

## 🔒 Security Notes

**For Development/Testing:**
- This setup is fine for local testing
- API key is only in server environment, never exposed to browser

**For Production (Real Classroom):**
- Deploy server to a secure hosting service (Heroku, Railway, Replit)
- Add authentication so only your students can use it
- Set spending limits in Anthropic Console
- Monitor usage to prevent abuse

## 📊 Monitoring Usage

Check your usage at: https://console.anthropic.com/settings/usage

Set spending limits at: https://console.anthropic.com/settings/limits

## 🎯 Next Steps

1. **Test it yourself** with a simple bug
2. **Try different languages** to see how it adapts
3. **Test edge cases** (code with no errors, very broken code)
4. **Pilot with a few students** and gather feedback
5. **Adjust the system prompt** based on what works

## 💡 Teaching Tips

**Before students use this:**
- Teach basic debugging concepts first
- Show them how to read error messages
- Explain the Socratic method approach
- Set expectations: "The coach won't give you the answer"

**Best use cases:**
- Homework help outside class hours
- When you're working with other students
- Practice for exam preparation
- Learning a new language

**Don't use for:**
- Graded assignments (without disclosure)
- First attempts - try debugging yourself first!
- Learning to read documentation

## 📝 Files Created

- `debugging_coach.html` - Student-facing interface
- `debugging_coach_server.js` - Backend API server
- `debugging_coach_setup.md` - This setup guide (you are here!)

## 🤝 Support

Questions? Check:
1. Terminal output for error messages
2. Browser console (F12) for JavaScript errors
3. http://localhost:3000/health for server status

---

Built for VHS Computer Science with ❤️
