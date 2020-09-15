module.exports = (dbPool) =>{


    //must alter the sale table, insert into order table and order_details table.
    let purchaseMaker = (queries, sellerID, saleID, buyerID, callback)=>{
        //back-end authentication

        let failedQueries = [] //promises
        let successQueries = [] //promises
        let allQueries = [] //promises
        //run each query - if there are enough to meet order qty, purchase is successful and made. Otherwise, it's not.
        queries.forEach((query)=>{
            let queryText0 = `SELECT * FROM sales_${saleID} WHERE item_id=$1 AND quantity >=${query[1]}`
            allQueries.push(
                dbPool.query(queryText0, [query[0]])
                    .then(res0 => {
                        if (res0.rows.length == 0){
                            let queryText3 = `SELECT * FROM catalogue WHERE item_id=$1 AND seller_id=$2`
                            failedQueries.push(
                                dbPool.query(queryText3, [query[0], sellerID])
                                    .then(res3 => "Insufficient number of "+res3.rows[0].item_name+", so none were purchased." )
                                    .catch(err3 => err3)
                            )
                        } else {
                            let queryText = `UPDATE sales_${saleID} SET quantity = quantity - ${query[1]}  WHERE item_id=$1`
                            successQueries.push(
                                dbPool.query(queryText, [query[0]])
                                    .then((res)=>query)
                                    .catch((err)=>err)
                            )
                        }
                })
                .catch((err0)=>{callback(err0, null, null)})
            )
        })

        Promise.all(allQueries)
            .then((allQueries)=>{
                Promise.all(failedQueries)
                .then((failedQueries)=>{
                    Promise.all(successQueries)
                    .then((successQueries)=>{
                        if(successQueries.length>0){

                            let queryText1 = "INSERT INTO orders(seller_id, sale_id, buyer_id) VALUES($1,$2,$3) RETURNING order_id"
                            dbPool.query(queryText1, [sellerID, saleID, buyerID], (err1, res1)=>{
                                if(err1){
                                    callback(err1, null, null)
                                } else {
                                    let orderID = res1.rows[0].order_id
                                    let orderDetailPromises = []

                                    successQueries.forEach((query)=>{
                                        let queryText2 = "INSERT INTO order_details(order_id, item_id, quantity, amt_charged) VALUES($1,$2,$3,$4)"

                                        let totalQuery = [orderID].concat(query)

                                        orderDetailPromises.push(
                                            dbPool.query(queryText2, totalQuery)
                                            .then(res=>res)
                                            .catch(err=>err))

                                        Promise.all(orderDetailPromises)
                                            .then((res)=>callback(null, orderID, failedQueries))
                                            .catch((err)=>err)
                                    })
                                }
                            })
                        } else {
                            console.log(failedQueries,successQueries)
                            callback(null,null, failedQueries)
                        }

                    })

                })

            })
            .catch(err=>{callback(err, null,null)})

    }

    let trackSaleQuery = (buyerID, saleID, sellerUsername, callback) =>{
        //check if sale exists
        let queryText = "SELECT * FROM (sales INNER JOIN sellers ON sales.seller_id=sellers.seller_id) AS sales_by_sellers WHERE username=$1 AND sale_id=$2"
        dbPool.query(queryText, [sellerUsername, saleID])
            .then((res)=>{
                if(res.rows.length==0){
                    callback(null, false, null)
                } else {
                    let values = [saleID, buyerID]
                    let queryText1 = "INSERT INTO sale_tracker(sale_id, buyer_id) VALUES($1,$2)"
                    dbPool.query(queryText1, values)
                        .then((res1)=>{callback(null, true, res)})
                        .catch((err1)=>err1)
                }
            })
            .catch((err)=>{callback(err, null, null)})
    }

    let removeTrackSale = (buyerID, saleID, sellerUsername, callback) =>{
        let queryText = "SELECT * FROM (sales INNER JOIN sellers ON sales.seller_id=sellers.seller_id) AS sales_by_sellers WHERE username=$1 AND sale_id=$2"
        dbPool.query(queryText, [sellerUsername, saleID])
            .then((res)=>{
                if(res.rows.length==0){
                    callback(null, false, null)
                } else {
                    let queryText2 = "DELETE FROM sale_tracker WHERE buyer_id=$1 AND sale_id=$2"
                    dbPool.query(queryText2, [buyerID, saleID])
                        .then(res1 => {
                            callback(null, true, res1)
                        })
                        .catch(err=>err)
                }
            })
            .catch((err)=>{callback(err, null, null)})

    }

    //when a seller is tracked, all of their sales are added to the buyers tracking
    let trackSellerQuery = (buyerID, sellerUsername, callback) => {
        let queryText = "SELECT * FROM sellers WHERE username=$1"
        dbPool.query(queryText, [sellerUsername])
            .then((res)=>{
                if(res.rows.length==0){
                    callback(null, false, null)
                } else {
                    let seller_id = res.rows[0].seller_id
                    let values = [seller_id, buyerID]
                    let queryText1 = "INSERT INTO seller_tracker(seller_id, buyer_id) VALUES($1,$2)"
                    dbPool.query(queryText1, values)
                        .then((res1)=>{
                            let queryText2 = "SELECT sale_id FROM sales WHERE seller_id=$1 AND sold_out='f'"
                            dbPool.query(queryText2, [seller_id])
                                .then(res2=>{
                                    saleIDs = res2.rows.map(sale=>sale.sale_id)
                                    let allQueries = []
                                    saleIDs.forEach((id)=>{
                                        let queryText3 = "SELECT * FROM sale_tracker WHERE buyer_id=$1 AND sale_id=$2"
                                        allQueries.push(dbPool.query(queryText3, [buyerID, id])
                                            .then(res3=>{
                                                if(res3.rows.length==0){
                                                    let queryText4 = "INSERT INTO sale_tracker(buyer_id, sale_id) VALUES ($1,$2)"
                                                    dbPool.query(queryText4, [buyerID, id])
                                                            .then(res4=>res4)
                                                            .catch(err4=>{callback(err4, null,null)})
                                                }
                                            })
                                            .catch(err3=>err3))
                                    })
                                    Promise.all(allQueries)
                                        .then(res5=>{callback(null, true, res5)})
                                        .catch(err5=>{callback(err5, null,null)})
                                })
                                .catch(err2=>err2)
                        })
                        .catch(err1=>err1)
                }
            })
            .catch((err)=>{callback(err, null, null)})
    }

    //when a seller is untracked, no changes to tracked sales - but seller's new sales are not added.
    let removeTrackSeller = (buyerID, sellerUsername, callback) => {
        let queryText = "SELECT * FROM sellers WHERE username=$1"
        dbPool.query(queryText, [sellerUsername])
            .then((res)=>{
                if(res.rows.length==0){
                    callback(null, false, null)
                } else {
                    let seller_id = res.rows[0].seller_id
                    let values = [seller_id, buyerID]
                    let queryText1 = "DELETE FROM seller_tracker WHERE seller_id=$1 AND buyer_id=$2"
                    dbPool.query(queryText1, values)
                        .then((res1)=>{callback(null, true, res)})
                        .catch((err1)=>err1)
                }
            })
            .catch((err)=>{callback(err, null, null)})

    }


    let buyerInfoFromID = (buyerID, callback)=> {
        let allQueries = []
        //0. gets buyer info, 1. gets sale info, 2. gets seller tracking info, 3. gets orders info
        let tables = ['buyers', '(SELECT buyer_id, foo.sale_id, foo.seller_id, time_live, sale_name,username AS seller_username,sold_out FROM (SELECT buyer_id, sales.sale_id,seller_id,time_live,sale_name,sold_out FROM sale_tracker INNER JOIN sales ON sale_tracker.sale_id=sales.sale_id) AS foo INNER JOIN sellers on foo.seller_id=sellers.seller_id) AS bar', '(SELECT seller_track_id, buyer_id, seller_tracker.seller_id, username FROM seller_tracker INNER JOIN sellers ON seller_tracker.seller_id=sellers.seller_id) AS foo', '(SELECT order_id, foo.sale_id, foo.seller_id,buyer_id,timestamp,username,sale_name FROM (SELECT order_id,sale_id,orders.seller_id,buyer_id,timestamp,username FROM orders INNER JOIN sellers ON orders.seller_id=sellers.seller_id) AS foo INNER JOIN sales ON sales.sale_id=foo.sale_id) as bar']

        tables.forEach((table, index)=>{
            let queryText = `SELECT * FROM ${table} WHERE buyer_id=$1`
            if(index==3){
                queryText += "ORDER BY timestamp DESC"
            }
            allQueries.push(
                dbPool.query(queryText, [buyerID])
                    .then(res=>res)
                    .catch(err=>{callback(err, null)})
                )
        })

        Promise.all(allQueries)
            .then((allQueries)=>{
                let buyerInfo = {
                    buyer: allQueries[0],
                    sales_tracked: allQueries[1],
                    sellers_tracked: allQueries[2],
                    orders: allQueries[3]
                }
                callback(null, buyerInfo)
            })
            .catch((err)=>{callback(err,null)})
    }


    let getOrderInfo = (orderID, buyerID, callback)=>{
        //get sale info from order and buyer id
        let queryText = "SELECT username, sale_name,timestamp,time_live,order_id, sales.sale_id FROM (SELECT username, sale_id,order_id,buyer_id,timestamp FROM orders INNER JOIN sellers ON orders.seller_id=sellers.seller_id) AS foo INNER JOIN sales ON sales.sale_id=foo.sale_id WHERE order_id=$1 AND buyer_id=$2"
        dbPool.query(queryText, [orderID, buyerID])
            .then((res)=>{
                if(res.rows.length ==0){
                    callback(null, false, null)
                } else {
                    let saleInfo = res.rows[0]
                    //get all orders with the given order ID
                    let queryText1 = "SELECT item_name, quantity, amt_charged FROM order_details INNER JOIN catalogue ON order_details.item_id=catalogue.item_id WHERE order_id=$1"
                    dbPool.query(queryText1, [orderID])
                        .then((res1)=>{
                            saleInfo.allItems = res1.rows
                            callback(null, true, saleInfo)})
                }
            })
            .catch((err)=>{callback(err, null,null)})
    }



    return {
        purchaseMaker,
        trackSaleQuery,
        removeTrackSale,
        trackSellerQuery,
        removeTrackSeller,
        buyerInfoFromID,
        getOrderInfo
    }
}