
const sha256 = require('js-sha256')
const SALT = "stay toasty"

module.exports = (allModels) => {

    const db_neutral = allModels.neutral
    const db_seller = allModels.seller
    const db_buyer = allModels.buyer

    loggedIn = (request) =>{
        return sha256(request.cookies['userID']+SALT+request.cookies['role'])==request.cookies['sessionCookie']
    }

    let isBuyer = (request) => {
        if(request.cookies['role']=="buyers"){
            return request.cookies['userID']
        }
        return null
    }

    let renderHome = (request, response) =>{
        if (loggedIn(request)) {
            if(request.cookies['role']=="sellers"){
                db_seller.sellerInfoFromID(request.cookies['userID'], (err, sellerInfo, placeholder)=>{
                    if(err){
                        console.log(err.message)
                        response.send("Error occurred.")
                    } else {
                        response.render('sellerhp', sellerInfo)
                    }

                })
            } else if(request.cookies['role']=="buyers"){
                db_buyer.buyerInfoFromID(request.cookies['userID'], (err, userInfo)=>{
                    if(err){
                        console.log(err.message)
                        response.send("Error occurred.")
                    } else {
                        response.render('buyerhp', userInfo)
                    }
                })
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
        if(!loggedIn(request)) {
            response.render('signup')
        } else {
            response.send("You are logged in. Log out to create a new account.")
        }

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

    let saleWaitingRoom = (request, response)=>{
        let saleID = request.params.id
        let seller_username = request.params.username
        db_seller.getSaleInfo(saleID, seller_username, isBuyer(request), (err, saleInfo, saleItems, isFollowing)=>{
            if(err){
                console.log(err.message)
                response.send("Error occurred.")
            } else if (saleInfo.rows.length==0||saleItems.rows.length==0){
                response.send("This sale does not exist - did you get the username/sale ID right?")
            }else {
                response.render("saleWaitRoom", {sale: saleInfo, items: saleItems, seller_username, isFollowing})
            }
        })
    }

    let sellerPage = (request, response)=>{
        let seller_username = request.params.username
        db_seller.sellerInfo(seller_username, isBuyer(request), (err, sellerInfo, isFollowing)=>{
            if(err){
                console.log(err.message)
                response.send("Error occured.")
            } else {
                sellerInfo.isFollowing = isFollowing
                sellerInfo.seller_username = seller_username
                response.render('sellerPage', sellerInfo)
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
        loggedIn,
        isBuyer,
        renderHome,
        renderSignUp,
        postSignUp,
        logIn,
        logout,
        saleWaitingRoom,
        sellerPage
    }

}