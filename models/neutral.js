module.exports = (dbPool) =>{

    let newUser = (values, callback) =>{
        let queryText = "SELECT username FROM (SELECT username FROM sellers UNION ALL SELECT username FROM buyers) AS all_users WHERE username=$1"
        dbPool.query(queryText, [values[0]], (err, res)=>{
            if(err){
                console.log(err.message, "----ERROR MESSAGE")
                callback(err, null,null)
            } else if(res.rows.length>0){ //if username exists in db, do not add input to db
                callback(err, res, true)
            } else {
                let queryText2 = "INSERT INTO "+values[3]+" (username, password, details, role) VALUES ($1,$2,$3,$4)"
                dbPool.query(queryText2, values, (err1, res1)=>{
                    callback(err1, res1, false)
                })
            }
        })
    }

    let logInVerify = (values, callback) =>{
        //checks both sellers and buyers for username/password combo
        let queryText = "SELECT * FROM (SELECT seller_id AS user_id, username,password,role FROM sellers UNION ALL SELECT buyer_id AS user_id, username,password,role FROM buyers) AS all_users WHERE username=$1"
        dbPool.query(queryText, [values[0]], (err, res)=>{
            if(err){
                console.log(err.message)
                callback(err, null,null,null)
            } else if(res.rows.length==0){
                callback(err, res, false, false)
            } else {
                callback(err, res, true, res.rows[0].password==values[1])
            }
        })
    }



    let getAllSales = (isBuyerID, callback) =>{
        let queryText = "SELECT sale_id FROM sales"
        dbPool.query(queryText)
            .then((res)=>{
                let allQueries = []
                if(isBuyerID) {
                    res.rows.forEach((item)=>{
                        let saleID = item.sale_id
                        let table = "sales_"+saleID
                        //joins sales, sellers, item, and sales_{sale_id} and sale_tracker for each sale
                        let queryText1 = `SELECT fubar.sale_id, seller_id, sale_name, sale_desc, time_live, quantity, item_id, item_name, price,  image_url, username, buyer_id,sold_out FROM (SELECT bar.seller_id, sale_id, sale_name, sale_desc, item_name, quantity, price, time_live, image_url, username,item_id,sold_out FROM (SELECT foo.sale_id, foo.seller_id,sale_name, sale_desc, time_live, foo.item_id, item_name, image_url, price,quantity,sold_out FROM (SELECT sales.sale_id, sale_name, sale_desc, sold_out,time_live, item_id, quantity,seller_id FROM sales INNER JOIN ${table} ON sales.sale_id=${table}.sale_id) AS foo INNER JOIN catalogue ON foo.item_id=catalogue.item_id) AS bar INNER JOIN sellers ON bar.seller_id=sellers.seller_id) AS fubar LEFT JOIN (SELECT sale_id, buyer_id FROM sale_tracker WHERE buyer_id=$1) AS buyer_rel ON fubar.sale_id=buyer_rel.sale_id`
                        allQueries.push(
                            dbPool.query(queryText1, [isBuyerID])
                                .then(res=>res)
                                .catch(err=>{callback(err, null)})
                                )
                    })

                    Promise.all(allQueries)
                        .then(res=>{callback(null,res)})
                        .catch(err=>{callback(err,null)})

                } else {
                    res.rows.forEach((item)=>{
                        let saleID = item.sale_id
                        let table="sales_"+saleID
                        //joins sales, sellers, item, and sales_{sale_id} for each sale
                        let queryText1 = `SELECT bar.seller_id, sale_id, sale_name, sale_desc, item_name, quantity, price, time_live, image_url, username,item_id,sold_out FROM (SELECT foo.sale_id, foo.seller_id,sale_name, sale_desc, time_live, foo.item_id, item_name, image_url, price,quantity,sold_out FROM (SELECT sales.sale_id, sale_name, sale_desc, time_live, item_id, quantity,seller_id,sold_out FROM sales INNER JOIN ${table} ON sales.sale_id=${table}.sale_id) AS foo INNER JOIN catalogue ON foo.item_id=catalogue.item_id) AS bar INNER JOIN sellers ON bar.seller_id=sellers.seller_id`
                        allQueries.push(
                            dbPool.query(queryText1)
                                .then(res=>res)
                                .catch(err=>{callback(err, null)})
                                )
                    })
                    Promise.all(allQueries)
                        .then(res=>{callback(null,res)})
                        .catch(err=>{callback(err,null)})

                }

                 })
            .catch(err=>{callback(err, null)})

    }

    //gets user info to populate edit user form
    let getUserInfo = (userID, queryTable, callback) =>{
        let role = queryTable.slice(0, queryTable.length-1) + "_id"
        let queryText = "SELECT * FROM "+queryTable+" WHERE "+role+"=$1"
        dbPool.query(queryText,[userID])
            .then(res=> {callback(null, res)})
            .catch(err=>{callback(err,null)})
    }

    //updates user info if old password entered was correct.
    let putUserInfo = (userID, queryTable, newInfo, oldPassword, passwordChange, callback)=>{
        let role = queryTable.slice(0, queryTable.length-1) + "_id"
        let queryText = "SELECT * FROM "+queryTable+" WHERE "+role+"=$1 AND password=$2"
        dbPool.query(queryText, [userID, oldPassword])
            .then(res => {
                if (res.rowCount == 0) {
                    callback(null, false, null)
                } else {
                    if(passwordChange) {
                        let queryText1 = "UPDATE "+queryTable+" SET password=$1, details=$2 WHERE "+role+"=$3"
                        dbPool.query(queryText1, newInfo)
                            .then(res=>{callback(null, true, res)})
                            .catch(err=>{callback(err, true, null)})

                    } else {
                        let queryText1 = "UPDATE "+queryTable+" SET details=$1 WHERE "+role+"=$2"
                        dbPool.query(queryText1, newInfo)
                            .then(res=>{callback(null, true, res)})
                            .catch(err=>{callback(err, true, null)})
                    }

                }
            })
            .catch(err=>{callback(err,null,null)})



    }


    return {
        newUser,
        logInVerify,
        getAllSales,
        getUserInfo,
        putUserInfo
    }
}