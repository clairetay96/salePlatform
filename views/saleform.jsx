import React from 'react'
import CatalogueItemInput from './components/catalogueInput.jsx'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'

//to create a new sale
class SaleForm extends React.Component {
    render() {
        let allItems = this.props.rows
        let sellerID = this.props.seller_id
        let loggedIn = this.props.loggedIn


        //table row containing information for each item, as well as unique name for each field
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

        if(allItems.length==0){
            allItemsHTML = <tr><td col-span="4">You have no items available. Edit your catalogue <a href='/seller/catalogue/edit/new'>here.</a></td></tr>

        }

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
                <Head additionalStyle={{otherScripts: ["/forms.css"]}}/>
                <body>
                <NavBar loggedIn={loggedIn}/>
                    <div className="container">
                    <div className="form-title">
                        <h2>Add a new sale</h2>
                    </div>
                        <form method="POST" action="/seller/sales/new/">
                            <div className="item-table">
                                {allItemsTable}
                            </div>

                            <div className="additional-deets">
                                <label>Sale name</label>
                                <input type="text" name="sale_name" required/>
                                <label>Sale description</label>
                                <textarea name="sale_desc"/>

                                <div id="livedates">
                                    <div className="liveDate">
                                    Date Live
                                        <input type="datetime-local" name="time_live1" required/>
                                    </div>
                                </div>

                                <button type="button" id="addLiveDate">Add another date</button>
                                <br/><br/>
                                <input type="hidden" name="seller_id" value={sellerID}/>
                                <div className="submit-button">
                                    <input type="submit"/>
                                </div>
                            </div>
                        </form>
                        <script src="/newSale.js"></script>
                    </div>
                </body>
            </html>
            )
    }
}

module.exports = SaleForm