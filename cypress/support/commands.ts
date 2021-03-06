// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

declare namespace Cypress {
    interface Chainable<Subject> {
        pcVisitHomepage(): Chainable<void>;

        login(username: string, password: string): Chainable<void>;

        getUserOrdersQuantity(): Chainable<number>;
    }
}

Cypress.Commands.add('pcVisitHomepage', () => {
    cy.viewport(1600, 900)
    cy.visit('/')
})

Cypress.Commands.add('login', (username, password) => {
    cy.log('Logging in as: ' + username)
    cy.get('#login').click()
    cy.wait(500) // I was forced to use it because losing characters on username input - TODO: delete it after finding better solution
    cy.get('#username-modal').click().type(username)
    cy.get('#password-modal').click().type(password).type('{enter}')
    cy.get('#logout').should('exist')
})

Cypress.Commands.add('getUserOrdersQuantity', () => {
    cy.request('/orders').its('body').then((body) => {
        const orders = JSON.parse(body)
        return orders.length
    })
})
