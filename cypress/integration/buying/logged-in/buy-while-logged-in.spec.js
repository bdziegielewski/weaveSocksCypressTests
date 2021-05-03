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
        goToBasketAndPlaceOrder()
        checkIfUserOrdersQuantityChangedByOne()
    })

    it.only('Verify placed order', () => {
        cy.get('.dropdown-toggle').contains('Catalogue').click()
        cy.log('Adding to cart: 3x Figueroa')
        for (var i = 0; i < 3; i++) {
            cy.waitFor('.pages')
            cy.get('.product').contains('Figueroa').parents('.text').contains('Add to cart').click()
        }
        cy.log('Adding to cart: 2x Crossed')
        for (var i = 0; i < 2; i++) {
            cy.waitFor('.pages')
            cy.get('.product').contains('Crossed').parents('.text').contains('Add to cart').click()
        }
        cy.log('Adding to cart: 1x Colourful')
        cy.waitFor('.pages')
        cy.get('.product').contains('Colourful').parents('.text').contains('Add to cart').click()

        // goToBasketAndPlaceOrder()
        checkIfUserOrdersQuantityChangedByOne()
    })

    function goToBasketAndPlaceOrder() {
        cy.waitFor('#basket-overview') // because of detaching element from DOM
        cy.get('#basket-overview').click()
        cy.log('Place order')
        cy.get('#orderButton').click()
    }
    
    function checkIfUserOrdersQuantityChangedByOne() {
        cy.getUserOrdersQuantity().then((currentOrdersQuantity) => {
            cy.log('Orders before test: ' + previousUserOrdersQuantity)
            cy.log('Orders after test: ' + currentOrdersQuantity)
            expect(currentOrdersQuantity).equal(previousUserOrdersQuantity + 1)
        })
    }
})


