const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Route for main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        githubApiTokenConfigured: !!process.env.GITHUB_API_TOKEN
    });
});

app.get('/api/github/user/:username', async (req, res) => {
    try {
        const response = await fetch(`https://api.github.com/users/${req.params.username}`, {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch GitHub user data', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 GitHub Profile Viewer running on port ${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} to view`);
});