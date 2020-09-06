module.exports = (dbPool) =>{

    let deleteCatalogueItems = (sellerID, callback)=>{
        let queryText = "DELETE FROM catalogue WHERE seller_id=$1"
        dbPool.query(queryText, [sellerID])
            .then((res)=>{callback(null, res)})
            .catch((err)=>{callback(err, null)})
    }

    let postCatalogueForm = (newInputRows, editInputRows, callback) => {
        let sellerID = newInputRows[0][4]
        //should also check if item belongs to seller

        let queryText = "INSERT INTO catalogue(item_name, price, product_desc,image_url,seller_id) VALUES($1,$2,$3,$4,$5)"
        newInputRows.forEach((oneRow)=>{
            oneRow.pop()
            dbPool.query(queryText, oneRow, (err, res)=>{
                if(err){
                    callback(err, null)
                    return
                }
            })
        })

        let queryText1 ="UPDATE catalogue SET item_name=$1, price=$2, product_desc=$3,image_url=$4,seller_id=$5 WHERE item_id=$6"
        editInputRows.forEach((oneRow)=>{
            dbPool.query(queryText, oneRow, (err, res)=>{
                if(err){
                    callback(err, null)
                    return
                }
            })
        })

        callback(null, true)
    }


    let getSellerItems = (seller_id, address, callback)=>{
        let digits = ['0','1','2','3','4','5','6','7','8','9']
        let queryText = "SELECT * FROM catalogue WHERE seller_id=$1"

        if(address&&digits.includes(address[0])){
            queryText += " AND item_id="+address

        } else if (address&&address=="new") {
            queryText += " AND 0=1"
        }

        dbPool.query(queryText, [seller_id], (err, res)=>{
            callback(err, res)
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
        let returnedValues = []
        let tables = ['catalogue', 'sales', 'seller_tracker', 'sellers']
        let seller_username;

        tables.forEach((table)=>{
            let queryText = `SELECT * FROM ${table} WHERE seller_id=$1`
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

        let queryText2 = `SELECT * FROM sales_${saleID}`
        allQueries.push(dbPool.query(queryText1, [saleID])
            .then(res=>res)
            .catch(err=>{callback(err, null)}))

        Promise.all(allQueries)
            .then(res=>callback(null, res))
            .catch(err=>{callback(err, null)})

    }

    let updateSaleInfo = (inputRows,saleID,sellerID,saleInfo,callback)=>{
        let allQueries = []

        let queryText = "UPDATE sales SET time_live=$1, sale_name=$2, sale_desc=$3 WHERE sale_id=$4 AND seller_id=$5"
        allQueries.push(dbPool.query(queryText, saleInfo)
                .then(res=>res)
                .catch(err=>callback(err, null)))

        let table = "sales_"+saleID
        let queryText1 = `DELETE FROM ${table}`
        dbPool.query(queryText1)
            .then(res=>{
                inputRows.forEach((item)=>{
                    let queryText2 =`INSERT INTO ${table} (item_id, quantity,max_order) VALUES ($1,$2,$3)`
                    allQueries.push(dbPool.query(queryText2, item)
                                        .then(res=>res)
                                        .catch(err=>{callback(err, null)}))
        })

            })
            .catch(err=>{callback(err, null)})



        Promise.all(allQueries)
            .then(res=>{callback(null, res)})
            .catch(err=>{callback(err, null)})

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
        updateSaleInfo

    }
}