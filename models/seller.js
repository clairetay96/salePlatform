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



    return {
        postCatalogueForm

    }
}