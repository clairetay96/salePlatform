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
            return (<div>
                    <div><a href={sellerPage}>{item.username}</a></div>
                    <form method="POST" action={untrackURL}>
                        <input type="submit" value="Untrack"/>
                    </form>
                </div>)
        })

        let trackedSaleData = buyersSalesTr.map((item)=>{
            let now = new Date()
            let dropDate = Date.parse(item.time_live)
            let toSaleButton;

            if(now >= dropDate){
                let liveSaleURL = "/seller/"+item.seller_username+"/sales/"+item.sale_id+"/live"
                toSaleButton = <a href={liveSaleURL}><button>TO LIVE SALE</button></a>

            } else {
                let waitRoomURL= "/seller/"+item.seller_username+"/sales/"+item.sale_id+"/"
                toSaleButton = <a href={waitRoomURL}><button>To waiting room</button></a>

            }

            let untrackURL = "/seller/"+item.seller_username+"/sales/"+item.sale_id+"/track?_method=DELETE"
            let sellerURL = "/seller/"+item.seller_username+"/"

            return (
                <tr>
                    <td><a href={untrackURL}>{item.seller_username}</a></td>
                     <td>{item.sale_name}</td>
                     <td><div className="countdown"><span className="timer"></span><span className="livetime" style={hiddenStyle}>{item.time_live}</span></div></td>
                     <td>{toSaleButton}</td>
                     <td><form method="POST" action={untrackURL}><input type="submit" value="x"/></form></td>
                </tr>)
        })

        let trackedSaleHTML = (
            <table>
                <tr>
                    <th>Seller</th>
                    <th>Sale</th>
                    <th>Time to sale</th>
                    <th>Go to sale</th>
                    <th>untrack sale</th>
                </tr>
                {trackedSaleData}
            </table>)



        let ordersData = buyersOrders.map((item)=>{
            let orderURL = "/orders/"+item.order_id
            return (
                <tr className="table-row-link">
                    <td>{item.sale_name}</td>
                    <td>{item.username}</td>
                    <td className="order-ID">{item.order_id}</td>
                    <td>{item.timestamp.toString().slice(4,16)}</td>
                </tr>)
        })

        let ordersHTML = (
            <table className="orders">
                <tr>
                    <th>Sale</th>
                    <th>Seller</th>
                    <th>Order ID</th>
                    <th>Order Date</th>
                </tr>{ordersData}
            </table>)

        return (
            <html>
                <Head additionalStyle={{otherScripts: ["/buyerhp.css"]}}/>
                <body>
                <NavBar loggedIn={loggedIn}/>
                <h1>Welcome, {buyerUsername}.</h1>
                <div className="row">
                    <div className="col-md-5 offset-md-1">
                        <h4>Tracked Drops</h4>
                        {trackedSaleHTML}
                    </div>
                    <div className="col-md-5">
                        <div>
                            <h4>Tracked Sellers</h4>
                                {trackedSellerHTML}
                        </div>
                        <div>
                            <h4>Transaction History</h4>
                                {ordersHTML}
                        </div>
                    </div>
                </div>
                    <script src="/countdown.js"></script>
                </body>
            </html>)
    }
}

module.exports = Homepage