import React from 'react'

class SignUp extends React.Component {
    render() {
        return (
            <html>
                <head>
                    <title>Hayaku: Signup</title>
                </head>
                <body>
                    <form method="POST" action="/user/new/">
                        New Username: <input type="text" name="username"/> <br/><br/>
                        New Password: <input type="password" name="password"/> <br/><br/>
                        Role: <select name="role">
                            <option disabled selected value>  --Select an option--  </option>
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