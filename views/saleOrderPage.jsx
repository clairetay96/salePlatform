import React from 'react'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'

class SaleOrderPage extends React.Component {
    render() {
        let loggedIn = this.props.loggedIn
        let allRows = this.props.rows
        let saleID = allRows[0].sale_id

        let orderDataHTML = allRows.map((item)=>{
            return (<tr>
                <td>{item.order_id}</td>
                <td>{item.username}</td>
                <td>{item.item_name}</td>
                <td>{item.quantity}</td>
                <td>{item.timestamp.toString()}</td>
                <td>{item.amt_charged}</td>
            </tr>)
        })

        let orderDataTable = (
            <table>
                <tr>
                <th>Order ID</th>
                <th>Buyer</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Time</th>
                <th>Amt Charged</th>
                </tr>
                {orderDataHTML}
            </table>)

        return (
            <html>
                <Head />
                <body>
                <NavBar loggedIn={loggedIn}/>
                <h1>Orders for Sale {saleID}</h1>
                    {orderDataTable}

                </body>
            </html>
            )
    }
}

module.exports = SaleOrderPage