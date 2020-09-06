import React from 'react'
import LogOutButton from './logout.jsx'

class NavBar extends React.Component {
    render () {
        let LogButton = <a href="/"><button id="login-button">Log in</button></a>
        if(this.props.loggedIn){
            LogButton = <LogOutButton />

        }
        return (
            <div id="nav-bar">
                {LogButton}
            <div>
        )
    }
}

export default NavBar