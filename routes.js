module.exports = (app, allModels) => {
    const noUserControllerFunc = require('./controllers/neutral')(allModels)
    const sellerControllerFunc = require('./controllers/seller')(allModels)

    //homepage - log in for neutral, tracked sales for buyers, own page for sellers
    app.get("/", noUserControllerFunc.renderHome)

    //log in functionality
    app.post("/login", noUserControllerFunc.logIn)

    //render new account page
    app.get("/newacc", noUserControllerFunc.renderSignUp)

    //create a new account
    app.post("/newacc/", noUserControllerFunc.postSignUp)

    //show seller page, catalogue, upcoming sales
    app.get("/seller/:username", sellerControllerFunc.sellerPage)

    //render form for seller to create a new catalogue only if logged in
    app.get("/seller/catalogue/new", sellerControllerFunc.renderCatalogueForm)
    app.post("/seller/catalogue/new/", sellerControllerFunc.newCatalogueForm)

    //render form for seller to create a new sale - will create a new table
    app.get("/seller/sales/new", sellerControllerFunc.renderSaleForm)
    app.post("/seller/sales/new/", sellerControllerFunc.newSaleForm)

    //sale page - shows products, prices, and button link to live page.
    app.get("/seller/:username/sales/:id/", sellerControllerFunc.saleWaitingRoom)

    //only renders past a certain time.
    app.get("/seller/:username/sales/:id/live", sellerControllerFunc.saleLivePage)

    //updates the sale_id table
    app.post("/seller/:username/sales/:id/live/")






};