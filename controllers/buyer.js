
const sha256 = require('js-sha256')
const SALT = "stay toasty"

module.exports = (allModels) => {

    const db_neutral = allModels.neutral
    const db_seller = allModels.seller
    const db_buyer = allModels.buyer

    let buyerLoggedIn = (request) =>{
        return (sha256(request.cookies['userID']+SALT+request.cookies['role'])==request.cookies['sessionCookie']&&request.cookies['role']=="buyers")
    }

    let makePurchase = (request, response) =>{
        if (buyerLoggedIn(request)) {

            //first split up the queries that need to be made to alter the sale table
            let x = request.body
            let sellerID = x.seller_id
            let saleID = x.sale_id
            let queries = []
            Object.keys(x).forEach((item)=>{
                if(item.includes("item")){
                    let noKey = item.slice(4, item.length)
                    let values = [noKey, x[item], parseInt(x['price'+noKey])*x[item]] //contains item_id and quantity
                    queries.push(values)
                }
            })

            db_buyer.purchaseMaker(queries, sellerID, saleID, request.cookies['userID'], (err,orderID, soldOut)=>{
                if(err){
                    console.log(err.message)
                    response.send("Error occurred.")
                } else if (orderID&&soldOut.length==0) {
                    response.send("Order successful. Your order id is "+ orderID)
                } else if (orderID&&soldOut.length > 0){
                    response.send(soldOut[0])
                } else if (!orderID){
                    response.send("No successful purchases."+soldOut[0])
                }
            })
        } else {
            response.send("You need to be logged in as a buyer to make a purchase.")
        }
    }

    let trackSale = (request, response) => {
        if (buyerLoggedIn(request)){
            let buyerID = request.cookies['userID']
            let saleID = request.params.id
            let sellerUsername = request.params.username
            db_buyer.trackSaleQuery(buyerID, saleID, sellerUsername, (err, saleExists, res)=>{
                if(err){
                    console.log(err.message)
                    response.send("Error occurred.")
                } else if(!saleExists){
                    response.send("The sale you are trying to track does not exist.")
                } else {
                    response.redirect('back')
                }
            })
        } else {
            response.send("You need to be logged in as a buyer to track a sale.")
        }
    }

    let untrackSale = (request, response) => {
        if(buyerLoggedIn(request)){
            let saleID = request.params.id
            let sellerUsername = request.params.username
            let buyerID = request.cookies['userID']
            db_buyer.removeTrackSale(buyerID, saleID, sellerUsername, (err, saleExists, res)=>{
                if(err){
                    console.log(err.message)
                    response.send("Error occurred.")
                } else if(!saleExists){
                    response.send("The sale you are trying to untrack does not exist. It might have been deleted by the seller.")
                } else {
                    response.redirect('back')
                }
            })

        } else {
            response.send("You do not have permission to perform this action.")
        }


    }

    let trackSeller = (request, response) => {
        if (buyerLoggedIn(request)){
            let buyerID = request.cookies['userID']
            let sellerUsername = request.params.username
            db_buyer.trackSellerQuery(buyerID, sellerUsername, (err, userExists,res)=>{
                if(err){
                    console.log(err.message)
                    response.send("Error occurred.")
                } else if(!userExists){
                    response.send("The user you are trying to track does not exist.")
                } else {
                    response.redirect('back')
                }
            })
        } else {
            response.send("You need to be logged in as a buyer to track a sale.")
        }
    }

    let untrackSeller = (request, response) =>{
        if (buyerLoggedIn(request)){
            let buyerID = request.cookies['userID']
            let sellerUsername = request.params.username
            db_buyer.removeTrackSeller(buyerID, sellerUsername, (err, userExists,res)=>{
                if(err){
                    console.log(err.message)
                    response.send("Error occurred.")
                } else if(!userExists){
                    response.send("The user you are trying to track does not exist.")
                } else {
                    response.redirect('back')
                }
            })
        } else {
            response.send("You do not have permission to perform this action.")
        }

    }

    let saleLivePage = (request, response) =>{
        if(buyerLoggedIn(request)){
            let saleID = request.params.id
            let seller_username = request.params.username
            let buyerID = request.cookies['userID']
            db_seller.getSaleInfo(saleID, seller_username, buyerID, (err, saleInfo, saleItems)=>{
                if(err){
                    console.log(err.message)
                    response.send("Error occurred.")
                } else if (saleInfo.rows.length==0||saleItems.rows.length==0){
                    response.send("This sale does not exist - did you get the username/sale ID right?")
                }else {
                    response.render("saleLivePage", {sale: saleInfo, items: saleItems, seller_username})
                }
            })
        } else {
            response.send("This page is available for buyers only.")
        }

    }




    return {
        buyerLoggedIn,
        makePurchase,
        trackSale,
        untrackSale,
        trackSeller,
        untrackSeller,
        saleLivePage
    }

}