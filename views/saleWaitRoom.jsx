import React from 'react'
import LogoutButton from './components/logout.jsx'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'
import TrackSaleButton from './components/trackSaleButton.jsx'
import UntrackSaleButton from './components/untrackSaleButton.jsx'

class SaleWaitRoom extends React.Component {
    render() {
        let allItems = this.props.items.rows
        let saleInfo = this.props.sale.rows[0]
        let saleID = saleInfo.sale_id
        let seller_username = this.props.seller_username
        let isFollowing = this.props.isFollowing
        let loggedIn = this.props.loggedIn

        let followSaleButton = <TrackSaleButton seller_username={seller_username} sale_id={saleID}/>;
        if(isFollowing){
            followSaleButton = <UntrackSaleButton seller_username={seller_username} sale_id={saleID}/>
        }

        let allItemsHTML = allItems.map((item)=>{
            return <li>{item.item_name}</li>
        })

        return (
            <html>
                <Head />
                <body>
                <NavBar loggedIn={loggedIn}/>
                    <div>
                        {followSaleButton}
                        <h1>Waiting Room for Sale!</h1>
                        Items available:
                        <ul>
                            {allItemsHTML}
                        </ul>
                        Button goes live at: <span id="date-req" className="livetime">{saleInfo.time_live}<span className="countdown"></span></span><br/>
                        <button id="liveSale">Click here to enter sale</button>
                        <script src="/saleWaitRoom.js"></script>
                        <script src="/countdown.js"></script>
                    </div>
                </body>
            </html>
            )
    }
}

module.exports = SaleWaitRoom