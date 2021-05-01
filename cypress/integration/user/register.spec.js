context('Tests related to existance of user', () => {
    var users
    beforeEach(() => {
        cy.pcVisitHomepage();
        // cy.fixture('users.json').as('users')
        cy.fixture('users.json').then((data) => {
            users = data
        })
    })

    it('New user should register successfully', () => {
        // const user = users.user[0]
        // openModalAndFillLoginData(user.login, user.password)
        // cy.contains('Log in').click()
        // cy.contains('Login successful.').should('exist')
        // assertUserLoggedIn(user)
    })

    it('New user should register successfully', () => {
        throw 'TODO: Fill the test'
    })
    
    it('New user should register successfully', () => {
        throw 'TODO: Fill the test'
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