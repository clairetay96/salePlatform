import React from 'react'

class Logout extends React.Component {
    render() {
        return (
            <form method="POST" action="/logout">
                <input type="submit" value="Logout"/>
            </form>
            )

    }
}

export default Logout