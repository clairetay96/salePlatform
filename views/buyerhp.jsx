import React from 'react'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'

class Homepage extends React.Component {
    render() {
        let buyerUsername = this.props.buyer.rows[0].username
        let buyersSalesTr = this.props['sales_tracked'].rows

        buyersSalesTr.sort((a,b)=>{
            let date1 = Date.parse(a.time_live)
            let date2 = Date.parse(b.time_live)
            return date1-date2
        })


        let buyersSellersTr = this.props['sellers_tracked'].rows
        let buyersOrders = this.props.orders.rows
        let loggedIn = this.props.loggedIn

        let hiddenStyle= {display: 'none'}

        let trackedSellerHTML = buyersSellersTr.map((item)=>{
            let untrackURL = "/seller/"+item.username+"/track?_method=DELETE"
            let sellerPage="/seller/"+item.username+"/"
            return (<div className="tracked-seller">
                    <div><a href={sellerPage}>{item.username}</a></div>
                    <form method="POST" action={untrackURL}>
                        <input type="submit" value="Untrack"/>
                    </form>
                </div>)
        })

        let trackedSaleData = buyersSalesTr.map((item)=>{
            let now = new Date()
            let dropDate = Date.parse(item.time_live)
            let countdownHTML = <div className="countdown text-center"><span className="timer"></span><span className="livetime" style={hiddenStyle}>{item.time_live}</span></div>

            let toSaleButton;

            if(item.sold_out){
                toSaleButton = <div className="closed">CLOSED</div>
                countdownHTML = <div className="text-center">---</div>

            } else if(now >= dropDate){
                let liveSaleURL = "/seller/"+item.seller_username+"/sales/"+item.sale_id+"/live"
                toSaleButton = <a href={liveSaleURL}><button className="live">TO LIVE SALE</button></a>

            } else {
                let waitRoomURL= "/seller/"+item.seller_username+"/sales/"+item.sale_id+"/"
                toSaleButton = <a href={waitRoomURL}><button>To waiting room</button></a>

            }

            let untrackURL = "/seller/"+item.seller_username+"/sales/"+item.sale_id+"/track?_method=DELETE"
            let sellerURL = "/seller/"+item.seller_username+"/"
             console.log(item)

            return (
                <tr className="tracked-sale-row">
                    <td><a href={sellerURL}>{item.seller_username}</a></td>
                     <td>{item.sale_name}</td>
                     <td>{countdownHTML}</td>
                     <td>{toSaleButton}</td>
                     <td className="align-to-right"><form method="POST" action={untrackURL}><input type="submit" value="x"/></form></td>
                </tr>)
        })

        let trackedSaleHTML = (
            <table id="tracked-sales">
                <tr>
                    <th>Seller</th>
                    <th>Sale</th>
                    <th>Time to sale</th>
                    <th></th>
                    <th></th>
                </tr>
                {trackedSaleData}
            </table>)



        let ordersData = buyersOrders.map((item)=>{
            let orderURL = "/orders/"+item.order_id
            let sellerURL = "/seller/"+item.username
            return (
                <tr>
                    <td>{item.sale_name}</td>
                    <td><a href={sellerURL}>{item.username}</a></td>
                    <td className="text-center"><a href={orderURL}>{item.order_id}</a></td>
                    <td>{item.timestamp.toString().slice(4,16)}</td>
                </tr>)
        })

        let ordersHTML = (
            <table>
                <tr>
                    <th>Sale</th>
                    <th>Seller</th>
                    <th>Order ID</th>
                    <th>Order Date</th>
                </tr>{ordersData}
            </table>)

        return (
            <html>
                <Head additionalStyle={{otherScripts: ["/dashboards.css"]}}/>
                <body>
                <NavBar loggedIn={loggedIn}/>
                <div className="container">
                    <div className="welcome-header">
                        <h1>Welcome, {buyerUsername}.</h1>
                    </div>
                    <div className="row">
                        <div className="col-md-7">
                            <div className="tracked-drops">
                                <h4>Tracked Drops</h4>
                                {trackedSaleHTML}
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="tracked-sellers">
                                <h4>Tracked Sellers</h4>
                                    {trackedSellerHTML}
                            </div>
                            <div className="order-history">
                                <h4>Transaction History</h4>
                                    {ordersHTML}
                            </div>
                        </div>
                    </div>
                </div>
                    <script src="/dashboards.js"></script>
                </body>
            </html>)
    }
}

module.exports = Homepage