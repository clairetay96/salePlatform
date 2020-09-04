module.exports = (dbPool) =>{

    let postCatalogueForm = (inputRows, callback) => {
        let queryText = "INSERT INTO catalogue(item_name, price, product_desc,image_url,seller_id) VALUES($1,$2,$3,$4,$5)"
        inputRows.forEach((oneRow)=>{
            dbPool.query(queryText, oneRow, (err, res)=>{
                if(err){
                    callback(err, null)
                    return
                }
            })
        })
        callback(null, true)
    }


    let getSellerItems = (seller_id, callback)=>{
        let queryText = "SELECT * FROM catalogue WHERE seller_id=$1"
        dbPool.query(queryText, [seller_id], (err, res)=>{
            callback(err, res)
        })
    }


    let makeNewSales = (seller_id, datesLive, inputRows, callback)=>{
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
            let queryText1 = "INSERT INTO sales (seller_id, time_live, sold_out) VALUES($1,$2,'false') RETURNING sale_id"
            dbPool.query(queryText1, [seller_id, item], (err1, res1)=>{
                if(err1){
                    callback(err1, null,null)
                    return
                }
                let queryText2 = "CREATE TABLE sales_"+res1.rows[0].sale_id+"(item_id INTEGER, quantity INTEGER, max_order INTEGER)"
                dbPool.query(queryText2, (err2, res2)=>{
                    if(err2){
                        callback(err2, null, null)
                        return
                    }
                    let tableName = "sales_"+res1.rows[0].sale_id
                    inputRows.forEach((rowData)=>{
                        let queryText3 = "INSERT INTO "+tableName+"(item_id, quantity,max_order) VALUES ($1,$2,$3)"
                        dbPool.query(queryText3, rowData, (err3, res3)=>{
                            if(err3){
                                callback(err3, null, null)
                            } else {
                                callback(null,true,true)
                            }
                        })
                    })
                })
            })
        })
    }

    let sellerInfoFromID = (seller_id, callback) =>{
        let queryText1 = "SELECT * FROM catalogue where seller_id=$1"
            dbPool.query(queryText1,[seller_id], (err1, res1)=>{
                if(err1){
                    callback(err1, null, null)
                    return
                }
                let queryText2 = "SELECT * FROM sales WHERE seller_id=$1"
                dbPool.query(queryText2, [seller_id], (err2, res2)=>{
                    callback(err2, res1, res2)
                })
            })
        }


    let sellerInfo = (username, callback)=>{
        let queryText="SELECT seller_id FROM sellers WHERE username=$1"
        dbPool.query(queryText, [username], (err, res)=>{
            if(err){
                callback(err, null, null)
                return
            }
            sellerInfoFromID(res.rows[0].seller_id, callback)
        })
    }



    let getSaleInfo = (saleID, username, callback) =>{
        let queryText = "SELECT * FROM (SELECT * FROM sales INNER JOIN sellers ON sales.seller_id=sellers.seller_id) AS sale_info WHERE sale_id=$1 AND username=$2"
        dbPool.query(queryText, [saleID, username], (err, res)=>{
            if(err){
                callback(err, null, null)
                return
            }
            let queryText1 = `SELECT * FROM sales_${saleID} INNER JOIN catalogue ON catalogue.item_id=sales_${saleID}.item_id`
            dbPool.query(queryText1, (err1, res1)=>{
                callback(err1, res, res1)
            })
        })
    }




    return {
        postCatalogueForm,
        getSellerItems,
        makeNewSales,
        sellerInfo,
        getSaleInfo,
        sellerInfoFromID

    }
}