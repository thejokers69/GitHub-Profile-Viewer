import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();

class GitHubApiService {
  async fetchUser(username) {
    const response = await fetch(`http://localhost:3000/api/github/${username}`);
    if (!response.ok) throw new Error('API error');
    return response.json();
  }
}

describe('GitHubApiService', () => {
  let apiService;

  beforeEach(() => {
    apiService = new GitHubApiService();
    fetchMock.resetMocks();
  });

  test('fetchUser returns user data for valid username', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ login: 'testuser', name: 'Test User' }));

    const data = await apiService.fetchUser('testuser');
    expect(data).toEqual({ login: 'testuser', name: 'Test User' });
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/github/testuser');
  });

  test('fetchUser throws error for invalid username', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 404 });

    await expect(apiService.fetchUser('invaliduser')).rejects.toThrow('API error');
  });
});
