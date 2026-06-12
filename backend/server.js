/**
 * Backend Proxy Server for Claude API
 *
 * Purpose: Securely proxy Claude API requests from the client
 * Security: API keys are stored on the server (environment variables)
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... PORT=3001 node backend/server.js
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.ANTHROPIC_API_KEY;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ========================================
// Health Check Endpoint
// ========================================
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ========================================
// Claude API Proxy Endpoint
// ========================================
app.post('/api/claude', async (req, res) => {
    try {
        // Validate API key is configured
        if (!API_KEY) {
            console.error('ERROR: ANTHROPIC_API_KEY not set in environment variables');
            return res.status(500).json({
                status: 'error',
                error: 'Server not properly configured. API key is missing.'
            });
        }

        // Validate request body
        const { prompt, model = 'claude-opus-4-8', max_tokens = 2048 } = req.body;

        if (!prompt) {
            return res.status(400).json({
                status: 'error',
                error: 'Missing required parameter: prompt'
            });
        }

        console.log(`📤 Calling Claude API (model: ${model})`);
        console.log(`📝 Prompt length: ${prompt.length} characters`);

        // Call Anthropic Claude API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: model,
                max_tokens: max_tokens,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        // Handle API errors
        if (!response.ok) {
            const errorData = await response.json();
            console.error(`❌ Claude API error: ${response.status}`);
            console.error(JSON.stringify(errorData, null, 2));

            return res.status(response.status).json({
                status: 'error',
                error: errorData.error?.message || 'Claude API error',
                details: errorData
            });
        }

        // Parse successful response
        const data = await response.json();
        console.log(`✅ Claude API response received (${data.content[0].text.length} chars)`);

        // Return Claude's response to client
        res.json({
            status: 'success',
            text: data.content[0].text,
            model: data.model,
            usage: {
                input_tokens: data.usage.input_tokens,
                output_tokens: data.usage.output_tokens
            }
        });

    } catch (error) {
        console.error('❌ Server error:', error.message);
        res.status(500).json({
            status: 'error',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// ========================================
// Serve Static Files (Optional)
// ========================================
app.use(express.static(path.join(__dirname, '..'), {
    extensions: ['html', 'js', 'css']
}));

// ========================================
// 404 Handler
// ========================================
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        error: `Endpoint not found: ${req.method} ${req.path}`
    });
});

// ========================================
// Error Handler
// ========================================
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        status: 'error',
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ========================================
// Start Server
// ========================================
app.listen(PORT, () => {
    console.log('\n═══════════════════════════════════════════');
    console.log('🚀 Backend Proxy Server Started');
    console.log('═══════════════════════════════════════════');
    console.log(`📌 Server running on http://localhost:${PORT}`);
    console.log(`📝 Health check: http://localhost:${PORT}/health`);
    console.log(`🤖 Claude proxy: POST http://localhost:${PORT}/api/claude`);
    console.log('═══════════════════════════════════════════\n');

    // Warn if API key is not set
    if (!API_KEY) {
        console.warn('⚠️  WARNING: ANTHROPIC_API_KEY is not set!');
        console.warn('   Please set the environment variable:');
        console.warn('   export ANTHROPIC_API_KEY=sk-ant-...');
        console.warn('   Or create a .env file with: ANTHROPIC_API_KEY=sk-ant-...\n');
    } else {
        console.log('✅ API key is configured and ready to use.\n');
    }
});
