module.exports = (app, allModels) => {

    const noUserControllerFunc = require('./controllers/neutral')(allModels)
    const sellerControllerFunc = require('./controllers/seller')(allModels)
    const buyerControllerFunc = require('./controllers/buyer')(allModels)

    //homepage - log in for neutral, dashboards for sellers and buyers
    app.get("/", noUserControllerFunc.renderHome)

    //log in functionality
    app.post("/login", noUserControllerFunc.logIn)

    //render new account page
    app.get("/user/new", noUserControllerFunc.renderSignUp)

    //create a new account
    app.post("/user/new/", noUserControllerFunc.postSignUp)

    app.get("/user/edit")
    app.put("/user/edit")
    app.delete("/user/delete/")

    //Edit catalogue items - only if seller is logged in.
    //see all items
    app.get("/seller/catalogue/edit/", sellerControllerFunc.renderCatalogue )

    //edit all items, individual item, or add a new item
    app.get("/seller/catalogue/edit/all", sellerControllerFunc.renderCatalogueForm)
    app.get("/seller/catalogue/edit/new", sellerControllerFunc.renderCatalogueForm)
    app.get("/seller/catalogue/edit/:id", sellerControllerFunc.renderCatalogueForm)


    app.post("/seller/catalogue/edit/", sellerControllerFunc.newCatalogueForm)

    //delete catalogue items
    app.delete("/seller/catalogue/edit/delete_all")
    app.delete("/seller/catalogue/edit/delete_item/:id")

    //show seller page, catalogue, upcoming sales
    app.get("/seller/:username", noUserControllerFunc.sellerPage)
    //if buyer is logged in, can follow/unfollow a seller
    app.post("/seller/:username/track", buyerControllerFunc.trackSeller)
    app.delete("/seller/:username/track", buyerControllerFunc.untrackSeller)



    //render form for seller to create a new sale - will create a new table
    app.get("/seller/sales/new", sellerControllerFunc.renderSaleForm)
    app.post("/seller/sales/new/", sellerControllerFunc.newSaleForm)


    //sale page - shows products, prices, and button link to live page.
    app.get("/seller/:username/sales/:id/", noUserControllerFunc.saleWaitingRoom)

    //edit sale_id table
    app.get("/seller/:username/sales/:id/edit")
    app.put("/seller/:username/sales/:id/edit")
    //edit sales table, drop sale_id table.
    app.delete("/seller/:username/sales/:id/delete")

    //if buyer is logged in can track a sale, and delete tracking
    app.post("/seller/:username/sales/:id/track", buyerControllerFunc.trackSale)
    app.delete("/seller/:username/sales/:id/track", buyerControllerFunc.untrackSale)

    //get buyer tracked sales and buyer tracked sellers. option to "untrack" on page.
    app.get("/buyer/:username/tracked_sales")
    app.get("/buyer/:username/tracked_sellers")

    //only renders past a certain time, for buyers only
    app.get("/seller/:username/sales/:id/live", buyerControllerFunc.saleLivePage)

    //when purchase is made, updates the sale_id table, adds to order table, then to order_details table
    app.post("/seller/:username/sales/:id/live/", buyerControllerFunc.makePurchase)

    //resets session cookies.
    app.post("/logout", noUserControllerFunc.logout)

};