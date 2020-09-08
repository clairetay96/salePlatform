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
                <Head additionalStyle={{otherScripts: ["/forms.css"]}}/>
                <body>
                <NavBar loggedIn={loggedIn}/>
                <div className="container">
                    <div class="form-title">
                    <h1>Create an account</h1>
                    </div>
                    <div className="additional-deets">
                    <form method="POST" action="/user/new/">
                        <label>New Username</label>
                        <input type="text" name="username" autocomplete="off" required/>
                        {message}
                        <label>New Password</label><input type="password" name="password" required/>
                        <label>Role</label>
                        <select name="role">
                            <option disabled selected value>  --Select an option--  </option>
                            <option value="buyers">Buyer</option>
                            <option value="sellers">Seller</option>
                            </select>
                        <label>Additional Details</label><textarea name="details" />
                        <div class="submit-button">
                        <input type="submit"/>
                        </div>
                    </form>
                    </div>
                </div>
                </body>
            </html>)
    }
}

module.exports = SignUp