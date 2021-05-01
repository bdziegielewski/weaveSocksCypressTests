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
        user.username = user.username + Math.random() // assuming that app's DB isn't rolled back every time tests are executed
        registerUser(user)
        assertUserLoggedIn(user)
    })

    it('New registered user can login successfully after logout', () => {
        var user = users.user[3]
        user.username = user.username + Math.random() // assuming that app's DB isn't rolled back every time tests are executed
        registerUser(user)
        assertUserLoggedIn(user)
        cy.get('#logout').click()
        assertUserNotLoggedIn()
        cy.login(user.username, user.password)
        assertUserLoggedIn(user)
    })

    it('User should not be able to use existing username name', () => {
        throw 'TODO: Fill the test'
    })

    it('Registration of already existing username should not show Internal Server Error', () => {
        throw 'TODO: Fill the test'
    })

    function registerUser(user) {
        cy.get('#register').click()
        cy.get('#register-username-modal').type(user.username)
        cy.get('#register-first-modal').type(user.firstname)
        cy.get('#register-last-modal').type(user.lastname)
        cy.get('#register-email-modal').type(user.email)
        cy.get('#register-password-modal').type(user.password)
        cy.get('.btn').contains('Register').click()
        cy.contains('Registration and login successful.').should('exist')
    }

    function assertUserLoggedIn(user) {
        cy.get('#logout').should('exist')
        cy.get('#howdy').should('contain', user.firstname + ' ' + user.lastname)
    }

    function assertUserNotLoggedIn() {
        cy.get('#logout').should('not.exist')
        cy.get('#howdy').should('not.exist')
    }
})