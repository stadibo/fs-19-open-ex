describe('Bloglist app ', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Jesper',
      username: 'tester',
      password: 'tester'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('user can log in', function() {
    cy.contains('Log in')
    cy.get('#username')
      .type('tester')
    cy.get('#password')
      .type('tester')
    cy.contains('Login')
      .click()
    cy.contains('Jesper logged in')
  })

  describe('when logged in and blogs exist', function() {
    beforeEach(function() {
      cy.contains('Log in')
      cy.get('#username')
        .type('tester')
      cy.get('#password')
        .type('tester')
      cy.contains('Login')
        .click()
    })

    it('the name of the logged in user is shown', function() {
      cy.contains('Jesper logged in')
    })

    it('initially displays blogs page', function() {
      cy.contains('Blogs')
    })

    it('can view single blog', function() {
      cy.contains('React patterns - Michael Chan')
        .click()
      cy.contains('https://reactpatterns.com/')
    })

    it('a new blog can be created', function() {
      cy.server()
      cy.route('POST','/api/blogs').as('createBlog')

      cy.get('section a')
        .its('length')
        .should('be.eq', 2)

      cy.contains('New blog')
      cy.get('#blog-title-input')
        .type('Test Your Web App in Dark Mode')
      cy.get('#blog-author-input')
        .type('Gleb Bahmutov')
      cy.get('#blog-url-input')
        .type('https://www.cypress.io/blog/2019/12/13/test-your-web-app-in-dark-mode/')
      cy.contains('Create')
        .click()

      cy.wait('@createBlog')
      cy.get('section a')
        .its('length')
        .should('be.eq', 3)
    })
  })
})