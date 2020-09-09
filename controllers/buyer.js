
const sha256 = require('js-sha256')
const SALT = "stay toasty"

module.exports = (allModels) => {

    const db_neutral = allModels.neutral
    const db_seller = allModels.seller
    const db_buyer = allModels.buyer

    //checks if a user is logged in & authenticates
    let loggedIn = (request) => {
        return sha256(request.cookies['userID']+SALT+request.cookies['role'])==request.cookies['sessionCookie']
    }

    //checks if a buyer is logged in & authenticates
    let buyerLoggedIn = (request) =>{
        return (sha256(request.cookies['userID']+SALT+request.cookies['role'])==request.cookies['sessionCookie']&&request.cookies['role']=="buyers")
    }

    //makes purchase (live sale page)
    let makePurchase = (request, response) =>{
        if (buyerLoggedIn(request)) {

            //first split up the queries that need to be made to alter the sale table
            let x = request.body
            let sellerID = x.seller_id
            let saleID = x.sale_id
            let queries = [] //this will store all the queries we need to make to the database to update the quantity in the sales_* table

            Object.keys(x).forEach((item)=>{
                if(item.includes("item")){ //if request.body key contains 'item', it follows naming convention itemx where x is the item_id, and there is a corresponding field pricex
                    let noKey = item.slice(4, item.length) //this retrieves the itemid
                    let values = [noKey, x[item], parseInt(x['price'+noKey])*x[item]] //contains item_id and quantity
                    if(x[item]>0){
                        queries.push(values)
                    }
                }
            })

            //soldOut is an array that contains a list of items that were sold out. if orderID is null, no order was placed.
            db_buyer.purchaseMaker(queries, sellerID, saleID, request.cookies['userID'], (err,orderID, soldOut)=>{
                if(err){
                    console.log(err.message)
                    response.render('message', {loggedIn: true, message: 'Error occurred.'})
                } else if (orderID&&soldOut.length==0) {
                    response.render('message', {loggedIn: true, message: "Order successful. Your order id is "+ orderID })
                } else if (orderID&&soldOut.length > 0){
                    let notice = "Order partially successful. Your order ID is "+ orderID + "."
                    soldOut.forEach((item)=>{
                        notice += "\n" + item
                    })
                    response.render('message', {loggedIn: true, message: notice })
                } else if (!orderID){
                    response.render('message', {loggedIn: true, message: "Sorry! Everything you wanted is sold out." })
                }
            })
        } else {
            response.render('message', {loggedIn:loggedIn(request), message: "You need to be logged in as a buyer to make a purchase." })
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
                    response.render('message', {loggedIn: true, message: 'Error occurred.'})
                } else if(!saleExists){
                    response.render('message', {loggedIn: true, message: 'The sale you are trying to track does not exist.'})
                } else {
                    response.redirect('back')
                }
            })
        } else {
            response.render('message', {loggedIn: loggedIn(request), message: "You need to be logged in as a buyer to track a sale." })
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
                    response.render('message', {loggedIn: true, message: 'Error occurred.'})
                } else if(!saleExists){
                    response.render('message', {loggedIn: true, message: 'The sale you are trying to untrack does not exist.'})
                } else {
                    response.redirect('back')
                }
            })

        } else {
            response.render('message', {loggedIn: loggedIn(request), message: 'You do not have permission t0 perform this action.'})
        }


    }

    let trackSeller = (request, response) => {
        if (buyerLoggedIn(request)){
            let buyerID = request.cookies['userID']
            let sellerUsername = request.params.username
            db_buyer.trackSellerQuery(buyerID, sellerUsername, (err, userExists,res)=>{
                if(err){
                    console.log(err.message)
                    response.render('message', {loggedIn: true, message: 'Error occurred.'})
                } else if(!userExists){
                    response.render('message', {loggedIn: true, message: 'The seller you are trying to track does not exist.'})
                } else {
                    response.redirect('back')
                }
            })
        } else {
            response.render('message', {loggedIn: loggedIn(request), message: "You need to be logged in as a buyer to track a sale." })
        }
    }

    let untrackSeller = (request, response) =>{
        if (buyerLoggedIn(request)){
            let buyerID = request.cookies['userID']
            let sellerUsername = request.params.username
            db_buyer.removeTrackSeller(buyerID, sellerUsername, (err, userExists,res)=>{
                if(err){
                    console.log(err.message)
                    response.render('message', {loggedIn: true, message: 'Error occurred.'})
                } else if(!userExists){
                    response.render('message', {loggedIn: true, message: 'The seller you are trying to untrack does not exist.'})
                } else {
                    response.redirect('back')
                }
            })
        } else {
            response.render('message', {loggedIn: loggedIn(request), message: "You do not have permission to perform this action." })
        }

    }

    //renders saleLivePage - must GET all the sale info first
    let saleLivePage = (request, response) =>{
        if(buyerLoggedIn(request)){
            let saleID = request.params.id
            let seller_username = request.params.username
            let buyerID = request.cookies['userID']
            db_seller.getSaleInfo(saleID, seller_username, buyerID, (err, saleInfo, saleItems)=>{
                if(err){
                    console.log(err.message)
                    response.render('message', {loggedIn: true, message: 'Error occurred.'})
                } else if (saleInfo.rows.length==0||saleItems.rows.length==0){
                    response.render('message', {loggedIn: true, message: 'This sale does not exist. Did you get the username/id right?'})
                }else {
                    response.render("saleLivePage", {sale: saleInfo, items: saleItems, seller_username, loggedIn: true})
                }
            })
        } else {
            response.render('message', {loggedIn: loggedIn(request), message: 'This page is available for buyers only.'})
        }
    }

    //get buyer order from order id
    let getOrder = (request, response) =>{
        if(buyerLoggedIn(request)){
            let orderID = request.params.orderid
            let buyerID = request.cookies['userID']
            db_buyer.getOrderInfo(orderID, buyerID, (err, isValid,res)=>{
                if(err){
                    console.log(err.message)
                    response.render('message', {loggedIn: true, message: 'Error occurred.'})
                } else if (!isValid) {
                    response.render('message', {loggedIn: true, message: 'You do not have permission to view this page.'})
                } else {
                    res.loggedIn = true
                    console.log(res)
                    response.render('buyerOrder', res)

                }

        })

        } else {
            response.render('message', {loggedIn: loggedIn(request), message: 'You do not have permission to view this page.'})
        }


    }




    return {
        buyerLoggedIn,
        makePurchase,
        trackSale,
        untrackSale,
        trackSeller,
        untrackSeller,
        saleLivePage,
        getOrder
    }

}