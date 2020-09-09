import React from 'react'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'
import TrackSale from './components/trackSaleButton.jsx'
import UntrackSale from './components/untrackSaleButton.jsx'

class AllSales extends React.Component {
    render() {
        let loggedIn = this.props.loggedIn
        let sales = this.props.sales //this is an array containing objects - each object represents a sale. The "rows" in each object refers to an array that has one item per element

        //make a div for each sale
        let salesHTML = sales.map((res)=>{
            let all_items = res.rows

            //only generate a sale card if there are items on sale
            if(all_items.length>0){

                let sellerName = all_items[0].username
                let saleID = all_items[0].sale_id
                let saleName = all_items[0].sale_name
                let time_live = all_items[0].time_live
                let sold_out = all_items[0].sold_out

                let now = new Date()

                //URLs for each sale - to seller and sale
                let sellerURL = "/seller/"+sellerName
                let saleURL = "/seller/"+sellerName+"/sales/"+saleID+"/"
                let timeLive = "Live at "+time_live.slice(0,10) + " " + time_live.slice(11,16)

                //tell the user if the sale is live or closed. If live, it links directly to the live page. If closed, links to the sale waiting room.
                if(Date.parse(time_live+"+08:00") < now){
                    saleURL = "/seller/"+sellerName+"/sales/"+saleID+"/live"
                    timeLive = "LIVE"
                    if(sold_out){
                        timeLive="CLOSED"
                        saleURL = "/seller/"+sellerName+"/sales/"+saleID+"/"
                    }
                }


                let followButton = <TrackSale seller_username={sellerName} sale_id={saleID}/>
                //buyer_id is null if the logged in buyer does not track the sale, or undefined if a buyer is not logged in. Otherwise, it is equivalent to the buyer id of the buyer who is logged in
                if(all_items[0].buyer_id){
                    followButton = <UntrackSale seller_username={sellerName} sale_id={saleID}/>
                }

                //for each sale, a maximum of 3 items will be displayed
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