import React from 'react'

class SignUp extends React.Component {
    render() {
        return (
            <html>
                <head>
                    <title>Hayaku: Signup</title>
                    <link rel="stylesheet" type="text/css" href="/signup.css"/>
                </head>
                <body>
                    <form method="POST" action="/newacc/">
                        Username: <input type="text" name="username"/> <br/><br/>
                        Password: <input type="password" name="password"/> <br/><br/>
                        Role: <select name="role">
                            <option value="buyers">Buyer</option>
                            <option value="sellers">Seller</option>
                            </select><br/><br/>
                        Details: <textarea name="details" /><br/><br/>
                        <input type="submit"/>
                    </form>
                </body>
            </html>)
    }
}

module.exports = SignUp