
const sha256 = require('js-sha256')
const SALT = "stay toasty"

module.exports = (allModels) => {

    const db_seller = allModels.seller

    let loggedIn = request => sha256(request.cookies['userID']+SALT+request.cookies['role'])==request.cookies['sessionCookie']

    let sellerLoggedIn = (request) =>{
        return sha256(request.cookies['userID']+SALT+request.cookies['role'])==request.cookies['sessionCookie']&&request.cookies['role']=="sellers"
    }

    let renderCatalogue = (request, response) =>{
        if(sellerLoggedIn(request)){
            let sellerID = request.cookies['userID']
            db_seller.getSellerItems(sellerID, null, (err, res, placeholder)=>{
                if(err){
                    console.log(err.message)
                    response.render('message', {loggedIn: true, message: 'Error occurred.'})
                } else if (res.rows.length==0){
                    response.render("sellerCatalogue", {sellerID, loggedIn: true})
                } else {
                    response.render("sellerCatalogue", {sellerID, sellerItems: res.rows, loggedIn: true})
                }
            })

        } else {
            response.send("You do not have permission to view this page.")
        }
    }

    let renderCatalogueForm = (request, response) =>{
        if (sellerLoggedIn(request)){
            let digits
            let sellerID = request.cookies['userID']

            let urlBreakdown = request.url.split("/")
            let address = urlBreakdown.pop()

            db_seller.getSellerItems(sellerID, address, (err, res, canAddAndDel)=>{
                if(err){
                    console.log(err.message)
                    response.render('message', {loggedIn: true, message: 'Error occurred.'})
                } else if(res.rows.length==0){
                    response.render('catalogueform', {sellerID, loggedIn: true, addDel: canAddAndDel})
                } else {
                    response.render('catalogueform', {sellerID, sellerItems: res.rows, loggedIn: true, addDel: canAddAndDel})
                }
            })
        } else {
            response.render('message', {loggedIn: loggedIn(request), message: 'You do not have permission to view this page.'})
        }
    }


    let newCatalogueForm = (request, response) =>{
        let x = request.body
        let sellerID = x.seller_id

        if (sellerLoggedIn(request)&&request.cookies['userID']==sellerID){
            let allNewInput = []
            let allEditInput = []
            Object.keys(x).forEach((item)=>{
                if(item.includes("item_name")){
                    let noKey = item.slice(9, item.length)
                    let inputValues = [x[item], x['price'+noKey],x['product_desc'+noKey],x['imgURL'+noKey], sellerID, x['item_id'+noKey]]
                    if(x['item_id'+noKey]){
                        allEditInput.push(inputValues)
                    } else {
                        allNewInput.push(inputValues)
                    }
                }
            })
            console.log(allNewInput, allEditInput)
            db_seller.postCatalogueForm(sellerID, allNewInput, allEditInput,(err, success)=>{
                if(err){
                    console.log(err.message)
                    response.render('message', {loggedIn: true, message: 'Error occurred.'})
                } else if (success) {
                    response.render('message', {loggedIn: true, message: 'Database update successful.'})
                }
            })
        } else {
            response.render('message', {loggedIn: loggedIn(request), message: 'You do not have permission to view this page.'})
        }
    }

    let deleteCatalogueForm = (request, response)=> {
        let x = request.body
        let sellerID = x.seller_id
        if(sellerLoggedIn(request)&&request.cookies['userID']==sellerID){
            db_seller.deleteCatalogueItems(sellerID, (err, res)=>{
                if(err){
                    console.log(err.message)
                    response.render('message', {loggedIn: true, message: 'Error occurred.'})
                } else {
                    response.redirect("/")
                }
            })
        }
    }

    let deleteItem = (request, response)=>{
        let x = request.body
    }

    let renderSaleForm = (request, response)=>{
        if(sellerLoggedIn(request)) {
            //request from db a list of seller's items - use that to render options.
            db_seller.getSellerItems(request.cookies['userID'], null, (err, res, placeholder)=>{
                if(err){
                    console.log(err.message)
                    response.render('message', {loggedIn: true, message: 'Error occurred.'})
                } else {
                    res.loggedIn = true
                    res.seller_id = request.cookies['userID']
                    response.render('saleform', res)
                }
            })
        } else {
            response.render('message', {loggedIn: loggedIn(request), message: 'You do not have permission to view this page.'})
        }
    }


    let newSaleForm = (request, response) =>{
        let x = request.body
        let sellerID = x.seller_id
        let sale_name = x.sale_name
        let sale_desc = x.sale_desc
        if(sellerLoggedIn(request)&&request.cookies['userID']==sellerID){
            let inputRows = []
            let datesLive =[]
            Object.keys(x).forEach((item)=>{
                if(item.includes("qtyAv")){
                    if(x[item]>0){
                        let itemKey = item.slice(5, item.length)
                        let oneRow = [itemKey, x[item], x['maxOrd'+itemKey]]
                        inputRows.push(oneRow)
                        console.log(inputRows)
                    }

                } else if (item.includes("time_live")){
                    datesLive.push(x[item])
                }
            })

            db_seller.makeNewSales(sellerID, sale_name, sale_desc, datesLive, inputRows, (err, isValid, success)=>{
                if(err){
                    console.log(err.message)
                    response.render('message', {loggedIn: true, message: 'Error occurred.'})
                } else if(!isValid){
                    response.render('message', {loggedIn: true, message: "You tried to add an item that's not yours."})
                } else if(success){
                    response.render('message', {loggedIn: true, message: 'Sale added successfully.'})
                }
            })
        } else {
            response.render('message', {loggedIn: loggedIn(request), message: 'You do not have permission to view this page.'})
        }
    }

    let renderEditSaleForm = (request, response) =>{
        if(sellerLoggedIn(request)){
            let sellerID = request.cookies['userID']
            let saleID = request.params.id
            let seller_username = request.params.username
            db_seller.renderEditSaleForm(sellerID, saleID, (err, res)=>{
                if(err){
                    console.log(err.message)
                    response.render('message', {loggedIn: true, message: 'Error occurred.'})
                } else {
                    let sellerInfo = {
                        seller_username,
                        loggedIn: true,
                        sellerItems:res[0],
                        saleInfo: res[1],
                        saleItems: res[2]
                    }
                    response.render('editSaleForm', sellerInfo)
                }

            })


        } else {
            response.render('message', {loggedIn: loggedIn(request), message: 'You do not have permission to view this page.'})
        }

    }

    let updateSale = (request, response)=>{
        let x = request.body
        if(sellerLoggedIn(request)&&x.seller_id==request.cookies['userID']){
            let inputRows = []
            Object.keys(x).forEach((item)=>{
                if(item.includes("qtyAv")){
                    if(x[item]>0){
                        let itemKey = item.slice(5, item.length)
                        let oneRow = [itemKey, x[item], x['maxOrd'+itemKey]]
                        inputRows.push(oneRow)
                    }
                }
            })
            //update sales table and sale_id table
            let saleInfo = [x.time_live, x.sale_name, x.sale_desc, x.sale_id, x.seller_id]
            db_seller.updateSaleInfo(inputRows, x.sale_id, x.seller_id, saleInfo, (err, cannotUpdate,res)=>{
                if(err){
                    console.log(err.message)
                    response.render('message', {loggedIn: true, message: 'Error occurred.'})
                }else if(cannotUpdate) {
                    response.render('message', {loggedIn: true, message: 'You cannot update a sale once it has gone live.'})
                } else {
                    response.redirect("/")
                }
            })
        } else {
            response.render('message', {loggedIn: loggedIn(request), message: 'You do not have permission to view this page.'})
        }
    }

    //can only delete sale before it goes live = otherwise you have to close it.
    let deleteSale = (request, response) => {
        if(sellerLoggedIn(request)){
            let sellerID = request.cookies['userID']
            let saleID = request.params.id
            db_seller.deleteSale(sellerID,saleID, (err, cannotDelete, res)=>{
                if(err){
                    console.log(err.message)
                    response.render('message', {loggedIn: true, message: 'Error occurred.'})
                }else if(cannotDelete){
                    response.render('message', {loggedIn: true, message: 'You cannot delete a sale once it has gone live. You can close the sale instead - you can do this by going to the sale page.'})
                } else {
                    response.redirect("/")
                }
            })




        } else {
            response.render('message', {loggedIn: loggedIn(request), message: 'You do not have permission to view this page.'})
        }
    }

    let closeSale = (request, response) =>{
        if(sellerLoggedIn(request)){
            let sellerID = request.cookies['userID']
            let saleID = request.params.id
            //must close sale and drop table, but will not remove orders from that sale.
            db_seller.closeSaleUpdate(sellerID, saleID, (err, isValid, res)=>{
                if (err) {
                    console.log(err.message)
                    response.render('message', {loggedIn: true, message: 'Error occurred.'})
                } else if (!isValid) {
                    response.render('message', {loggedIn: true, message: 'You do not have permission to perform this action.'})
                } else {
                    response.render('message', {loggedIn: true, message: 'Sale successfully closed.'})
                }

            })

        } else {
            response.render('message', {loggedIn: loggedIn(request), message: 'You do not have permission to view this page.'})
        }

    }

    let getSaleOrders = (request, response) =>{
        if(sellerLoggedIn){
            let sellerID = request.cookies['userID']
            let saleID = request.params.saleid
            db_seller.getSaleOrderInfo(sellerID, saleID, (err, isValid, res)=>{
                if(err){
                    console.log(err.message)
                    response.render('message', {loggedIn: true, message: 'Error occurred.'})
                } else if (!isValid) {
                    response.render('message', {loggedIn: true, message: 'You do not have permission to view this page.'})
                } else if(res) {
                    let saleInfo = res[0]
                    saleInfo.loggedIn = true
                    saleInfo.sale_id = request.params.saleid
                    saleInfo.seller_username = res[1].rows[0].username
                    response.render('saleOrderPage', saleInfo)
                }

            })

        } else {
            response.render('message', {loggedIn: loggedIn(request), message: 'You do not have permission to view this page.'})
        }

    }


    return {
        sellerLoggedIn,
        renderCatalogue,
        renderCatalogueForm,
        newCatalogueForm,
        deleteCatalogueForm,
        renderSaleForm,
        newSaleForm,
        renderEditSaleForm,
        updateSale,
        closeSale,
        deleteSale,
        getSaleOrders
    }

}