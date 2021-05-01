context('Tests related to existance of user', () => {
    var users
    beforeEach(() => {
        cy.pcVisitHomepage();
        // cy.fixture('users.json').as('users')
        cy.fixture('users.json').then((data) => {
            users = data
        })
    })

    it('New user should register and logged in successfully', () => {
        var user = users.user[3]
        user.login = user.login + Math.random() // assuming that app's DB isn't rolled back every time tests are executed
        registerUser(user)
        assertUserLoggedIn(user)
    })

    it.only('New registered user can login successfully after logout', () => {
        var user = users.user[3]
        user.login = user.login + Math.random() // assuming that app's DB isn't rolled back every time tests are executed
        registerUser(user)
        assertUserLoggedIn(user)
        cy.get('#logout').click()
        cy.login(user.login, user.password)
        assertUserLoggedIn(user)
    })

    it('User should not be able to use existing login name', () => {
        throw 'TODO: Fill the test'
    })

    function registerUser(user) {
        cy.get('#register').click()
        cy.get('#register-username-modal').type(user.login)
        cy.get('#register-first-modal').type(user.firstname)
        cy.get('#register-last-modal').type(user.lastname)
        cy.get('#register-email-modal').type(user.email)
        cy.get('#register-password-modal').type(user.password)
        cy.get('.btn').contains('Register').click()
        cy.contains('Registration and login successful.').should('exist')
    }

    function assertUserLoggedIn(user) {
        cy.get('#logout').should('exist')
        cy.contains('Logged in as').should('contain', user.firstname + ' ' + user.lastname)
    }

    function assertUserNotLoggedIn() {
        cy.get('#logout').should('not.exist')
        cy.contains('Logged in as').should('not.exist')
    }
})