context('Basic tests of buying while beeing logged in', () => {
    let currentUser: {
        username: string,
        password: string
    }
    let previousUserOrdersQuantity: number;
    let products: product[];
    let orders: order[];
    type product = {
        "name": string;
        "quantity": number;
        "price": number;
        "count": number;
    }
    type order = {
        "products": product[];
        "shippingCost": number;
    }


    before(() => {
        cy.fixture('users.json').then((users) => {
            currentUser = users[1]
        })
        cy.fixture('products.json').then((data) => {
            products = data
        })
        cy.fixture('buy-while-logged-in-orders.json').then((data) => {
            orders = data
        })
    })

    beforeEach(() => {
        cy.pcVisitHomepage();
        cy.login(currentUser.username, currentUser.password)
        cy.getUserOrdersQuantity().then((value) => {
            previousUserOrdersQuantity = value
        })
    })

    it('Logged user should be able to buy one cheap pair of socks using his/her saved address and payment method', () => {
        var currentOrder = orders[0]
        cy.get('.dropdown-toggle').contains('Catalogue').click()
        addOrderToCart(currentOrder)
        goToBasket()
        validateAndPlaceOrder(currentOrder)
        viewAndValidateOrder(currentOrder)
        checkIfUserOrdersQuantityChangedByOne()
    })

    it('Logged user should be able to buy couple of different pairs of socks using his/her saved address and payment method', () => {
        var currentOrder = orders[1]
        cy.get('.dropdown-toggle').contains('Catalogue').click()
        addOrderToCart(currentOrder)
        goToBasket()
        validateAndPlaceOrder(currentOrder)
        viewAndValidateOrder(currentOrder)
        checkIfUserOrdersQuantityChangedByOne()
    })

    function addOrderToCart(order: order) {
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
        cy.get('#basket-overview').should("contain", "item(s) in cart").click()
    }

    function validateAndPlaceOrder(order: order) {
        order.products.forEach((product) => {
            cy.log('Validating: ' + product.quantity + 'x ' + product.name)
            cy.get('#basket > div.box')
                .contains(product.name)
                .parents('tr')
                .find('.form-control')
                .should('have.value', product.quantity)
        })
        cy.log('Place order')
        cy.get('#orderButton').click()
        cy.get('#customer-orders').should('exist')
    }

    function viewAndValidateOrder(order: order) {
        const expectedCurrentOrderNumber = previousUserOrdersQuantity + 1
        cy.get('#tableOrders > :nth-child(' + expectedCurrentOrderNumber + ')').contains('View').click()

        order.products.forEach((product) => {
            cy.get('#tableOrder').contains(product.name).parents('tr').as('productRow')
            cy.log('Validating quantity (' + product.quantity + ') of ' + product.name)
            cy.get('@productRow').find(':nth-child(3)').should('have.text', product.quantity)

            const unitPrice = formatPrice(getUnitPrice(product.name))
            cy.log('Validating unit price (' + unitPrice + ') of ' + product.name)
            cy.get('@productRow').find(':nth-child(4)').should('have.text', unitPrice)

            const totalPrice = formatPrice(getUnitPrice(product.name) * product.quantity)
            cy.log('Validating total price (' + totalPrice + ') of ' + product.name)
            cy.get('@productRow').find(':nth-child(6)').should('have.text', totalPrice)
        })

        const orderSubtotal = getExpectedSubtotalPriceForOrder(order)
        cy.log('Validating order subtotal (' + formatPrice(orderSubtotal) + ')')
        cy.get('#orderSubtotal').should('have.text', formatPrice(orderSubtotal))

        cy.log('Validating shipping cost (' + formatPrice(order.shippingCost) + ')')
        cy.get('#orderShipping').should('have.text', formatPrice(order.shippingCost))

        const orderTotal = orderSubtotal + order.shippingCost
        cy.log('Validating order total (' + formatPrice(orderTotal) + ')')
        cy.get('#orderTotal').should('have.text', formatPrice(orderTotal))

        // TODO: Ofcourse it should also validate address and payment data, and it is strange that order
    }

    function formatPrice(price: number) {
        return '$' + price.toFixed(2)
    }

    function getUnitPrice(productName: string) {
        return products.find(p => p.name == productName)!.price
    }

    function getExpectedSubtotalPriceForOrder(order: order) {
        var totalPrice = 0
        order.products.forEach((product) => {
            totalPrice += getUnitPrice(product.name) * product.quantity
        })
        return totalPrice
    }

    function checkIfUserOrdersQuantityChangedByOne() {
        cy.getUserOrdersQuantity().then((currentOrdersQuantity) => {
            cy.log('Orders before test: ' + previousUserOrdersQuantity)
            cy.log('Orders after test: ' + currentOrdersQuantity)
            cy.log('Expected orders after test: ' + (previousUserOrdersQuantity + 1))
            cy.wrap(currentOrdersQuantity).should('eq', previousUserOrdersQuantity + 1)
        })
    }
})


