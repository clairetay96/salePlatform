module.exports = (app, allModels) => {

    const noUserControllerFunc = require('./controllers/neutral')(allModels)
    const sellerControllerFunc = require('./controllers/seller')(allModels)
    const buyerControllerFunc = require('./controllers/buyer')(allModels)

    //homepage - log in for neutral, dashboards for sellers and buyers
    app.get("/", noUserControllerFunc.renderHome)

    //log in functionality
    app.post("/login", noUserControllerFunc.logIn)

    //render new account page
    app.get("/newacc", noUserControllerFunc.renderSignUp)

    //create a new account
    app.post("/newacc/", noUserControllerFunc.postSignUp)

    //show seller page, catalogue, upcoming sales
    app.get("/seller/:username", sellerControllerFunc.sellerPage)
    //if buyer is logged in, can follow a seller
    app.post("/seller/:username/track", buyerControllerFunc.trackSeller)


    //render form for seller to create a new catalogue only if seller logged in
    app.get("/seller/catalogue/new", sellerControllerFunc.renderCatalogueForm)
    app.post("/seller/catalogue/new/", sellerControllerFunc.newCatalogueForm)

    //render form for seller to create a new sale - will create a new table
    app.get("/seller/sales/new", sellerControllerFunc.renderSaleForm)
    app.post("/seller/sales/new/", sellerControllerFunc.newSaleForm)

    //sale page - shows products, prices, and button link to live page.
    app.get("/seller/:username/sales/:id/", sellerControllerFunc.saleWaitingRoom)
    //if buyer is logged in can track a sale.
    app.post("/seller/:username/sales/:id/track", buyerControllerFunc.trackSale)

    //only renders past a certain time.
    app.get("/seller/:username/sales/:id/live", sellerControllerFunc.saleLivePage)

    //updates the sale_id table, adds to order table, then to order_details table
    app.post("/seller/:username/sales/:id/live/", buyerControllerFunc.makePurchase)

    app.post("/logout", noUserControllerFunc.logout)

};