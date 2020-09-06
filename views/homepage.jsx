import React from 'react'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'

class Homepage extends React.Component {
    render() {
        return (
            <html>
                <Head additionalStyle={{otherScripts: ["/homepage.css"]}}/>
                <body>
                    <div className="row">
                        <div className="col-md-6 logo">
                        <h1>Hayaku!</h1>
                        <p>The one-stop solution to limited edition product drops, for sellers and product enthusiasts.</p>
                        </div>

                        <div className="col-md-6 login">
                            <div className="col-md-10 login-items">
                                <form method="POST" action="/login">
                                    <input type="text" name="username" placeholder="Username"/>
                                    <input type="password" name="password" placeholder="Password"/>
                                    <select name="role">
                                    <option disabled selected value>  --Role--  </option>
                                        <option value="buyers">Buyer</option>
                                        <option value="sellers">Seller</option>
                                        </select>
                                    <input type="submit" value="Log In"/>
                                </form>
                                <a href="/user/new"><button className="signup">Sign Up</button></a>

                            </div>
                        </div>
                    </div>
                </body>
            </html>)
    }
}

module.exports = Homepage