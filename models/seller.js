module.exports = (dbPool) =>{

    let deleteCatalogueItems = (sellerID, callback)=>{
        let queryText = "DELETE FROM catalogue WHERE seller_id=$1"
        dbPool.query(queryText, [sellerID])
            .then((res)=>{callback(null, res)})
            .catch((err)=>{callback(err, null)})
    }

    let postCatalogueForm = (sellerID, newInputRows, editInputRows, callback) => {
        //should also check if item belongs to seller

        let allQueries = []

        let queryText = "INSERT INTO catalogue(item_name, price, product_desc,image_url,seller_id) VALUES($1,$2,$3,$4,$5)"
        newInputRows.forEach((oneRow)=>{
            let newRow = oneRow.slice(0, 5)
            allQueries.push(dbPool.query(queryText, newRow)
                .then(res=>res)
                .catch(err=>err))
        })

        let queryText1 ="UPDATE catalogue SET item_name=$1, price=$2, product_desc=$3,image_url=$4,seller_id=$5 WHERE item_id=$6"
        editInputRows.forEach((oneRow)=>{
            allQueries.push(dbPool.query(queryText1, oneRow)
                    .then(res=>res)
                    .catch(err=>err))
        })

        Promise.all(allQueries)
            .then((res)=>{callback(null, true)})
            .catch((err)=>{callback(err, null)})


    }


    let getSellerItems = (seller_id, address, callback)=>{
        let digits = ['0','1','2','3','4','5','6','7','8','9']
        let queryText = "SELECT * FROM catalogue WHERE seller_id=$1"
        let canAddAndDel = {add: true, del: false}
        console.log(address, "---address")

        if(address&&digits.includes(address[0])){
            queryText += " AND item_id="+address
            canAddAndDel={add: false, del: false}

        } else if (address&&address=="new") {
            queryText += " AND 0=1"
            canAddAndDel = {add: true, del: true}
        }

        dbPool.query(queryText, [seller_id], (err, res)=>{
            callback(err, res, canAddAndDel)
        })
    }

    let makeNewSales = (seller_id, sale_name, sale_desc, datesLive, inputRows, callback)=>{
        //check if all item ids are offered by the seller
        inputRows.forEach((item)=>{
            let queryText = "SELECT * FROM catalogue WHERE seller_id=$1 AND item_id=$2"
            dbPool.query(queryText, [seller_id, item[0]], (err, res)=>{
                if(err){
                    callback(err, null, null)
                    return
                } else if (res.rows.length == 0) {
                    callback(null, false, null)
                    return
                }
            })
        })
        //now add the sale into the sale table AND create indiv sale tables.
        datesLive.forEach((item)=>{
            let queryText1 = "INSERT INTO sales (seller_id, time_live, sold_out, sale_name, sale_desc) VALUES($1,$2,'false', $3,$4) RETURNING sale_id"
            dbPool.query(queryText1, [seller_id, item, sale_name, sale_desc], (err1, res1)=>{
                if(err1){
                    callback(err1, null,null)
                    return
                }
                let queryText2 = "CREATE TABLE sales_"+res1.rows[0].sale_id+"(item_id INTEGER, quantity INTEGER, max_order INTEGER)"
                dbPool.query(queryText2, (err2, res2)=>{
                    if(err2){
                        callback(err2, null, null)
                        return
                    } else {
                        let allQueries = []
                        let tableName = "sales_"+res1.rows[0].sale_id
                        inputRows.forEach((rowData)=>{
                            let queryText3 = "INSERT INTO "+tableName+"(item_id, quantity,max_order) VALUES ($1,$2,$3)"
                            allQueries.push(
                                dbPool.query(queryText3, rowData)
                                    .then(res3=>res3)
                                    .catch(err3=>err3)
                            )
                        })
                         Promise.all(allQueries)
                                .then(res=>{callback(null, true, true)})
                                .catch(err=>{callback(err, null,null)})

                    }

                })
            })
        })
    }

    let sellerInfoFromID = (seller_id, callback) =>{
        let returnedValues = []
        let tables = ['catalogue', '(SELECT bar.sale_id, bar.seller_id, time_live, sale_name, tracker_count, count AS order_count FROM (SELECT sales.sale_id, seller_id, time_live, sale_name, count AS tracker_count FROM sales LEFT JOIN (SELECT sale_id, COUNT(buyer_id) FROM sale_tracker GROUP BY sale_id) AS foo ON sales.sale_id=foo.sale_id) AS bar LEFT JOIN (SELECT sale_id, COUNT(order_id) FROM orders GROUP BY sale_id) AS orderfoo ON orderfoo.sale_id=bar.sale_id) AS fubar', 'seller_tracker', 'sellers']

        tables.forEach((table, index)=>{
            let queryText = `SELECT * FROM ${table} WHERE seller_id=$1`
            if(index==1){
                queryText += " ORDER BY time_live DESC"
            } else if(index==0){
                queryText += " ORDER BY item_id"
            }

            returnedValues.push(
                dbPool.query(queryText, [seller_id])
                    .then(res=>res)
                    .catch(err =>{callback(err, null,null)})
                )
        })

        Promise.all(returnedValues)
            .then((returnedValues) => {
                console.log(returnedValues)
                let sellerInfo = {
                    catalogue: returnedValues[0],
                    sales: returnedValues[1],
                    followers: returnedValues[2],
                    username: returnedValues[3].rows[0].username

                }
                callback(null, sellerInfo, null)
            })

        return returnedValues

        }


    let sellerInfo = (username, isBuyerID, callback)=>{
        let queryText="SELECT seller_id FROM sellers WHERE username=$1"
        dbPool.query(queryText, [username], (err, res)=>{
            if(err){
                callback(err, null, null)
                return
            } else if (res.rows.length==0){
                callback(null, null, null)
                return
            } else {
                if(isBuyerID){
                    let returnedInfo = sellerInfoFromID(res.rows[0].seller_id, (x,y,z)=>{return})
                    Promise.all(returnedInfo)
                        .then((returnedInfo1)=>{
                            let queryText1 = "SELECT * FROM seller_tracker WHERE buyer_id=$1"
                            dbPool.query(queryText1, [isBuyerID],(err1, res1)=>{
                                let sellerInfo = {
                                    catalogue: returnedInfo1[0],
                                    sales: returnedInfo1[1],
                                    followers: returnedInfo1[2]
                                }
                                callback(err1, sellerInfo, res1.rows.length > 0)
                            })
                        })

                } else {
                    sellerInfoFromID(res.rows[0].seller_id, callback)
                }

            }
        })
    }



    let getSaleInfo = (saleID, username, isBuyerID, callback) =>{
        let queryText = "SELECT * FROM (SELECT * FROM sales INNER JOIN sellers ON sales.seller_id=sellers.seller_id) AS sale_info WHERE sale_id=$1 AND username=$2"
        dbPool.query(queryText, [saleID, username], (err, res)=>{
            if(err){
                callback(err, null, null,null)
                return
            }
            let queryText1 = `SELECT * FROM sales_${saleID} INNER JOIN catalogue ON catalogue.item_id=sales_${saleID}.item_id`
            dbPool.query(queryText1, (err1, res1)=>{
                if(!isBuyerID){
                    callback(err1, res, res1, null)
                } else {
                    if(err1){
                        callback(err1, null,null,null)
                    }
                    queryText2 = "SELECT * FROM sale_tracker WHERE buyer_id=$1 AND sale_id=$2"
                    dbPool.query(queryText2, [isBuyerID,saleID], (err2, res2)=>{
                        callback(err2, res, res1, res2.rows.length>0)
                        return [res, res1]
                    })
                }

            })
        })
    }

    let renderEditSaleForm = (sellerID, saleID, callback)=>{
        let allQueries = []

        let queryText = "SELECT * FROM catalogue WHERE seller_id=$1"
        allQueries.push(dbPool.query(queryText, [sellerID])
            .then(res=>res)
            .catch(err=>callback(err, null)))

        let queryText1 = "SELECT * FROM sales WHERE sale_id=$1"
        allQueries.push(dbPool.query(queryText1, [saleID])
            .then(res=>res)
            .catch(err=>callback(err, null)))

        let table = 'sales_'+ saleID
        let queryText2 = `SELECT * FROM `+table
        allQueries.push(dbPool.query(queryText2)
            .then(res=>res)
            .catch(err=>{callback(err, null)}))

        Promise.all(allQueries)
            .then(res=>callback(null, res))
            .catch(err=>{callback(err, null)})

    }

    let updateSaleInfo = (inputRows,saleID,sellerID,saleInfo,callback)=>{


        let queryText3 = "SELECT time_live FROM sales WHERE sale_id=$1 AND seller_id=$2"
        dbPool.query(queryText3, [saleID, sellerID])
            .then(res => {
                let time_live = res.rows[0].time_live
                let now = new Date()
                if(now >= Date.parse(time_live)){
                    callback(null, true, null)
                } else {
                    let allQueries = []
                    let queryText = "UPDATE sales SET time_live=$1, sale_name=$2, sale_desc=$3 WHERE sale_id=$4 AND seller_id=$5"
                    allQueries.push(dbPool.query(queryText, saleInfo)
                            .then(res=>res)
                            .catch(err=>callback(err, null,null)))

                    let table = "sales_"+saleID
                    let queryText1 = `DELETE FROM ${table}`
                    dbPool.query(queryText1)
                        .then(res=>{
                            inputRows.forEach((item)=>{
                                let queryText2 =`INSERT INTO ${table} (item_id, quantity,max_order) VALUES ($1,$2,$3)`
                                allQueries.push(dbPool.query(queryText2, item)
                                                    .then(res=>res)
                                                    .catch(err=>{callback(err, null, null)}))
                    })

                        })
                        .catch(err=>{callback(err, null, null)})



                    Promise.all(allQueries)
                        .then(res=>{callback(null, null, res)})
                        .catch(err=>{callback(err, null, null)})

                }
            })
            .catch(err=>{callback(err, null, null)})


    }

    let closeSaleUpdate = (sellerID, saleID, callback)=>{

        let queryText="UPDATE sales SET sold_out='true' WHERE sale_id=$1 AND seller_id=$2"


        let queryText1 = "DROP TABLE sales_"+saleID

    }

    let deleteSale = (sellerID, saleID, callback)=>{
        let queryText = "SELECT time_live FROM sales WHERE seller_id=$1 AND sale_id=$2"
        dbPool.query(queryText, [sellerID, saleID])
            .then(res=>{
                let time_live = res.rows[0].time_live
                let now = new Date()
                if(now >= time_live){
                    callback(null, true, null)
                } else {
                    let allQueries = []
                    let table = "sales_"+saleID
                    let queryText1=`DROP TABLE ${table}`
                    allQueries.push(
                        dbPool.query(queryText1)
                            .then(res=>res)
                            .catch(err=>{callback(err, null,null)}))
                    let queryText2 = `DELETE FROM sales WHERE seller_id=$1 AND sale_id=$2`
                    allQueries.push(
                        dbPool.query(queryText2, [sellerID, saleID])
                            .then(res=>res)
                            .catch(err=>{callback(err, null,null)}))
                    Promise.all(allQueries)
                    .then(res=>{callback(null,null,true)})
                    .catch(err=>{callback(err, null,null)})


                }

            })
            .catch(err=>{callback(err, null, null)})

    }

    let getSaleOrderInfo = (sellerID, saleID, callback)=>{
        let queryText = "SELECT * FROM sales WHERE seller_id=$1 AND sale_id=$2"
        dbPool.query(queryText, [sellerID, saleID])
            .then((res)=>{
                if(res.rowCount==0){
                    callback(null, false, null)
                } else {
                    let queryText1 = "SELECT order_id, sale_id, buyer_id, timestamp, username, bar.item_id, quantity, amt_charged, item_name FROM (SELECT foo.order_id, sale_id,buyer_id, timestamp, username, item_id, quantity, amt_charged FROM (SELECT order_id, sale_id, orders.buyer_id, timestamp, username FROM orders INNER JOIN buyers ON orders.buyer_id=buyers.buyer_id) AS foo INNER JOIN order_details ON foo.order_id=order_details.order_id) AS bar INNER JOIN catalogue ON bar.item_id=catalogue.item_id WHERE sale_id=$1 ORDER BY order_id ASC"
                    dbPool.query(queryText1, [saleID])
                        .then((res)=>{callback(null,true,res)})
                        .catch((err)=>{callback(err, null, null)})
                }
            })
            .catch((err)=>{callback(err, null,null)})
    }



    return {
        postCatalogueForm,
        getSellerItems,
        deleteCatalogueItems,
        makeNewSales,
        sellerInfo,
        getSaleInfo,
        sellerInfoFromID,
        renderEditSaleForm,
        updateSaleInfo,
        closeSaleUpdate,
        deleteSale,
        getSaleOrderInfo

    }
}