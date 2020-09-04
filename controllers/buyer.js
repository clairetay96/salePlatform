
const sha256 = require('js-sha256')
const SALT = "stay toasty"

module.exports = (allModels) => {

    const db_neutral = allModels.neutral
    const db_seller = allModels.seller
    const db_buyer = allModels.buyer

    let makePurchase = (request, response) =>{
        if (sha256(request.cookies['userID']+SALT+request.cookies['role'])==request.cookies['sessionCookie']&&request.cookies['role']=="buyers") {

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
            console.log(queries)

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


    return {
        makePurchase
    }

}