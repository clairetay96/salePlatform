import React from 'react'

class CatalogueItemInput extends React.Component {
    render() {
        return (
            <div className="itemInput">
              Item name: <input type="text" name="item_name1" autoComplete="off"/> <br/><br/>
              Price: <input type="text" name="price1" autoComplete="off"/><br/><br/>
              Description: <input type="text" name="product_desc1" autoComplete="off"/><br/><br/>
              Image URL: <input type="text" name="imgURL1" autoComplete="off"/><br/><br/>
              <button type="button" className="removeItemBtn" id="remove1">Delete Item</button><br/><br/>
            </div>
            )
    }
}

export default CatalogueItemInput