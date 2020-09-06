import React from 'react'
import CatalogueItemInput from './components/catalogueInput.jsx'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'

class SaleForm extends React.Component {
    render() {
        let allItems = this.props.rows
        let sellerID = this.props.rows[0].seller_id
        let loggedIn = this.props.loggedIn

        let allItemsHTML = allItems.map((item)=>{
            let qtyAvName = "qtyAv" + item.item_id
            let maxOrdName = "maxOrd" + item.item_id
            return (<tr className="saleItem">
                        <td>{item.item_name}</td>
                        <td>{item.price}</td>
                        <td><input type="number" name={qtyAvName} min="0" defaultValue="0"/></td>
                        <td><input type="number" name={maxOrdName} min="0" defaultValue="0"/></td>
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
                        <form method="POST" action="/seller/sales/new/">
                            {allItemsTable}
                            <br/><br/>

                            Sale name<br/>
                            <input type="text" name="sale_name"/><br/>
                            Sale description<br/>
                            <textarea name="sale_desc"/>

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