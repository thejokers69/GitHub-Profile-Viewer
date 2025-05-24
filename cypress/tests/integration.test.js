const request = require('supertest');
const express = require('express');
const path = require('path');
const { JSDOM } = require('jsdom');
const fs = require('fs');

jest.mock('node-fetch');

describe('Frontend-Backend Integration', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.static(path.join(__dirname, '..')));
    app.get('/api/github/:username', async (req, res) => {
      const fetch = require('node-fetch');
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ login: 'testuser', name: 'Test User', avatar_url: 'https://example.com/avatar.jpg' })
      });
      const response = await fetch(`https://api.github.com/users/${req.params.username}`);
      const data = await response.json();
      res.json(data);
    });
  });

  test('Search renders user profile', async () => {
    // Mock DOM
    const html = fs.readFileSync(path.join(__dirname, '..', '..', 'index.html'), 'utf8');
    const dom = new JSDOM(html, { runScripts: 'dangerously' });
    const { window } = dom;
    global.document = window.document;

    // Mock fetch in frontend
    global.fetch = require('node-fetch');
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ login: 'testuser', name: 'Test User', avatar_url: 'https://example.com/avatar.jpg' })
    });

    // Simulate search
    const searchInput = document.querySelector('#search-input');
    const searchButton = document.querySelector('#search-btn');
    searchInput.value = 'testuser';
    searchButton.click();

    // Wait for async rendering (simplified)
    await new Promise(resolve => setTimeout(resolve, 100));

    const profileCard = document.querySelector('.profile-card');
    expect(profileCard).toBeTruthy();
    expect(profileCard.textContent).toContain('Test User');
  });
});
