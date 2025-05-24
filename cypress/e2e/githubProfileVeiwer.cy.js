describe('GitHub Profile Viewer E2E Tests', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.injectAxe(); // For accessibility testing
    });
  
    it('Loads the app and displays search form', () => {
      cy.get('#search-form').should('be.visible');
      cy.get('#search-input').should('be.visible');
      cy.get('#search-btn').should('have.text', 'Search Profile');
      cy.get('#quick-btn').should('have.text', 'Load Your Profile');
    });
  
    it('Searches for a valid user and displays profile', () => {
      cy.intercept('GET', 'https://api.github.com/users/*', {
        statusCode: 200,
        body: {
          login: 'testuser',
          name: 'Test User',
          avatar_url: 'https://example.com/avatar.png',
          bio: 'Developer',
          followers: 100,
          following: 50,
          public_repos: 20,
        },
      }).as('getUser');
  
      cy.get('#search-input').type('testuser');
      cy.get('#search-form').submit();
      cy.wait('@getUser');
  
      cy.get('.profile-card').should('have.class', 'show');
      cy.get('.profile-name').should('have.text', 'Test User');
      cy.get('.profile-username').should('have.text', 'testuser');
      cy.get('.profile-bio').should('have.text', 'Developer');
    });
  
    it('Handles invalid user search with error message', () => {
      cy.intercept('GET', 'https://api.github.com/users/*', {
        statusCode: 404,
      }).as('getUser');
  
      cy.get('#search-input').type('invaliduser');
      cy.get('#search-form').submit();
      cy.wait('@getUser');
  
      cy.get('.error').should('contain.text', 'User not found');
    });
  
    it('Tests accessibility of the app', () => {
      cy.checkA11y(); // Check for accessibility violations
    });
  
    it('Tests responsiveness on mobile', () => {
      cy.viewport('iphone-6');
      cy.get('#search-form').should('be.visible');
      cy.get('.search-input').type('testuser');
      cy.get('#search-form').submit();
      cy.get('.profile-card').should('be.visible');
    });
  
    it('Tests health endpoint', () => {
      cy.request('/health').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('status', 'OK');
        expect(response.body).to.have.property('timestamp');
      });
    });
  });