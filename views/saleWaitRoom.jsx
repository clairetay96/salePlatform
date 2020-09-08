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
        let saleName = saleInfo.sale_name
        let saleDesc = saleInfo.sale_desc
        let seller_username = this.props.seller_username
        let isFollowing = this.props.isFollowing
        let loggedIn = this.props.loggedIn

        let sellerPageURL = "/seller/"+seller_username

        let followSaleButton = <TrackSaleButton seller_username={seller_username} sale_id={saleID}/>;
        if(isFollowing){
            followSaleButton = <UntrackSaleButton seller_username={seller_username} sale_id={saleID}/>
        }

        let allItemsHTML = allItems.map((item)=>{
            return (
                <div className="row sale-item">
                    <div className="col-md-4">
                        <img src={item.image_url}/>
                    </div>
                    <div className="col-md-5">
                        <h5>{item.item_name}</h5>
                        <div className="desc-font">
                        {item.product_desc}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <h5>${item.price}</h5>
                        <div className="desc-font">
                        Qty Available: {item.quantity}<br/>
                        Max Order: {item.max_order}
                        </div>
                    </div>

                </div>)
        })

        return (
            <html>
                <Head additionalStyle={{otherScripts: ["/saleRooms.css"]}}/>
                <body>
                <NavBar loggedIn={loggedIn}/>
                    <div className="container">
                        <div className="header-div">

                            <h1>{saleName}</h1>
                            <h5>by <a href={sellerPageURL}>{seller_username}</a></h5>
                            <p>{saleDesc}</p>
                            {followSaleButton}
                        </div>


                        <div className="items">
                                {allItemsHTML}
                        </div>

                        <div className="notices">
                        You'll be quicker to checkout if you know what you want before the sale starts.<br/> Ensure your card details in your profile are correct and up to date to avoid unexpected hold ups.
                        </div>

                        <div className="counter-feature">

                        <div className="countdown"></div>
                        <button id="liveSale">Click here to enter sale</button>
                        <p className="desc-font text-center">Button goes live at <span id="date-req" className="livetime">{saleInfo.time_live}</span></p>

                        </div>


                        <script src="/saleWaitRoom.js"></script>
                    </div>
                </body>
            </html>
            )
    }
}

module.exports = SaleWaitRoom