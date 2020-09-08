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

        let date_slicer = (date) =>{
            let year = date.slice(0,2)
            let month = date.slice(5,7)
            let day = date.slice(8,10)
            let time = date.slice(11,16)

            return day+"/"+month+"/"+year+" "+time
        }

        let followButton = <TrackSeller seller_username={seller_username} />
        if(isFollowing){
            followButton = <UntrackSeller seller_username={seller_username} />
        }

        let allItemsHTML = allItems.map((item)=>{
            return (<div className="catalogue-card">
                    <img src={item.image_url}/>
                        <div className="catalogue-card-header"><h6>{item.item_name}</h6></div>
                        <div className="catalogue-card-desc">{item.product_desc}</div>
                        <div className="catalogue-card-desc"><b>${item.price}</b></div>
                        </div>)
        })
        let allSalesHTML = allSales.map((item)=>{
            let saleLink = "/seller/"+seller_username+"/sales/" + item.sale_id + "/"
            return <tr>
                <td><a href={saleLink}>{item.sale_name}</a></td>
                <td className="text-right">{date_slicer(item.time_live)}</td>
                </tr>
        })

        let allSalesTable = (
            <table>
            {allSalesHTML}
            </table>)

        return (
            <html>
                <Head additionalStyle={{otherScripts: ["/sellerPage.css"]}}/>

                <body>
                    <NavBar loggedIn={loggedIn}/>
                    <div className="container">
                    <div className="page-title">
                        <h1>{seller_username}</h1>
                            {followButton}
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="catalogue">
                                <h3>Catalogue</h3>
                                <div className="catalogue-items">
                                    {allItemsHTML}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                        <div className="upcoming-sales">
                            <h3>Upcoming Sales</h3>
                            {allSalesTable}
                        </div>
                        </div>
                    </div>
                    </div>
                </body>
            </html>
            )
    }
}

module.exports = SellerPage