// script.js

// =====================================
// SOLID PRINCIPLES IMPLEMENTATION
// =====================================

// S - Single Responsibility Principle
// Each class has one reason to change

/**
 * GitHubUser - Model class representing a GitHub user
 * Responsibility: Data structure and basic data operations
 */
class GitHubUser {
  constructor(userData) {
    this.login = userData.login;
    this.name = userData.name;
    this.bio = userData.bio;
    this.avatar_url = userData.avatar_url;
    this.location = userData.location;
    this.company = userData.company;
    this.blog = userData.blog;
    this.twitter_username = userData.twitter_username;
    this.email = userData.email;
    this.html_url = userData.html_url;
    this.public_repos = userData.public_repos;
    this.followers = userData.followers;
    this.following = userData.following;
    this.created_at = userData.created_at;
  }

  getDisplayName() {
    return this.name || this.login;
  }

  getFormattedJoinDate() {
    return new Date(this.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  getBlogUrl() {
    if (!this.blog) return null;
    return this.blog.startsWith("http") ? this.blog : `https://${this.blog}`;
  }

  getTwitterUrl() {
    return this.twitter_username ? `https://twitter.com/${this.twitter_username}` : null;
  }
}

/**
 * HttpClient - Handles HTTP requests
 * Responsibility: Network communication
 */
class HttpClient {
  async get(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Network request failed: ${error.message}`);
    }
  }
}

/**
 * GitHubApiService - GitHub API specific operations
 * Responsibility: GitHub API integration
 */
class GitHubApiService {
  constructor(httpClient) {
    this.httpClient = httpClient;
    this.baseUrl = "https://api.github.com/users/";
  }

  async getUserProfile(username) {
    if (!username || typeof username !== "string") {
      throw new Error("Username is required and must be a string");
    }

    const userData = await this.httpClient.get(`${this.baseUrl}${username}`);
    return new GitHubUser(userData);
  }

  async getUserRepositories(username, limit = 6) {
    const repos = await this.httpClient.get(`${this.baseUrl}${username}/repos?sort=updated&per_page=${limit}`);
    return repos;
  }
}

// O - Open/Closed Principle
// Classes are open for extension but closed for modification

/**
 * ProfileRenderer - Base class for rendering profiles
 * Can be extended for different rendering strategies
 */
class ProfileRenderer {
  render(user, container) {
    throw new Error("render method must be implemented by subclass");
  }
}

/**
 * HtmlProfileRenderer - Concrete implementation for HTML rendering
 * Responsibility: HTML generation and DOM manipulation
 */
class HtmlProfileRenderer extends ProfileRenderer {
  render(user, container) {
    const profileHtml = this.generateProfileHtml(user);
    container.innerHTML = profileHtml;

    // Trigger animation after DOM update
    setTimeout(() => {
      const card = container.querySelector(".profile-card");
      if (card) card.classList.add("show");
    }, 100);
  }

  generateProfileHtml(user) {
    return `
                <div class="profile-card">
                    ${this.generateProfileHeader(user)}
                    ${this.generateProfileDetails(user)}
                    ${this.generateProfileLinks(user)}
                </div>
            `;
  }

  generateProfileHeader(user) {
    return `
                <div class="profile-header">
                    <img src="${user.avatar_url}" alt="${user.getDisplayName()}" class="avatar">
                    <div class="profile-info">
                        <h2 class="profile-name">${user.getDisplayName()}</h2>
                        <p class="profile-username">@${user.login}</p>
                        ${user.bio ? `<p class="profile-bio">${user.bio}</p>` : ""}
                        ${user.location ? `<p style="color: #718096; margin-bottom: 10px;">📍 ${user.location}</p>` : ""}
                        ${user.company ? `<p style="color: #718096; margin-bottom: 10px;">🏢 ${user.company}</p>` : ""}
                    </div>
                </div>
            `;
  }

  generateProfileDetails(user) {
    return `
                <div class="profile-details">
                    <div class="detail-item">
                        <span class="detail-value">${user.public_repos}</span>
                        <span class="detail-label">Repositories</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-value">${user.followers}</span>
                        <span class="detail-label">Followers</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-value">${user.following}</span>
                        <span class="detail-label">Following</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-value">${user.getFormattedJoinDate()}</span>
                        <span class="detail-label">Joined GitHub</span>
                    </div>
                </div>
            `;
  }

  generateProfileLinks(user) {
    const links = [];

    links.push(`<a href="${user.html_url}" target="_blank" class="profile-link">🔗 View on GitHub</a>`);

    const blogUrl = user.getBlogUrl();
    if (blogUrl) {
      links.push(`<a href="${blogUrl}" target="_blank" class="profile-link">🌐 Website</a>`);
    }

    const twitterUrl = user.getTwitterUrl();
    if (twitterUrl) {
      links.push(`<a href="${twitterUrl}" target="_blank" class="profile-link">🐦 Twitter</a>`);
    }

    if (user.email) {
      links.push(`<a href="mailto:${user.email}" class="profile-link">📧 Email</a>`);
    }

    return `<div class="profile-links">${links.join("")}</div>`;
  }
}

// L - Liskov Substitution Principle
// Subtypes must be substitutable for their base types

/**
 * LoadingRenderer - Alternative renderer for loading states
 */
class LoadingRenderer extends ProfileRenderer {
  render(user, container) {
    container.innerHTML = `
                <div class="profile-card">
                    <div class="loading">
                        <div class="spinner"></div>
                        Fetching profile data...
                    </div>
                </div>
            `;
  }
}

/**
 * ErrorRenderer - Alternative renderer for error states
 */
class ErrorRenderer extends ProfileRenderer {
  render(error, container) {
    container.innerHTML = `
                <div class="profile-card show">
                    <div class="error">
                        <h3>❌ Error</h3>
                        <p>${error.message || error}</p>
                    </div>
                </div>
            `;
  }
}

// I - Interface Segregation Principle
// No client should be forced to depend on methods it does not use

/**
 * EventPublisher - Simple event system
 * Responsibility: Event management
 */
class EventPublisher {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }
}

/**
 * UiController - Controls UI interactions
 * Responsibility: User interface state management
 */
class UiController {
  constructor() {
    this.searchBtn = document.getElementById("searchBtn");
  }

  setButtonLoading(isLoading) {
    this.searchBtn.disabled = isLoading;
    this.searchBtn.innerHTML = isLoading ? '<div class="spinner"></div>Loading...' : "Search Profile";
  }
}

// D - Dependency Inversion Principle
// High-level modules should not depend on low-level modules

/**
 * ProfileService - High-level business logic
 * Responsibility: Orchestrating profile operations
 */
class ProfileService {
  constructor(apiService, renderer, uiController, eventPublisher) {
    this.apiService = apiService;
    this.renderer = renderer;
    this.uiController = uiController;
    this.eventPublisher = eventPublisher;
    this.loadingRenderer = new LoadingRenderer();
    this.errorRenderer = new ErrorRenderer();
  }

  async loadProfile(username, container) {
    try {
      this.eventPublisher.emit("profileLoadStart", { username });
      this.uiController.setButtonLoading(true);
      this.loadingRenderer.render(null, container);

      const user = await this.apiService.getUserProfile(username);
      this.renderer.render(user, container);

      this.eventPublisher.emit("profileLoadSuccess", { user });
    } catch (error) {
      this.errorRenderer.render(error, container);
      this.eventPublisher.emit("profileLoadError", { error });
    } finally {
      this.uiController.setButtonLoading(false);
    }
  }
}

/**
 * Application - Main application controller
 * Responsibility: Application initialization and coordination
 */
class GitHubProfileApp {
  constructor() {
    this.initializeDependencies();
    this.initializeEventListeners();
    this.loadDefaultProfile();
  }

  initializeDependencies() {
    // Dependency injection - following Dependency Inversion Principle
    const httpClient = new HttpClient();
    const apiService = new GitHubApiService(httpClient);
    const renderer = new HtmlProfileRenderer();
    const uiController = new UiController();
    const eventPublisher = new EventPublisher();

    this.profileService = new ProfileService(apiService, renderer, uiController, eventPublisher);
    this.container = document.getElementById("profileContainer");

    // Event logging for debugging
    eventPublisher.on("profileLoadStart", (data) => {
      console.log("Profile load started:", data.username);
    });

    eventPublisher.on("profileLoadSuccess", (data) => {
      console.log("Profile loaded successfully:", data.user.login);
    });

    eventPublisher.on("profileLoadError", (data) => {
      console.error("Profile load failed:", data.error.message);
    });
  }

  initializeEventListeners() {
    const searchForm = document.getElementById("searchForm");
    const usernameInput = document.getElementById("usernameInput");
    const quickLoadBtn = document.getElementById("quickLoadBtn");

    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = usernameInput.value.trim();
      if (username) {
        this.profileService.loadProfile(username, this.container);
      }
    });

    quickLoadBtn.addEventListener("click", () => {
      this.profileService.loadProfile("thejokers69", this.container);
    });
  }

  loadDefaultProfile() {
    this.profileService.loadProfile("thejokers69", this.container);
  }
}

// Application initialization
document.addEventListener("DOMContentLoaded", () => {
  new GitHubProfileApp();
});

// Export classes for potential testing or extension
window.GitHubProfileViewer = {
  GitHubUser,
  HttpClient,
  GitHubApiService,
  HtmlProfileRenderer,
  LoadingRenderer,
  ErrorRenderer,
  ProfileService,
  GitHubProfileApp,
};
