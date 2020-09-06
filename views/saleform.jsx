import React from 'react'
import CatalogueItemInput from './components/catalogueInput.jsx'

class SaleForm extends React.Component {
    render() {
        let allItems = this.props.rows
        let sellerID = this.props.rows[0].seller_id
        let allItemsHTML = allItems.map((item)=>{
            let qtyAvName = "qtyAv" + item.item_id
            let maxOrdName = "maxOrd" + item.item_id
            return (<div className="saleItem">
                        {item.item_name} at {item.price}
                        Qty available: <input type="number" name={qtyAvName}/>
                        Maximum Order: <input type="number" name={maxOrdName}/>
                    </div>)
        })

        return (
            <html>
                <head></head>
                <body>
                    <div>
                        <form method="POST" action="/seller/sales/new/">
                            {allItemsHTML}
                            <br/><br/>

                            <div id="livedates">
                                <div className="liveDate">
                                    Date Live: <input type="datetime-local" name="time_live1"/>
                                </div>
                            </div>

                            <button type="button" id="addLiveDate">Add another date</button>
                            <br/><br/>
                            <input type="hidden" name="seller_id" value={sellerID}/>
                            <input type="submit"/>
                        </form>
                        <script src="/newSale.js"></script>
                    </div>
                </body>
            </html>
            )
    }
}

module.exports = SaleForm