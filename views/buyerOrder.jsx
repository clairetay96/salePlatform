import React from 'react'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'

class BuyerOrder extends React.Component {
    render() {
        let loggedIn = this.props.loggedIn
        let orderID = this.props.order_id
        let saleID = this.props.sale_id
        let seller_username = this.props.username
        let sale_name = this.props.sale_name
        let purchase = this.props.allItems
        let purchaseTime = this.props.timestamp.toString()
        let saleDropDate = this.props.time_live

        let sumTotal = 0

        //generate table rows for each item in the order, and tally sum of purchase
        let ordersRows = purchase.map((order)=>{
            sumTotal += parseFloat(order.amt_charged)
            return (
                    <tr>
                    <td>{order.item_name}</td>
                    <td className="text-center">{order.quantity}</td>
                    <td className="text-center">{order.amt_charged}</td>
                    </tr>
                    )

        })


        let orderTable = (
            <table>
                <tr>
                    <th>Item</th>
                    <th className="text-center">Quantity</th>
                    <th className="text-center">Amount Charged</th>
                </tr>
                {ordersRows}
                <tr>
                    <td colspan="2" className="text-right">Total Amount</td>
                    <td className="text-center">{sumTotal.toFixed(2)}</td>
                </tr>

            </table>)

        let headerStyle = {'margin-top': '20px'}



        return (
            <html>
                <Head />
                <body>
                    <NavBar loggedIn={loggedIn}/>
                    <div className="container">
                        <div>
                            <h1 style={headerStyle}>Your Order</h1>
                            <h3>Purchase Info</h3>
                            <table>
                                <tr>
                                    <td>Seller:</td>
                                    <td><a href={"/seller/"+seller_username+"/"}>{seller_username}</a></td>
                                </tr>
                                <tr>
                                    <td>Sale:</td>
                                    <td><a href={"/seller/"+seller_username+"/sales/"+saleID+"/"}>{sale_name}</a></td>
                                </tr>
                                <tr>
                                    <td>Sale ID:</td>
                                    <td>{saleID}</td>
                                </tr>
                                <tr>
                                    <td>Drop Date:</td>
                                    <td>{saleDropDate}</td>
                                </tr>
                                <tr>
                                    <td>Purchase Time: </td>
                                    <td>{purchaseTime}</td>
                                </tr>
                                <tr>
                                    <td>Order ID: </td>
                                    <td>{orderID}</td>
                                </tr>
                            </table>
                        </div>
                        <div>
                            <h3>Orders</h3>
                            {orderTable}
                        </div>
                        <div>
                        <a href="/">Back to Home</a>
                        </div>

                    </div>

                </body>
            </html>
            )
    }
}

module.exports = BuyerOrder