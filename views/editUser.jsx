import React from 'react'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'

class EditUser extends React.Component {
    render() {
        let userInfo = this.props.rows[0]
        let username = userInfo.username
        let role = userInfo.role
        let originalPassword = userInfo.password
        let details = userInfo.details
        let loggedIn = true

        return (
            <html>
                <Head additionalStyle={{otherScripts: ["/styles/forms.css"]}}/>
                <body>
                <NavBar loggedIn={loggedIn}/>
                <div className="container">
                    <div class="form-title">
                    <h1>Edit Account</h1>
                    <p>Enter your old password to make changes to {username}'s account.</p>
                    </div>
                    <div className="additional-deets">
                    <form method="POST" action="/user/edit?_method=PUT">
                        <label>Old Password</label>
                        <input type="password" name="old_password" required/>
                        <button type="button" id="new-password-option">Set a new password</button>
                        <div id="new-password">
                            <label>New Password</label>
                            <input type="password" name="new_password"/>
                        </div>
                        <label>Additional Details</label><textarea name="details" defaultValue={details}/>
                        <div class="submit-button">
                        <input type="submit" value="Edit User"/>
                        </div>
                    </form>
                    </div>
                    <script src="/scripts/editUser.js"></script>
                </div>
                </body>
            </html>)
    }
}

module.exports = EditUser