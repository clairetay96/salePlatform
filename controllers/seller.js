
const sha256 = require('js-sha256')
const SALT = "stay toasty"

module.exports = (allModels) => {

    const db_seller = allModels.seller

    let renderCatalogueForm = (request, response) =>{
        if (sha256(request.cookies['userID']+SALT+request.cookies['role'])==request.cookies['sessionCookie']&&request.cookies['role']=="sellers"){
            response.render('catalogueform', {seller_id: request.cookies['userID']})
        } else {
            response.send("You do not have permission to view this page.")
        }
    }


    let newCatalogueForm = (request, response) =>{
        let x = request.body
        let sellerID = x.seller_id
        if (sha256(request.cookies['userID']+SALT+request.cookies['role'])==request.cookies['sessionCookie']&&request.cookies['role']=="sellers"&&request.cookies['userID']==sellerID){
            let allInput = []
            Object.keys(x).forEach((item)=>{
                if(item.includes("item_name")){
                    let noKey = item.slice(9, item.length)
                    let inputValues = [x[item], x['price'+noKey],x['product_desc'+noKey],x['imgURL'+noKey], sellerID]
                    allInput.push(inputValues)
                }
            })
            db_seller.postCatalogueForm(allInput, (err, success)=>{
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



    let renderSaleForm = (request, response)=>{
        if(sha256(request.cookies['userID']+SALT+request.cookies['role'])==request.cookies['sessionCookie']&&request.cookies['role']=="sellers") {
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
        if(sha256(request.cookies['userID']+SALT+request.cookies['role'])==request.cookies['sessionCookie']&&request.cookies['role']=="sellers"&&request.cookies['userID']==sellerID){
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

    let sellerPage = (request, response)=>{
        let seller_username = request.params.username
        db_seller.sellerInfo(seller_username, (err, seller_items, seller_sales)=>{
            if(err){
                console.log(err.message)
                response.send("Error occured.")
            } else {
                response.render('sellerPage', {items: seller_items, sales: seller_sales, seller_username})
            }
        })
    }


    let saleWaitingRoom = (request, response)=>{
        let saleID = request.params.id
        let seller_username = request.params.username
        db_seller.getSaleInfo(saleID, seller_username, (err, saleInfo, saleItems)=>{
            if(err){
                console.log(err.message)
                response.send("Error occurred.")
            } else if (saleInfo.rows.length==0||saleItems.rows.length==0){
                response.send("This sale does not exist - did you get the username/sale ID right?")
            }else {
                response.render("saleWaitRoom", {sale: saleInfo, items: saleItems, seller_username})
            }
        })
    }

    let saleLivePage = (request, response) =>{
        let saleID = request.params.id
        let seller_username = request.params.username
        db_seller.getSaleInfo(saleID, seller_username, (err, saleInfo, saleItems)=>{
            if(err){
                console.log(err.message)
                response.send("Error occurred.")
            } else if (saleInfo.rows.length==0||saleItems.rows.length==0){
                response.send("This sale does not exist - did you get the username/sale ID right?")
            }else {
                response.render("saleLivePage", {sale: saleInfo, items: saleItems, seller_username})
            }

        })

    }


    return {
        renderCatalogueForm,
        newCatalogueForm,
        renderSaleForm,
        newSaleForm,
        sellerPage,
        saleWaitingRoom,
        saleLivePage

    }

}