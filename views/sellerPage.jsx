import React from 'react'
import CatalogueItemInput from './components/catalogueInput.jsx'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'
import TrackSeller from './components/trackSellerButton.jsx'
import UntrackSeller from './components/untrackSellerButton.jsx'

class SellerPage extends React.Component {
    render() {
        let allItems = this.props.catalogue.rows
        let allSales = this.props.sales.rows
        let seller_username = this.props.seller_username
        let isFollowing = this.props.isFollowing
        let loggedIn = this.props.loggedIn

        let followButton = <TrackSeller seller_username={seller_username} />
        if(isFollowing){
            followButton = <UntrackSeller seller_username={seller_username} />
        }

        let allItemsHTML = allItems.map((item)=>{
            return <li>{item.item_name}</li>
        })
        let allSalesHTML = allSales.map((item)=>{
            let saleLink = "sales/" + item.sale_id + "/"
            return <li><a href={saleLink}>{item.sale_id}</a></li>
        })

        return (
            <html>
                <Head />
                <NavBar loggedIn={loggedIn}/>

                <body>
                    <div>
                    {followButton}
                    Items:
                        {allItemsHTML}
                        <br/>
                    Sales:
                        {allSalesHTML}
                    </div>
                </body>
            </html>
            )
    }
}

module.exports = SellerPage