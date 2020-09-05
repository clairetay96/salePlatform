
const sha256 = require('js-sha256')
const SALT = "stay toasty"

module.exports = (allModels) => {

    const db_neutral = allModels.neutral
    const db_seller = allModels.seller
    const db_buyer = allModels.buyer

    let renderHome = (request, response) =>{
        if (sha256(request.cookies['userID']+SALT+request.cookies['role'])==request.cookies['sessionCookie']) {
            if(request.cookies['role']=="sellers"){
                db_seller.sellerInfoFromID(request.cookies['userID'], (err, catalogue, sales)=>{
                    if(err){
                        console.log(err.message)
                        response.send("Error occurred.")
                    } else {
                        response.render('sellerhp', {catalogue, sales})
                    }

                })
            } else if(request.cookies['role']=="buyers"){
                response.send("Buyer logged in.")
            }
        } else {
            response.render('homepage')
        }
    }

    let logIn = (request, response) =>{
        x = request.body
        values = [x.username, sha256(x.password), x.role]
        db_neutral.logInVerify(values, (err, res, usernameExists, logInSuccess)=>{
            if(err){
                console.log(err.message)
                response.send("Error occurred.")
            } else if (!usernameExists) {
                response.send("Username does not exist. Create an account <a href='/newacc'>here</a>.")
            } else if(!logInSuccess){
                response.send("Incorrect password.")
            } else if(logInSuccess) {
                let role = x.role.slice(0, x.role.length-1)
                response.cookie('userID', res.rows[0][role+'_id'])
                response.cookie('role', res.rows[0].role)
                response.cookie('sessionCookie', sha256(res.rows[0][role+'_id']+SALT+res.rows[0].role))
                response.redirect("/")
            }

        })


    }

    let renderSignUp = (request, response) => {
        response.render('signup')
    }

    let postSignUp = (request, response) => {
        let x = request.body
        let values = [x.username, sha256(x.password), x.details, x.role]
        db_neutral.newUser(values, (err, res, usernameExists)=>{
            if(err){
                console.log(err.message)
                response.send("Error occurred.")
            } else if (usernameExists) {
                response.redirect('/newacc')
            } else {
                response.send('Sign up successful - <a href="/">log in at the homepage</a>.')
            }
        })

    }

    let logout = (request, response) =>{
        response.clearCookie('userID')
        response.clearCookie('role')
        response.clearCookie('sessionCookie')
        response.redirect("/")
    }

    return {
        renderHome,
        renderSignUp,
        postSignUp,
        logIn,
        logout
    }

}