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

    app.get("/user/edit", noUserControllerFunc.renderEditUserForm)
    app.put("/user/edit", noUserControllerFunc.editUserPut)

    app.get("/seller", noUserControllerFunc.getAllSellers)
    app.get("/sales", noUserControllerFunc.getAllSales)

    //Edit catalogue items - only if seller is logged in.
    //see all items
    app.get("/seller/catalogue/edit/", sellerControllerFunc.renderCatalogue )

    //edit all items, individual item, or add a new item
    app.get("/seller/catalogue/edit/all", sellerControllerFunc.renderCatalogueForm)
    app.get("/seller/catalogue/edit/new", sellerControllerFunc.renderCatalogueForm)
    app.get("/seller/catalogue/edit/:id", sellerControllerFunc.renderCatalogueForm)


    app.post("/seller/catalogue/edit/", sellerControllerFunc.newCatalogueForm)


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
    app.get("/seller/:username/sales/:id/edit", sellerControllerFunc.renderEditSaleForm)
    app.put("/seller/:username/sales/:id/edit", sellerControllerFunc.updateSale)
    //delete row from sales table, drop sales_id table - only if sale is not live yet
    app.delete("/seller/:username/sales/:id/delete", sellerControllerFunc.deleteSale)
    //if sale has gone live, it can be closed: sales_id will be dropped, but sale remains in sales table.
    app.post("/seller/:username/sales/:id/close", sellerControllerFunc.closeSale)

    //get order details for each saleid
    app.get("/seller/:username/sales/:saleid/orders", sellerControllerFunc.getSaleOrders)

    //get order details for each orderID for buyer
    app.get("/orders/:orderid", buyerControllerFunc.getOrder)

    //if buyer is logged in can track a sale, and delete tracking
    app.post("/seller/:username/sales/:id/track", buyerControllerFunc.trackSale)
    app.delete("/seller/:username/sales/:id/track", buyerControllerFunc.untrackSale)

    //only renders past a certain time, for buyers only
    app.get("/seller/:username/sales/:id/live", buyerControllerFunc.saleLivePage)

    //when purchase is made, updates the sale_id table, adds to order table, then to order_details table
    app.post("/seller/:username/sales/:id/live/", buyerControllerFunc.makePurchase)

    //resets session cookies.
    app.post("/logout", noUserControllerFunc.logout)

};