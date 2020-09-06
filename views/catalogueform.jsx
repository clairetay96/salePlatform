import React from 'react'
import CatalogueItemInput from './components/catalogueInput.jsx'

class CatalogueForm extends React.Component {
    render() {

        let allItemsHTML = <CatalogueItemInput />
        if(this.props.sellerItems){
            allItemsHTML = this.props.sellerItems.map((item,i)=>{
                return (<div className="itemInput">
              Item name: <input type="text" name={"item_name"+i} autoComplete="off" defaultValue={item.item_name}/> <br/><br/>
              Price: <input type="text" name={"price"+i} autoComplete="off" defaultValue={item.price}/><br/><br/>
              Description: <input type="text" name={"product_desc"+i} autoComplete="off" defaultValue={item.product_desc}/><br/><br/>
              Image URL: <input type="text" name={"imgURL"+i} autoComplete="off" defaultValue={item.image_url}/><br/><br/>
              <input type="hidden" name={"item_id"+i} value={item.item_id}/>
              <button type="button" className="removeItemBtn">Delete Item</button><br/><br/>
            </div>)
            })

        }
        return (
            <html>
                <head></head>
                <body>
                    <div>
                        <form method="POST" action="/seller/catalogue/edit/">

                            <div className="allItems">
                                {allItemsHTML}
                            </div>

                            <button type="button" id="addItemBtn">Add another item</button>
                            <br/><br/>

                            <input type="hidden" name="seller_id" value={this.props.sellerID}/>

                            <input type="submit"/>
                        </form>
                        <script src="/addItem.js"></script>
                    </div>
                </body>
            </html>
            )
    }
}

module.exports = CatalogueForm