context('Basic tests of buying while beeing logged in', () => {
    var currentUser
    var previousUserOrdersQuantity
    var products
    var orders

    before(() => {
        cy.fixture('users.json').then((data) => {
            currentUser = data.user[0]
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
        var currentOrder = orders[0]
        cy.get('.dropdown-toggle').contains('Catalogue').click()
        currentOrder.products.forEach(addToCart)


        cy.wait(60 * 1000)

        // goToBasketAndPlaceOrder()
        checkIfUserOrdersQuantityChangedByOne()
    })

    it('temp', () => {
        cy.log('users orders ' + previousUserOrdersQuantity)
        prepareOrderData()
    })

    function addToCart(product) {
        cy.log('Adding to cart: ' + product.quantity + 'x ' + product.name)
        for (var i = 0; i < product.quantity; i++) {
            cy.get('.product').contains(product.name).parents('.text').contains('Add to cart').then((element) => {
                element.click()
            })

        }
    }

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

    function prepareOrderData() {
        // cy.log(produkt1.name + ' ' + produkt1.totalPrice())
        // var myOrder = order()
        // myOrder.push(produkt1)
        // cy.log('order: ' + myOrder.totalPrice())
        // expect(getPriceForProduct("Holy")).eq(99.99)
        getPriceForProduct("Holy").then((price) => {
            cy.wrap(price).should('eq', 99.99)
            cy.log('price for holly: ' + price)
        })
        product("Holy", 1).then((prod) => {
            cy.log('price for holly in prod: ' + prod.price)
        })

        // order([product("Holy", 1), product("Crossed", 2)]).then((myOrder) => {
        //     cy.log('order: ' + myOrder.totalPrice())
        // })
        var myOrder = order([product("Holy", 1), product("Crossed", 2)])
        cy.log('total order price ' + myOrder.totalPrice())


        // var produkt1 = product("Figueroa", 2)
        // expect(produkt1.name).eq(30)
        // var myOrder = order([product("Figueroa", 2)])
        // expect(order.totalPrice()).eq(30)
        // expect(cy.wrap(getPriceForProduct("Figueroa"))).eq('166')
        // cy.log('price: '+getPriceForProduct("Figueroa"))
        // cy.wait(10 * 1000)
    }

    function order(products) {
        return {
            products,
            push(product) {
                if (products == null) {
                    products = []
                }
                products.push(product)
            },
            totalPrice() {
                var totalPrice = 0;
                for (var i = 0; i < products.length; i++) {
                    totalPrice += products[i].totalPrice
                }
                return totalPrice
            }
        }
    }

    function product(name, quantity) {
        return getPriceForProduct(name).then((price) => {
            return {
                name,
                price,
                quantity,
                totalPrice: price * quantity
            }
        })
    }

    function getPriceForProduct(name) {
        return cy.request('/catalogue').its('body').then((body) => {
            const obj = JSON.parse(body)
            // expect(obj[1]).equal('test')
            // price = obj.find(p => p.name == name).price
            // cy.log('Product: ' + name + ' price: ' + price)
            return obj.find(p => p.name == name).price
        })
    }

})


