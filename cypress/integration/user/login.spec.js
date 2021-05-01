context('Tests related to existance of user', () => {
    var users
    beforeEach(() => {
        cy.pcVisitHomepage();
        cy.fixture('users.json').then((data) => {
            users = data
        })
    })

    it('User should login by login button click', () => {
        const user = users.user[0]
        openModalAndFillLoginData(user.login, user.password)
        cy.contains('Log in').click()
        cy.contains('Login successful.').should('exist')
        assertUserLoggedIn(user)
    })

    it('User should login by hitting enter in password modal', () => {
        const user = users.user[1]
        openModalAndFillLoginData(user.login, user.password)
        cy.get('#password-modal').type('{enter}')
        cy.contains('Login successful.').should('exist')
        assertUserLoggedIn(user)
    })

    it('User should not login with incorrect password', () => {
        const user = users.user[0]
        openModalAndFillLoginData(user.login, 'incorrectpassword')
        cy.contains('Log in').click()
        cy.contains('Invalid login credentials.').should('exist')
        assertUserNotLoggedIn()
    })

    it('Non existing user should not login', () => {
        const user = users.user[0]
        openModalAndFillLoginData('nonexistinguser', user.password)
        cy.contains('Log in').click()
        cy.contains('Invalid login credentials.').should('exist')
        assertUserNotLoggedIn()
    })

    it('User should be logged out after logout button click', () => {
        const user = users.user[2]
        cy.login(user.login, user.password)
        assertUserLoggedIn(user)
        cy.get('#logout').click()
        assertUserNotLoggedIn()
    })

    function openModalAndFillLoginData(login, password) {
        cy.get('#login').click()
        cy.get('#username-modal').click().type(login)
        cy.get('#password-modal').click().type(password)
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