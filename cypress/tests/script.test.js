/**
 * @file tests/script.test.js
 * @description Unit tests for script.js
 */
const { ApiService, ProfileRenderer, App } = require('../../script.js');

describe('ApiService', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockReset();
  });

  test('fetchUser returns user data for valid username', async () => {
    const mockData = { login: 'testuser', name: 'Test User', avatar_url: 'https://example.com/avatar.png' };
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const apiService = new ApiService();
    const data = await apiService.fetchUser('testuser');
    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('https://api.github.com/users/testuser');
  });

  test('fetchUser throws error for invalid username', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 404 });
    const apiService = new ApiService();
    await expect(apiService.fetchUser('invaliduser')).rejects.toThrow('User not found');
  });
});

describe('ProfileRenderer', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
  });

  test('renderProfile renders user data correctly', () => {
    const renderer = new ProfileRenderer();
    const data = { login: 'testuser', name: 'Test User', avatar_url: 'https://example.com/avatar.png', bio: 'Developer' };
    renderer.renderProfile(data, container);

    expect(container.querySelector('.profile-card')).toBeTruthy();
    expect(container.querySelector('.profile-name').textContent).toBe('Test User');
    expect(container.querySelector('.profile-username').textContent).toBe('testuser');
    expect(container.querySelector('.profile-bio').textContent).toBe('Developer');
    expect(container.querySelector('.avatar').src).toBe('https://example.com/avatar.png');
  });

  test('renderError renders error message', () => {
    const renderer = new ProfileRenderer();
    renderer.renderError('User not found', container);
    expect(container.querySelector('.error').textContent).toBe('User not found');
  });
});

describe('App', () => {
  let app, container, searchInput, searchForm;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'profile-container';
    document.body.appendChild(container);

    searchInput = document.createElement('input');
    searchInput.id = 'search-input';
    searchForm = document.createElement('form');
    searchForm.id = 'search-form';
    document.body.appendChild(searchInput);
    document.body.appendChild(searchForm);

    app = new App();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('handleSearch renders profile for valid user', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ login: 'testuser', name: 'Test User', avatar_url: 'https://example.com/avatar.png' }),
    });

    searchInput.value = 'testuser';
    await app.handleSearch();

    expect(container.querySelector('.profile-card')).toBeTruthy();
    expect(container.querySelector('.profile-name').textContent).toBe('Test User');
  });

  test('handleSearch renders error for invalid user', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 404 });
    searchInput.value = 'invaliduser';
    await app.handleSearch();

    expect(container.querySelector('.error').textContent).toBe('User not found');
  });
});