import React from 'react'

class SaleWaitRoom extends React.Component {
    render() {
        let allItems = this.props.items.rows
        let saleInfo = this.props.sale.rows[0]

        let allItemsHTML = allItems.map((item)=>{
            return <li>{item.item_name}</li>
        })

        return (
            <div>
                <h1>Waiting Room for Sale!</h1>
                Items available:
                <ul>
                    {allItemsHTML}
                </ul>
                Button goes live at: <span id="date-req">{saleInfo.time_live}</span><br/>
                <button id="liveSale">Click here to enter sale</button>
                <script src="/saleWaitRoom.js"></script>
            </div>
            )
    }
}

module.exports = SaleWaitRoom