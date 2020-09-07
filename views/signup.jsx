import React from 'react'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'

class SignUp extends React.Component {
    render() {
        let message;
        if(this.props.usernameTaken){
            message = <p>That usename was taken.</p>

        }
        let loggedIn = false

        return (
            <html>
                <Head />
                <body>
                <NavBar loggedIn={loggedIn}/>
                    <form method="POST" action="/user/new/">
                        New Username: <input type="text" name="username"/> <br/><br/>
                        {message}
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