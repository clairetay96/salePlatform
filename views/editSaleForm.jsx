import React from 'react'
import CatalogueItemInput from './components/catalogueInput.jsx'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'

class SaleForm extends React.Component {
    render() {
        let sellerItems = this.props.sellerItems.rows
        let saleInfo = this.props.saleInfo.rows[0]
        let sellerID = saleInfo.seller_id
        let saleItems = this.props.saleItems.rows
        let loggedIn = this.props.loggedIn
        let actionURL = `/seller/${this.props.seller_username}/sales/${saleInfo.sale_id}/edit?_method=PUT`

        let saleItemsID = sellerItems.map(item=>item.item_id)

        let allItemsHTML = sellerItems.map((item)=>{
            let qtyAvName = "qtyAv" + item.item_id
            let maxOrdName = "maxOrd" + item.item_id
            let defaultQtyVal = 0
            let defaultMaxOrd = 0

            if(saleItemsID.includes(item.item_id))

            return (<tr className="saleItem">
                        <td>{item.item_name}</td>
                        <td>{item.price}</td>
                        <td><input type="number" name={qtyAvName} min="0" defaultValue={defaultQtyVal}/></td>
                        <td><input type="number" name={maxOrdName} min="0" defaultValue={defaultMaxOrd}/></td>
                    </tr>)
        })

        let allItemsTable = (<table>
            <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Qty Available</th>
            <th>Maximum Order</th>
            </tr>
            {allItemsHTML}
            </table>)

        return (
            <html>
                <Head />
                <body>
                <NavBar loggedIn={loggedIn}/>
                    <div>
                    <h2>Add a new sale</h2>
                        <form method="POST" action={actionURL}>
                            {allItemsTable}
                            <br/><br/>

                            Sale name<br/>
                            <input type="text" name="sale_name"/><br/>
                            Sale description<br/>
                            <textarea name="sale_desc"/>

                            <div id="livedates">
                                <div className="liveDate">
                                    Date Live: <input type="datetime-local" name="time_live" defaultValue={saleInfo.time_live}/>
                                </div>
                            </div>
                            <br/><br/>
                            <input type="hidden" name="seller_id" value={sellerID}/>
                            <input type="hidden" name="sale_id" value={saleInfo.sale_id}/>
                            <input type="submit"/>
                        </form>
                    </div>
                </body>
            </html>
            )
    }
}

module.exports = SaleForm