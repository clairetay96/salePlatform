import React from 'react'

class Homepage extends React.Component {
    render() {
        return (
            <html>
                <head>
                    <title>Hayaku</title>
                    <link rel="stylesheet" type="text/css" href="/homepage.css"/>
                </head>
                <body>
                    <div className="hp-flexcontainer">
                        <div>
                        Hayaku!
                        <p>Hyper-fast sales, made even quicker.</p>
                        </div>

                        <div>
                            <h3>Log in</h3>
                            <form method="POST" action="/login">
                                Username: <input type="text" name="username"/> <br/><br/>
                                Password: <input type="password" name="password"/> <br/><br/>
                                Role: <select name="role">
                                    <option value="buyers">Buyer</option>
                                    <option value="sellers">Seller</option>
                                    </select><br/><br/>
                                <input type="submit"/>
                            </form>
                            <div className="signup-prompt">
                                Don't have an account? <a href="/newacc">Sign up here.</a>
                            </div>
                        </div>
                    </div>
                </body>
            </html>)
    }
}

module.exports = Homepage