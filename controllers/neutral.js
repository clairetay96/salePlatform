
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
                        response.render('message', {loggedIn: true, message: 'Error occured.'})
                    } else {
                        sellerInfo.loggedIn = true
                        response.render('sellerhp', sellerInfo)
                    }

                })
            } else if(request.cookies['role']=="buyers"){
                db_buyer.buyerInfoFromID(request.cookies['userID'], (err, userInfo)=>{
                    if(err){
                        console.log(err.message)
                        response.render('message', {loggedIn: true, message: 'Error occured.'})
                    } else {
                        userInfo.loggedIn = true
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
        values = [x.username, sha256(x.password)]
        db_neutral.logInVerify(values, (err, res, usernameExists, logInSuccess)=>{
            if(err){
                console.log(err.message)
                response.render('message', {loggedIn: false, message: 'Error occured.'})
            } else if (!usernameExists) {
                response.render('message', {loggedIn: false, message: 'This username does not exist.'})
            } else if(!logInSuccess){
                response.render('message', {loggedIn: false, message: 'Incorrect password.'})
            } else if(logInSuccess) {
                response.cookie('userID', res.rows[0]['user_id'])
                response.cookie('role', res.rows[0].role)
                response.cookie('sessionCookie', sha256(res.rows[0]['user_id']+SALT+res.rows[0].role))
                response.redirect("/")
            }

        })


    }

    let renderSignUp = (request, response) => {
        if(!loggedIn(request)) {
            response.render('signup')
        } else {
            response.render('message', {loggedIn: false, message: 'Error occured.'})
        }

    }

    let postSignUp = (request, response) => {
        let x = request.body
        let values = [x.username, sha256(x.password), x.details, x.role]
        db_neutral.newUser(values, (err, res, usernameExists)=>{
            if(err){
                console.log(err.message)
                response.render('message', {loggedIn: false, message: 'Error occurred.'})
            } else if (usernameExists) {
                response.render('signup', {usernameTaken: true})
            } else {
                response.render('message', {loggedIn: false, message: 'Sign up successful. Log in at the homepage.'})
            }
        })

    }

    let saleWaitingRoom = (request, response)=>{
        let saleID = request.params.id
        let seller_username = request.params.username
        db_seller.getSaleInfo(saleID, seller_username, isBuyer(request), (err, saleInfo, saleItems, isFollowing)=>{
            if(err){
                console.log(err.message)
                response.render('message', {loggedIn: loggedIn(request), message: 'Error occurred.'})
            } else if (!saleItems||saleInfo.rows.length==0||saleItems.rows.length==0){
                response.render('message', {loggedIn: false, message: 'This sale has been closed.'})
            }else {
                response.render("saleWaitRoom", {sale: saleInfo, items: saleItems, seller_username, isFollowing, loggedIn: loggedIn(request)})
            }
        })
    }

    let sellerPage = (request, response)=>{
        let seller_username = request.params.username
        db_seller.sellerInfo(seller_username, isBuyer(request), (err, sellerInfo, isFollowing)=>{
            if(err){
                console.log(err.message)
                response.render('message', {loggedIn: loggedIn(request), message: 'Error occurred.'})
            } else {
                sellerInfo.isFollowing = isFollowing
                sellerInfo.seller_username = seller_username
                sellerInfo.loggedIn = loggedIn(request)
                response.render('sellerPage', sellerInfo)
            }
        })
    }

    let getAllSellers = (request, response) =>{
        db_seller.getAllSellers(isBuyer(request), (err, res)=>{
            if(err){
                console.log(err.message)
                response.render('message', {loggedIn: loggedIn(request), message: 'Error occurred.'})
            } else {
                res.loggedIn = loggedIn(request)
                response.render('allSellers', res)
            }
        })

    }

    let getAllSales = (request, response ) =>{
        db_neutral.getAllSales(isBuyer(request), (err, res)=>{
            if(err){
                console.log(err.message)
                response.render('message', {loggedIn: loggedIn(request), message: 'Error occurred.'})
            } else {
                let allSaleInfo = {sales: res, loggedIn: loggedIn(request)}
                response.render('allSales', allSaleInfo)

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
        sellerPage,
        getAllSellers,
        getAllSales
    }

}