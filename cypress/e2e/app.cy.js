describe('GitHub Profile Viewer E2E', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000'); // Or Heroku URL
    });
  
    it('searches and displays a user profile', () => {
      cy.get('#usernameInput').type('testuser');
      cy.get('#searchBtn').click();
      cy.get('.profile-card').should('be.visible').and('contain', 'Test User');
    });
  
    it('handles invalid username', () => {
      cy.get('#usernameInput').type('invaliduser12345');
      cy.get('#searchBtn').click();
      cy.wait(1000); // Wait for 1 second
      cy.get('.error').should('be.visible').and('contain', 'User not found');
    });
  
    it('quick-load button works', () => {
      cy.get('#quickLoadBtn').click();
      cy.get('.profile-card').should('be.visible');
    });
  
    it('is responsive on mobile', () => {
      cy.viewport('iphone-x');
      cy.get('#usernameInput').should('be.visible');
      cy.get('.search-form').should('have.css', 'flex-direction', 'column');
    });
  });
