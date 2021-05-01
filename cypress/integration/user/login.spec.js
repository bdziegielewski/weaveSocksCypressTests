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
        openModalAndFillLoginData(user.username, user.password)
        cy.contains('Log in').click()
        cy.contains('Login successful.').should('exist')
        assertUserLoggedIn(user)
    })

    it('User should login by hitting enter in password modal', () => {
        const user = users.user[1]
        openModalAndFillLoginData(user.username, user.password)
        cy.get('#password-modal').type('{enter}')
        cy.contains('Login successful.').should('exist')
        assertUserLoggedIn(user)
    })

    it('User should not login with incorrect password', () => {
        const user = users.user[0]
        openModalAndFillLoginData(user.username, 'incorrectpassword')
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
        cy.login(user.username, user.password)
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
        cy.get('#howdy').should('contain', user.firstname + ' ' + user.lastname)
    }

    function assertUserNotLoggedIn() {
        cy.get('#logout').should('not.exist')
        cy.get('#howdy').should('not.exist')
    }
})