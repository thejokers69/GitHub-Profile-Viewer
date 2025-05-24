class GitHubApiService {
    async fetchUser(username) {
      const response = await fetch(`http://localhost:3000/api/github/${username}`);
      if (!response.ok) throw new Error('API error');
      return response.json();
    }
  }
  
  jest.mock('node-fetch');
  
  describe('GitHubApiService', () => {
    let apiService;
  
    beforeEach(() => {
      apiService = new GitHubApiService();
    });
  
    test('fetchUser returns user data for valid username', async () => {
      const fetch = require('node-fetch');
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ login: 'testuser', name: 'Test User' })
      });
  
      const data = await apiService.fetchUser('testuser');
      expect(data).toEqual({ login: 'testuser', name: 'Test User' });
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/github/testuser');
    });
  
    test('fetchUser throws error for invalid username', async () => {
      const fetch = require('node-fetch');
      fetch.mockResolvedValue({ ok: false });
  
      await expect(apiService.fetchUser('invaliduser')).rejects.toThrow('API error');
    });
  });
