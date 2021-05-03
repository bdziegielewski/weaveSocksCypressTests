context('Basic tests of buying while beeing logged in', () => {
    var currentUser
    var previousUserOrdersQuantity
    var products
    var orders

    before(() => {
        cy.fixture('users.json').then((data) => {
            currentUser = data.user[1]
        })
        cy.fixture('products.json').then((data) => {
            products = data
        })
        cy.fixture('buy-while-logged-in-orders.json').then((data) => {
            orders = data
        })
    })

    beforeEach(() => {
        cy.pcVisitHomepage()
        cy.login(currentUser.username, currentUser.password)
        cy.getUserOrdersQuantity().then((value) => {
            previousUserOrdersQuantity = value
            cy.log('PREV ORD COUNT: '+value)
        })
    })

    it('Logged user should be able to buy some cheap socks using his/her saved address and payment method', () => {
        var currentOrder = orders[0]
        cy.get('.dropdown-toggle').contains('Catalogue').click()
        addOrderToCart(currentOrder)
        cy.log('Add to cart')
        cy.get('#buttonCart').click()
        validateAndPlaceOrder()
        checkIfUserOrdersQuantityChangedByOne()
    })

    it.only('Verify placed order', () => {
        var currentOrder = orders[1]
        cy.get('.dropdown-toggle').contains('Catalogue').click()
        addOrderToCart(currentOrder)
        goToBasket()
        validateAndPlaceOrder(currentOrder)
        cy.get('#customer-orders').should('exist')
        checkIfUserOrdersQuantityChangedByOne()
    })

    function addOrderToCart(order) {
        order.products.forEach((product) => {
            cy.log('Adding to cart: ' + product.quantity + 'x ' + product.name)
            for (var i = 0; i < product.quantity; i++) {
                cy.get('.product').contains(product.name).parents('.text').contains('Add to cart').then((element) => {
                    element.click()
                })
            }
        })
    }

    function goToBasket() {
        cy.wait(500) // I was forced to use it because of DOM detachment issue TODO: delete and find better solution
        cy.get('#basket-overview').contains('item(s) in cart').click()
    }

    function validateAndPlaceOrder(order) {
        order.products.forEach((product) => {
            cy.log('Validating: ' + product.quantity + 'x ' + product.name)
            cy.get('#basket').contains(product.name).parents('tr').find('.form-control').should('have.value', product.quantity)
        })
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


