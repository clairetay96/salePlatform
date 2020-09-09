import React from 'react'

//logout button - sends request to server
class Logout extends React.Component {
    render() {
        return (
            <form method="POST" action="/logout">
                <input id="log-button" type="submit" value="Log Out"/>
            </form>
            )

    }
}

export default Logout