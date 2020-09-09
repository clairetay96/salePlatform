import React from 'react'
import LogOutButton from './logout.jsx'

class NavBar extends React.Component {
    render () {
        //log in button
        let LogButton = (<a href="/"><button id="log-button">Log in</button></a>)
        //
        let editAcc;

        //if already logged in, have a log out button in the nav bar instead. And add an option to manage account (edit user)
        if(this.props.loggedIn==true){
            LogButton = <LogOutButton />
            editAcc = <div className="edit-acc"><a href="/user/edit">Manage Account</a></div>

        }
        //links to browse sellers and sales
        let browse = <div className="browse"><a href="/seller">Sellers</a><a href="/sales">Sales</a></div>

        return (
            <div id="nav-bar">
                <div id="nav-logo"><a href="/"><img src="/hayaku_logo_white.png"/></a></div>
                {browse}
                {editAcc}
                <div id="log-button-div">{LogButton}</div>
            </div>
        )
    }
}

export default NavBar