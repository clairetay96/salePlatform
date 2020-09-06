
const sha256 = require('js-sha256')
const SALT = "stay toasty"

module.exports = (allModels) => {

    const db_seller = allModels.seller

    let sellerLoggedIn = (request) =>{
        return sha256(request.cookies['userID']+SALT+request.cookies['role'])==request.cookies['sessionCookie']&&request.cookies['role']=="sellers"
    }

    let renderCatalogue = (request, response) =>{
        if(sellerLoggedIn(request)){
            let sellerID = request.cookies['userID']
            db_seller.getSellerItems(sellerID, null, (err, res)=>{
                if(err){
                    console.log(err.message)
                    response.send("Error occurred.")
                } else if (res.rows.length==0){
                    response.render("sellerCatalogue", {sellerID})
                } else {
                    response.render("sellerCatalogue", {sellerID, sellerItems: res.rows})
                }
            })

        } else {
            response.send("You do not have permission to view this page.")
        }
    }

    let renderCatalogueForm = (request, response) =>{
        if (sellerLoggedIn(request)){
            let sellerID = request.cookies['userID']

            let urlBreakdown = request.url.split("/")
            let address = urlBreakdown.pop()

            db_seller.getSellerItems(sellerID, address, (err, res)=>{
                if(err){
                    console.log(err.message)
                    response.send("Error occurred.")
                } else if(res.rows.length==0){
                    response.render('catalogueForm', {sellerID})
                } else {
                    response.render('catalogueForm', {sellerID, sellerItems: res.rows})
                }
            })
        } else {
            response.send("You do not have permission to view this page.")
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
            db_seller.postCatalogueForm(allNewInput, allEditInput,(err, success)=>{
                if(err){
                    console.log(err.message)
                    response.send("Error occurred.")
                } else if (success) {
                    response.send("Database update successful.")
                }
            })
        } else {
            response.send("You do not have permission to add to catalogue.")
        }
    }

    let deleteCatalogueForm = (request, response)=> {
        let x = request.body
        let sellerID = x.seller_id
        if(sellerLoggedIn(request)&&request.cookies['userID']==sellerID){
            db_seller.deleteCatalogueItems(sellerID, (err, res)=>{
                if(err){
                    console.log(err.message)
                    response.send("Error occurred.")
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
            db_seller.getSellerItems(request.cookies['userID'], (err, res)=>{
                if(err){
                    console.log(err.message)
                    response.send("Error occurred.")
                } else {
                    response.render('saleform', res)
                }
            })
        } else {
            response.send("you do not have permission to view this page.")
        }
    }


    let newSaleForm = (request, response) =>{
        let x = request.body
        let sellerID = x.seller_id
        if(sellerLoggedIn(request)&&request.cookies['userID']==sellerID){
            let inputRows = []
            let datesLive =[]
            Object.keys(x).forEach((item)=>{
                if(item.includes("qtyAv")){
                    let itemKey = item.slice(5, item.length)
                    let oneRow = [itemKey, x[item], x['maxOrd'+itemKey]]
                    inputRows.push(oneRow)
                    console.log(inputRows)
                } else if (item.includes("time_live")){
                    datesLive.push(x[item])
                }
            })

            db_seller.makeNewSales(sellerID, datesLive, inputRows, (err, isValid, success)=>{
                if(err){
                    console.log(err.message)
                    response.send("Error occurred.")
                } else if(!isValid){
                    response.send("You tried to add an item that's not yours.")
                } else if(success){
                    response.send("Sale added successfully.")
                }
            })
        } else {
            response.send("You do not have permission for this.")
        }
    }


    return {
        sellerLoggedIn,
        renderCatalogue,
        renderCatalogueForm,
        newCatalogueForm,
        deleteCatalogueForm,
        renderSaleForm,
        newSaleForm
    }

}