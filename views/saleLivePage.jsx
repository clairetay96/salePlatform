import React from 'react'

class SaleLivePage extends React.Component {
    render() {
        let allItems = this.props.items.rows
        let saleInfo = this.props.sale.rows[0]
        let now = new Date()

        let allItemsHTML = allItems.map((item)=>{
            if(item.quantity>0){
                let itemName = "item"+item.item_id
                return (
                    <div className="saleItem">
                        <span className="itemName">{item.item_name}</span>, {item.price}. {item.quantity} remaining.
                        Order qty: <input type="number" name={itemName} max={item.max_order} min="0" className="orderqty"/>
                    </div>)
            } else {
                return <p>{item.item_name} is sold out!</p>
            }
        })

        if(now<Date.parse(saleInfo.time_live)){
            return (
                <div>
                    <h1>Sale is on!!</h1>
                    <form method="POST" action="/make_purchase">
                        {allItemsHTML}
                        <button type="button" id="confirm">Confirm order</button>
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