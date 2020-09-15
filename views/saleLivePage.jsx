import React from 'react'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'
import Message from './message.jsx'

//sale live page
class SaleLivePage extends React.Component {
    render() {
        let allItems = this.props.items.rows
        let saleInfo = this.props.sale.rows[0]
        let sellerID = allItems[0].seller_id
        let closedState = saleInfo.sold_out
        let loggedIn = this.props.loggedIn
        let saleID = saleInfo.sale_id
        let postURL = "/seller/"+this.props.seller_username+"/sales/"+saleID+"/live"
        let waitRoomURL = "/seller/"+this.props.seller_username+"/sales/"+saleID+"/"
        let now = new Date()

        //table row for each item
        let allItemsHTML = allItems.map((item)=>{

            if(item.quantity>0){
                //field names tagged with item id, unique
                let itemName = "item"+item.item_id
                let itemPrice = "price"+item.item_id
                return (
                    <tr className="saleItem">
                        <td><h6 className="itemName">{item.item_name}</h6><div className="subtitle-font">Qty remaining: <b>{item.quantity}</b><br/>Max order: <b>{item.max_order}</b></div></td>
                        <td className="itemPrice">${item.price}</td>
                        <td>Qty: <input type="number" name={itemName} max={item.max_order} min="0" className="orderqty"/>
                        <input type="hidden" name={itemPrice} value={item.price}/></td>
                    </tr>)
            } else {
                //show that item is sold out, no input field for order
                return (
                    <tr>
                        <td className="itemName"><h6>{item.item_name}</h6><div className="subtitle-font out"><b>SOLD OUT</b></div></td>
                        <td className="itemPrice">${item.price}</td>
                        <td></td>
                    </tr>)
            }
        })


        let allItemsTable = (
            <table id="sale-item-table">
            {allItemsHTML}
            </table>)

        //returns the live page if the sale has gone live
        if(now >= Date.parse(saleInfo.time_live+"+08:00")&&!closedState){
            return (
                <html>
                    <Head additionalStyle={{otherScripts: ["/styles/saleRooms.css"]}}/>
                    <body>
                    <NavBar loggedIn={loggedIn}/>
                        <div class="container">
                            <form method="POST" action={postURL}>
                                <div className="all-items">
                                {allItemsTable}
                                </div>

                                <div className="confirm-order">
                                <a href={waitRoomURL}>Back to wait room</a>
                                <button type="button" id="confirm">Confirm order</button>
                                <input type="hidden" name="seller_id" value={sellerID}/>
                                <input type="hidden" name="sale_id" value={saleID}/>
                                </div>

                                <div id="confirmOrder"></div>
                            </form>
                            <script src="/scripts/liveSale.js"></script>
                        </div>
                    </body>
                </html>
            )

        } else { //returns that the sale is not live yet if it's before the time_live, or if sale is closed.
            return (<Message message="Sale is not live." loggedIn={true}/>)
        }

    }
}

module.exports = SaleLivePage