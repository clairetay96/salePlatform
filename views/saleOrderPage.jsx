import React from 'react'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'

//for seller to see all the orders from a sale.
class SaleOrderPage extends React.Component {
    render() {
        let loggedIn = this.props.loggedIn
        let allRows = this.props.rows //contains all the orders from the sale

        let saleInfo = this.props.saleRowFromSales //this is an object containing information from the sales table such sale_id, sale_name, but most importantly, the sold_out value ie whether or not the sale is closed. Required when the sale has no orders to get the sold_out value from.

        let saleID = allRows[0] ? allRows[0].sale_id : this.props.sale_id
        let closedState =allRows[0] ? allRows[0].sold_out : saleInfo.sold_out
        let username = this.props.seller_username
        let closeSaleURL = "/seller/"+username+"/sales/"+saleID+"/close"
        let salePageURL = "/seller/"+username+"/sales/"+saleID+"/"

        //table row for each order
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

        if(allRows.length==0){
            orderDataHTML = <tr><td colSpan="2">There are no orders for this sale yet.</td></tr>
        }

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

        let stylingButton = {
            backgroundColor: 'white',
            border: '1px solid rgba(50,152,255)',
            padding: '10px 20px'

        }


        let closeSale = <form method="POST" action={closeSaleURL}><input style={stylingButton} type="submit" value="Close Sale" /></form>

        if(closedState){
            closeSale = <div style={stylingButton}>CLOSED</div>
        }

        let stylingHeader = {
            display: 'flex',
            margin: '10px auto',
            width: '90%',
            justifyContent: 'space-between'

        }

        let stylingFooter = {
            margin: '10px auto',
            width: '90%',

        }

        return (
            <html>
                <Head />
                <body>
                <NavBar loggedIn={loggedIn}/>
                <div className="container">
                <div style={stylingHeader}>
                <div>
                    <h1>Orders for Sale {saleID}</h1>
                    <p><a href={salePageURL}>Go to sale page</a></p>
                </div>
                {closeSale}
                </div>

                    {orderDataTable}
                    <div style={stylingFooter}>
                <a href="/">Back to home</a>
                </div>
                </div>


                </body>
            </html>
            )
    }
}

module.exports = SaleOrderPage