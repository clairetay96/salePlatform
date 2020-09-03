const sha256 = require('js-sha256')
module.exports = (allModels) => {

    const db_neutral =allModels.neutral

    let renderHome = (request, response) =>{
        response.render('homepage')
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
                response.send("Log in successful!")
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

    return {
        renderHome,
        renderSignUp,
        postSignUp,
        logIn
    }

}