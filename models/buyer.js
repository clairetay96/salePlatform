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



    return {
        purchaseMaker
    }
}