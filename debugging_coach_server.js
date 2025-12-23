/**
 * AI Debugging Coach Backend Server
 *
 * This is a simple Express server that handles Claude API calls
 * for the debugging coach frontend.
 *
 * Setup:
 * 1. Install Node.js from https://nodejs.org
 * 2. Run: npm install express cors @anthropic-ai/sdk
 * 3. Set environment variable: ANTHROPIC_API_KEY=your_key_here
 * 4. Run: node debugging_coach_server.js
 * 5. Open debugging_coach.html in your browser
 */

const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

// System prompt for the debugging coach
const SYSTEM_PROMPT = `You are an expert debugging coach for high school computer science students. Your goal is to help students learn to debug their own code through guided questions, NOT by giving them the solution directly.

## Your Teaching Philosophy:
- Use the Socratic method: Ask questions that lead students to discover the bug themselves
- Be encouraging and patient
- Celebrate their thinking, even if they're wrong
- Guide them through systematic debugging techniques
- Only give hints if they're really stuck after multiple attempts
- When they fix the bug, explain what they learned

## Debugging Process You Should Guide:
1. **Understand the Error**: "What error are you seeing? What line is it on?"
2. **Identify Expected vs Actual**: "What did you expect to happen? What actually happened?"
3. **Trace Execution**: "Let's trace through the code. What happens at line X?"
4. **Check Assumptions**: "What values do the variables have at that point?"
5. **Test Hypothesis**: "Try adding a print statement here. What does it show?"
6. **Fix and Verify**: "Now that you've fixed it, test it with different inputs"

## Key Rules:
- NEVER write the corrected code for them
- DO ask them to predict what values variables will have
- DO suggest debugging techniques (print statements, breakpoints, etc.)
- DO encourage experimentation
- DO relate errors to concepts they should know
- DO celebrate when they figure it out themselves

## Response Style:
- Use encouraging language
- Ask ONE question at a time
- Use code formatting with backticks for code references
- Use bullet points for multiple steps
- Keep responses concise (2-4 sentences usually)

Remember: Your job is to teach debugging skills, not to be a code-fixing service!`;

// POST /api/debug - Handle debugging conversations
app.post('/api/debug', async (req, res) => {
    try {
        const { action, code, error, language, message, history } = req.body;

        let conversationHistory = history || [];

        if (action === 'start') {
            // Starting a new debugging session
            const initialMessage = {
                role: 'user',
                content: `I need help debugging this ${language} code:

\`\`\`${language}
${code}
\`\`\`

${error ? `Error message:\n${error}` : 'The code isn\'t working as expected, but no error message.'}

Can you help me figure out what's wrong?`
            };

            conversationHistory.push(initialMessage);

            // Get Claude's response
            const response = await anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1024,
                system: SYSTEM_PROMPT,
                messages: conversationHistory
            });

            const assistantMessage = {
                role: 'assistant',
                content: response.content[0].text
            };

            conversationHistory.push(assistantMessage);

            res.json({
                message: response.content[0].text,
                history: conversationHistory
            });

        } else if (action === 'continue') {
            // Continue existing conversation
            conversationHistory.push({
                role: 'user',
                content: message
            });

            // Get Claude's response
            const response = await anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1024,
                system: SYSTEM_PROMPT,
                messages: conversationHistory
            });

            const assistantMessage = {
                role: 'assistant',
                content: response.content[0].text
            };

            conversationHistory.push(assistantMessage);

            res.json({
                message: response.content[0].text,
                history: conversationHistory
            });

        } else {
            res.status(400).json({ error: 'Invalid action' });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Server error',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Debugging Coach server is running',
        hasApiKey: !!process.env.ANTHROPIC_API_KEY
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║        🐛 AI DEBUGGING COACH SERVER                        ║
║                                                            ║
║  Server running on: http://localhost:${PORT}                ║
║                                                            ║
║  API Key Status: ${process.env.ANTHROPIC_API_KEY ? '✅ Configured' : '❌ Missing'}                    ║
║                                                            ║
║  To test: http://localhost:${PORT}/health                    ║
║                                                            ║
${!process.env.ANTHROPIC_API_KEY ? '║  ⚠️  Set ANTHROPIC_API_KEY environment variable!          ║\n║                                                            ║' : ''}
║  Open debugging_coach.html in your browser to start!      ║
╚════════════════════════════════════════════════════════════╝
    `);
});
