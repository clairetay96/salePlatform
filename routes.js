module.exports = (app, allModels) => {
    const noUserControllerFunc = require('./controllers/neutral')(allModels)

    //homepage
    app.get("/", noUserControllerFunc.renderHome)

    //log in functionality
    app.post("/login", noUserControllerFunc.logIn)

    //render new account page
    app.get("/newacc", noUserControllerFunc.renderSignUp)

    //
    app.post("/newacc/", noUserControllerFunc.postSignUp)

};