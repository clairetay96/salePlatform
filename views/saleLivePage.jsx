import React from 'react'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'

class SaleLivePage extends React.Component {
    render() {
        let allItems = this.props.items.rows
        let saleInfo = this.props.sale.rows[0]
        let sellerID = allItems[0].seller_id
        let loggedIn = this.props.loggedIn
        let saleID = saleInfo.sale_id
        let postURL = "/seller/"+this.props.seller_username+"/sales/"+saleID+"/live"
        let now = new Date()

        let allItemsHTML = allItems.map((item)=>{
            if(item.quantity>0){
                let itemName = "item"+item.item_id
                let itemPrice = "price"+item.item_id
                return (
                    <tr className="saleItem">
                        <td className="itemName">{item.item_name}<span>{item.quantity} remaining.</span></td>
                        <td className="itemPrice">${item.price}</td>
                        <td>Qty: <input type="number" name={itemName} max={item.max_order} min="0" className="orderqty"/>
                        <input type="hidden" name={itemPrice} value={item.price}/></td>
                    </tr>)
            } else {
                return (
                    <tr className="saleItem">
                        <td className="itemName">{item.item_name}<span>SOLD OUT</span></td>,
                        $<td className="itemPrice">{item.price}</td>.
                        <td></td>
                    </tr>)
            }
        })

        let allItemsTable = (
            <table>
            {allItemsHTML}
            </table>)

        if(now >= Date.parse(saleInfo.time_live)){
            return (
                <html>
                    <Head />
                    <body>
                    <NavBar loggedIn={loggedIn}/>
                        <div>
                            <h1>LIVE SALE</h1>
                            <form method="POST" action={postURL}>
                                {allItemsTable}
                                <br/><br/>
                                <button type="button" id="confirm">Confirm order</button>
                                <br/><br/>
                                <input type="hidden" name="seller_id" value={sellerID}/>
                                <input type="hidden" name="sale_id" value={saleID}/>

                                <div id="confirmOrder"></div>
                            </form>
                            <script src="/liveSale.js"></script>
                        </div>
                    </body>
                </html>
            )

        } else {
            return (<p>Sale is not live yet.</p>)
        }

    }
}

module.exports = SaleLivePage