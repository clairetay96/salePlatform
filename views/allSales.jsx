import React from 'react'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'
import TrackSale from './components/trackSaleButton.jsx'
import UntrackSale from './components/untrackSaleButton.jsx'

class AllSales extends React.Component {
    render() {
        let loggedIn = this.props.loggedIn
        let sales = this.props.sales

        let salesHTML = sales.map((res)=>{
            let all_items = res.rows
            if(all_items.length>0){
                let sellerName = all_items[0].username
                let saleID = all_items[0].sale_id
                let saleName = all_items[0].sale_name
                let time_live = all_items[0].time_live
                let sold_out = all_items[0].sold_out
                console.log(res)
                let now = new Date()

                let sellerURL = "/seller/"+sellerName
                let timeLive = "Live at "+time_live.slice(0,10) + " " + time_live.slice(11,16)
                let saleURL = "/seller/"+sellerName+"/sales/"+saleID+"/"


                if(Date.parse(time_live+"+08:00") < now){
                    saleURL = "/seller/"+sellerName+"/sales/"+saleID+"/live"
                    timeLive = "LIVE"
                    if(sold_out){
                        timeLive="CLOSED"
                    }
                }


                let followButton = <TrackSale seller_username={sellerName} sale_id={saleID}/>
                if(all_items[0].buyer_id){
                    followButton = <UntrackSale seller_username={sellerName} sale_id={saleID}/>
                }

                let item_cards = []

                for(let i=0;i<all_items.length;i++){
                    if(i==3){
                        break
                    }
                    item_cards.push(<div className="image-cards">
                        <img src={all_items[i].image_url}/>
                            <div className="item-desc">{all_items[i].item_name}<br/>
                                ${all_items[i].price}  Qty: {all_items[i].quantity}
                            </div>
                        </div>)
                }

                return (<div className="indiv-seller larger">
                            <div className="card-title">
                                <div className="userInfo">
                                    <h3 className="d-inline"><a href={saleURL}>{saleName}</a></h3>
                                    <div className="d-inline live-time">
                                        {timeLive}
                                    </div>
                                    <p>by <a href={sellerURL}>{sellerName}</a></p>
                                </div>
                                {followButton}
                            </div>
                            <div className="userInfo">
                                <h6>Items Available</h6>
                            </div>
                            <div className="item-cards">
                                {item_cards}
                            </div>
                        </div>)

            }
        })



        return (
            <html>
                <Head additionalStyle={{otherScripts: ["/browse.css"]}}/>
                <body>
                <NavBar loggedIn={loggedIn}/>
                    <div className="container">

                    <div className="browse-items">
                    <h1>Sales</h1>
                    {salesHTML}

                    </div>

                    </div>
                </body>
            </html>
            )
    }
}

module.exports = AllSales