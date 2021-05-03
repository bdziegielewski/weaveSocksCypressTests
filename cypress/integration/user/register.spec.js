context('Tests related to registration of user', () => {
    var users
    beforeEach(() => {
        cy.pcVisitHomepage()
        cy.fixture('users.json').then((data) => {
            users = data
        })
    })

    it('New user should register and logged in successfully', () => {
        var user = users[3]
        user.username = user.username + Math.random() // assuming that app's DB isn't rolled back every time tests are executed
        registerUser(user)
        cy.get('#registration-message').should('contain', 'Registration and login successful.')
        assertUserLoggedIn(user)
    })

    it('New registered user can login successfully after logout', () => {
        var user = users[3]
        user.username = user.username + Math.random() // assuming that app's DB isn't rolled back every time tests are executed
        registerUser(user)
        cy.get('#registration-message').should('contain', 'Registration and login successful.')
        assertUserLoggedIn(user)
        cy.get('#logout').click()
        assertUserNotLoggedIn()
        cy.login(user.username, user.password)
        assertUserLoggedIn(user)
    })

    it('User should not be able to use existing username', () => {
        var user = users[0]
        registerUser(user)
        cy.get('#registration-message').get('.alert-danger').should('exist')
    })

    it('Registration of already existing username should show some meaningful message', () => {
        var user = users[0]
        registerUser(user)
        cy.get('#registration-message').get('.alert-danger')
            .should('not.contain', 'Internal Server Error')
            .and('contain', 'Username already exists') // That's only a suggestion TODO: change expected message after fix
    })

    function registerUser(user) {
        cy.get('#register').click()
        cy.wait(500) // I was forced to use it because losing characters on username input - TODO: delete it after finding better solution
        cy.get('#register-username-modal').type(user.username)
        cy.get('#register-first-modal').type(user.firstname)
        cy.get('#register-last-modal').type(user.lastname)
        cy.get('#register-email-modal').type(user.email)
        cy.get('#register-password-modal').type(user.password)
        cy.get('.btn').contains('Register').click()
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