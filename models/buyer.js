module.exports = (dbPool) =>{


    //must alter the sale table, insert into order table and order_details table.
    let purchaseMaker = (queries, sellerID, saleID, buyerID, callback)=>{
        //back-end authentication

        let failedQueries = [] //promises
        let successQueries = [] //promises
        let allQueries = [] //promises
        //run each query
        queries.forEach((query)=>{
            let queryText0 = `SELECT * FROM sales_${saleID} WHERE item_id=$1 AND quantity >=${query[1]}`
            allQueries.push(
                dbPool.query(queryText0, [query[0]])
                    .then(res0 => {
                        if (res0.rows.length == 0){
                            let queryText3 = `SELECT * FROM catalogue WHERE item_id=$1 AND seller_id=$2`
                            failedQueries.push(
                                dbPool.query(queryText3, [query[0], sellerID])
                                    .then(res3 => "Insufficient number of "+res3.rows[0].item_name+", purchase unsuccessful." )
                                    .catch(err3 => {callback(err3, null, null)})
                            )
                        } else {
                            let queryText = `UPDATE sales_${saleID} SET quantity = quantity - ${query[1]}  WHERE item_id=$1`
                            successQueries.push(
                                dbPool.query(queryText, [query[0]])
                                    .then((res)=>query)
                                    .catch((err)=>{callback(err, null, null)})
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
                            let orderID;
                            dbPool.query(queryText1, [sellerID, saleID, buyerID], (err1, res1)=>{
                                if(err1){
                                    callback(err1, null, null)
                                    return
                                } else {
                                    orderID = res1.rows[0].order_id
                                    successQueries.forEach((query)=>{
                                        let queryText2 = "INSERT INTO order_details(order_id, item_id, quantity, amt_charged) VALUES($1,$2,$3,$4)"

                                        let totalQuery = [orderID].concat(query)

                                        dbPool.query(queryText2, totalQuery, (err2,res2)=>{
                                            if(err2){
                                                callback(err2, null, null)
                                                return
                                            }
                                        })
                                    })
                                    callback(null, orderID, failedQueries)
                                }
                            })
                        } else {
                            console.log(failedQueries,successQueries)
                            callback(null,null, failedQueries)
                        }

                    })

                })

            })

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
                        .catch((err1)=>{callback(err1, null, null)})
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

                }
            })
            .catch((err)=>{callback(err, null, null)})

    }

    let trackSellerQuery = (buyerID, sellerUsername, callback) => {
        let queryText = "SELECT * FROM sellers WHERE username=$1 LIMIT 1"
        dbPool.query(queryText, [sellerUsername])
            .then((res)=>{
                if(res.rows.length==0){
                    callback(null, false, null)
                } else {
                    let seller_id = res.rows[0].seller_id
                    let values = [seller_id, buyerID]
                    let queryText1 = "INSERT INTO seller_tracker(seller_id, buyer_id) VALUES($1,$2)"
                    dbPool.query(queryText1, values)
                        .then((res1)=>{callback(null, true, res)})
                        .catch((err1)=>{callback(err1, null, null)})
                }
            })
            .catch((err)=>{callback(err, null, null)})

    }

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
                        .catch((err1)=>{callback(err1, null, null)})
                }
            })
            .catch((err)=>{callback(err, null, null)})

    }


    let buyerInfoFromID = (buyerID, callback)=> {
        let allQueries = []
        let tables = ['buyers', '(SELECT buyer_id, foo.sale_id, foo.seller_id, time_live, username AS seller_username FROM (SELECT buyer_id, sales.sale_id,seller_id,time_live FROM sale_tracker INNER JOIN sales ON sale_tracker.sale_id=sales.sale_id) AS foo INNER JOIN sellers on foo.seller_id=sellers.seller_id) AS bar', '(SELECT buyer_id, foo.seller_id,username,sale_id,time_live FROM (SELECT buyer_id, seller_tracker.seller_id,username FROM seller_tracker INNER JOIN sellers ON seller_tracker.seller_id=sellers.seller_id) AS foo INNER JOIN sales ON foo.seller_id=sales.seller_id) AS bar', 'orders']

        tables.forEach((table)=>{
            let queryText = `SELECT * FROM ${table} WHERE buyer_id=$1`
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



    return {
        purchaseMaker,
        trackSaleQuery,
        removeTrackSale,
        trackSellerQuery,
        removeTrackSeller,
        buyerInfoFromID
    }
}