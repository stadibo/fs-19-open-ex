describe('Bloglist app ', function() {
  beforeEach(function() {
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

  describe('when logged in', function() {
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
  })
})