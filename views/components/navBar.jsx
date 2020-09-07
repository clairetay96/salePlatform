import React from 'react'
import LogOutButton from './logout.jsx'

class NavBar extends React.Component {
    render () {
        let LogButton = (<a href="/"><button id="log-button">Log in</button></a>)
        if(this.props.loggedIn==true){
            LogButton = <LogOutButton />

        }
        return (
            <div id="nav-bar">
                <div id="nav-logo"><a href="/"><h3>Hayaku!</h3></a></div>
                <div id="log-button-div">{LogButton}</div>
            </div>
        )
    }
}

export default NavBar