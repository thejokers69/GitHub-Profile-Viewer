const request = require('supertest');
const express = require('express');
const path = require('path');
const nock = require('nock');

// Mock the fetch function for API tests
jest.mock('node-fetch');

describe('Express Server', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.static(path.join(__dirname, '..')));
    app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'index.html')));
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        githubApiTokenConfigured: !!process.env.GITHUB_API_TOKEN 
      });
    });
    app.get('/api/github/:username', async (req, res) => {
      try {
        const fetch = require('node-fetch');
        const response = await fetch(`https://api.github.com/users/${req.params.username}`, {
          headers: process.env.GITHUB_API_TOKEN ? { Authorization: `token ${process.env.GITHUB_API_TOKEN}` } : {}
        });
        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
        const data = await response.json();
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  });

  test('GET / serves index.html', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('GitHub Profile Viewer');
  });

  test('GET /health returns status OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'OK',
      timestamp: new Date().toISOString(),
      githubApiTokenConfigured: !!process.env.GITHUB_API_TOKEN
    });
  });

  test('GET /api/github/:username returns user data', async () => {
    const fetch = require('node-fetch');
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ login: 'testuser', name: 'Test User' })
    });

    const response = await request(app).get('/api/github/testuser');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ login: 'testuser', name: 'Test User' });
  });

  test('GET /api/github/:username handles API errors', async () => {
    const fetch = require('node-fetch');
    fetch.mockResolvedValue({
      ok: false,
      status: 404
    });

    const response = await request(app).get('/api/github/invaliduser');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'GitHub API error: 404' });
  });
});
