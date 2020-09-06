import React from 'react'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'

class Homepage extends React.Component {
    render() {
        let buyerUsername = this.props.buyer.rows[0].username
        let buyersSalesTr = this.props['sales_tracked'].rows
        let buyersSellersTr = this.props['sellers_tracked'].rows
        let buyersOrders = this.props.orders.rows
        let loggedIn = this.props.loggedIn

        let trackedSellerHTML = buyersSellersTr.map((item)=>{
            return <p>{item.username}, {item.sale_id}, <span className="livetime">{item.time_live}<span className="countdown"></span></span></p>
        })

        let trackedSaleData = buyersSalesTr.map((item)=>{
            return (<tr>
                <td>{item.seller_username}</td> <td>{item.sale_id}</td></tr>)
        })

        let trackedSaleHTML = <table><tr><th>Seller Username</th><th>Sale ID</th></tr>{trackedSaleData}</table>


        let ordersData = buyersOrders.map((item)=>{
            return <tr><td>{item.order_id}</td></tr>
        })

        let ordersHTML = <table><tr><th>Order ID</th></tr>{ordersData}</table>

        return (
            <html>
                <Head />
                <body>
                <NavBar loggedIn={loggedIn}/>
                <h1>Welcome, {buyerUsername}.</h1>
                <div className="row">
                    <div className="col-md-5">
                        <h4>Tracked Drops</h4>
                        {trackedSaleHTML}
                    </div>
                    <div className="col-md-5">
                        <div>
                            <h4>Tracked Sellers:</h4>
                                {trackedSellerHTML}
                        </div>
                        <div>
                            <h4>Order History:</h4>
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