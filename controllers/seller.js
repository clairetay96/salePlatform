
const sha256 = require('js-sha256')
const SALT = "stay toasty"

module.exports = (allModels) => {

    const db_seller = allModels.seller

    let renderCatalogueForm = (request, response) =>{
        if (sha256(request.cookies['userID']+SALT+request.cookies['role'])==request.cookies['sessionCookie']&&request.cookies['role']=="sellers"){
            response.render('catalogueform', {seller_id: request.cookies['userID']})

        } else {
            response.send("You do not have permission to view this page.")
        }
    }

    let newCatalogueForm = (request, response) =>{
        let x = request.body
        let sellerID = x.seller_id
        if (sha256(request.cookies['userID']+SALT+request.cookies['role'])==request.cookies['sessionCookie']&&request.cookies['role']=="sellers"&&request.cookies['userID']==sellerID){
            let allInput = []
            Object.keys(x).forEach((item)=>{
                if(item.includes("item_name")){
                    let noKey = item.slice(9, item.length)
                    let inputValues = [x[item], x['price'+noKey],x['product_desc'+noKey],x['imgURL'+noKey], sellerID]
                    allInput.push(inputValues)
                }
            })
            db_seller.postCatalogueForm(allInput, (err, success)=>{
                if(err){
                    console.log(err.message)
                    response.send("Error occurred.")
                } else if (success) {
                    response.send("Database update successful.")
                }
            })

        } else {
            response.send("You do not have permission to add to catalogue.")
        }


    }


    return {
        renderCatalogueForm,
        newCatalogueForm

    }

}