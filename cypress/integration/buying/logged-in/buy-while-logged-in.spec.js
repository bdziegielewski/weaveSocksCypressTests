context('Basic tests of buying while beeing logged in', () => {
    var currentUser
    var previousUserOrdersQuantity
    beforeEach(() => {
        cy.clearCookies()
        cy.pcVisitHomepage()
        cy.fixture('users.json').then((data) => {
            var currentUser = data.user[0]
            cy.login(currentUser.username, currentUser.password)
            cy.getUserOrdersQuantity().then((value) => {
                previousUserOrdersQuantity = value
            })
        })
    })

    it('Logged user should be able to buy some cheap socks using his/her saved address and payment method', () => {
        cy.get('.dropdown-toggle').contains('Catalogue').click()
        cy.get('.product').contains('SuperSport XL').click()
        cy.log('Add to cart')
        cy.get('#buttonCart').click()
        cy.waitFor('#basket-overview') // because of detaching element from DOM
        cy.get('#basket-overview').click()
        cy.get('#orderButton').click()
        cy.getUserOrdersQuantity().then((currentOrdersQuantity) => {
            cy.log('Orders before test: '+ previousUserOrdersQuantity)
            cy.log('Orders after test: '+ currentOrdersQuantity)
            expect(currentOrdersQuantity).equal(previousUserOrdersQuantity+1)
        })
    })
})