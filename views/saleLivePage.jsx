import React from 'react'

class SaleLivePage extends React.Component {
    render() {
        let allItems = this.props.items.rows
        let saleInfo = this.props.sale.rows[0]
        let sellerID = allItems[0].seller_id
        let saleID = saleInfo.sale_id
        let postURL = "/seller/"+this.props.seller_username+"/sales/"+saleID+"/live"
        let now = new Date()

        let allItemsHTML = allItems.map((item)=>{
            if(item.quantity>0){
                let itemName = "item"+item.item_id
                let itemPrice = "price"+item.item_id
                return (
                    <div className="saleItem">
                        <span className="itemName">{item.item_name}</span>,
                        $<span className="itemPrice">{item.price}</span>.
                        {item.quantity} remaining.
                        Order qty: <input type="number" name={itemName} max={item.max_order} min="0" className="orderqty"/>
                        <input type="hidden" name={itemPrice} value={item.price}/>
                    </div>)
            } else {
                return <p>{item.item_name} is sold out!</p>
            }
        })


        if(now < Date.parse(saleInfo.time_live)){
            return (
                <div>
                    <h1>Sale is on!!</h1>
                    <form method="POST" action={postURL}>
                        {allItemsHTML}
                        <br/><br/>
                        <button type="button" id="confirm">Confirm order</button>
                        <br/><br/>
                        <input type="hidden" name="seller_id" value={sellerID}/>
                        <input type="hidden" name="sale_id" value={saleID}/>

                        <div id="confirmOrder"></div>
                    </form>
                    <script src="/liveSale.js"></script>
                </div>
            )

        } else {
            return (<p>Sale is not live yet.</p>)
        }

    }
}

module.exports = SaleLivePage