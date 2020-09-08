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
        let deleteURL = `/seller/${this.props.seller_username}/sales/${saleInfo.sale_id}/delete?_method=DELETE`

        let saleItemsID = saleItems.map(item=>item.item_id)

        let allItemsHTML = sellerItems.map((item)=>{
            let qtyAvName = "qtyAv" + item.item_id
            let maxOrdName = "maxOrd" + item.item_id
            let defaultQtyVal = 0
            let defaultMaxOrd = 0
            console.log(sellerItems, saleItems, saleItemsID)

            if(saleItemsID.includes(item.item_id)){
                for(let i=0;i<saleItemsID.length;i++){
                    if(saleItems[i].item_id==item.item_id){
                        defaultQtyVal=saleItems[i].quantity
                        defaultMaxOrd=saleItems[i].max_order
                    }
                }
            }

            return (<tr className="saleItem">
                        <td>{item.item_name}</td>
                        <td>{item.price}</td>
                        <td><input type="number" name={qtyAvName} min="0" defaultValue={defaultQtyVal}/></td>
                        <td><input type="number" name={maxOrdName} min="0" defaultValue={defaultMaxOrd}/></td>
                    </tr>)
        })

        let confirmClick = ()=>{
            return confirm('Are you sure?')
        }

        let deleteSale = <div className="submit-button delete"><form method="POST" action={deleteURL}><input type="submit" value="Delete Sale"/></form></div>

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
                            <h2>Edit Sale</h2>
                        </div>
                            <form method="POST" action={actionURL}>
                                {allItemsTable}

                                <div className="additional-deets">
                                    <label>Sale name</label>
                                    <input type="text" name="sale_name" defaultValue={saleInfo.sale_name}/>
                                    <label>Sale description</label>
                                    <textarea name="sale_desc" defaultValue={saleInfo.sale_desc}/>

                                    <div id="livedates">
                                        <div className="liveDate">
                                            Date Live <input type="datetime-local" name="time_live" defaultValue={saleInfo.time_live} required/>
                                        </div>
                                    </div>
                                    <input type="hidden" name="seller_id" value={sellerID}/>
                                    <input type="hidden" name="sale_id" value={saleInfo.sale_id}/>
                                </div>
                                <div className="submit-button">
                                    <input type="submit" value="Edit Sale"/>
                                </div>
                            </form>
                            {deleteSale}
                        </div>
                </body>
            </html>
            )
    }
}

module.exports = SaleForm