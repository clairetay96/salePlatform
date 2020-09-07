module.exports = (dbPool) =>{

    let newUser = (values, callback) =>{
        let queryText = "SELECT username FROM (SELECT username FROM sellers UNION ALL SELECT username FROM buyers) AS all_users WHERE username=$1"
        console.log(queryText)
        dbPool.query(queryText, [values[0]], (err, res)=>{
            if(err){
                console.log(err.message, "----ERROR MESSAGE")
                callback(err, null,null)

            } else if(res.rows.length>0){
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
        let queryText = "SELECT * FROM "+values[2]+" WHERE username=$1"
        dbPool.query(queryText, [values[0]], (err, res)=>{
            if(err){
                console.log(err.message)
                callback(err, null,null,null)
            } else if(res&&res.rows.length==0){
                callback(err, res, false, false)
            } else {
                callback(err, res, true, res.rows[0].password==values[1])
            }
        })
    }


    return {
        newUser,
        logInVerify
    }
}