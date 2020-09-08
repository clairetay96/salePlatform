import React from 'react'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'

class CatalogueForm extends React.Component {
    render() {
        let loggedIn = this.props.loggedIn
        let message = this.props.message

        let messageStyle = {
            margin: '20px auto',
            width: '60%',
            textAlign: 'center'
        }


        return (
            <html>
                <Head />
                <body>
                <NavBar loggedIn={loggedIn}/>
                    <div class="container">
                        <div style={messageStyle}>
                        {message}
                        <p>Click <a href="/">here</a> to go to the homepage</p>
                        </div>

                    </div>
                        }
                </body>
            </html>
            )
    }
}

module.exports = CatalogueForm