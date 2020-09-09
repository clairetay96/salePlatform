import React from 'react'

class CatalogueItemInput extends React.Component {
    render() {
        return (
            <div className="itemInput">
            <div className="field">
              <label>Item name</label> <input type="text" name="item_name1" autoComplete="off" required/>
            </div>
            <div className="field">
              <label>Price</label> <input type="number" step=".01" name="price1" autoComplete="off" min="0" required/>
              </div>
            <div className="field">
              <label>Image URL</label> <input type="text" name="imgURL1" autoComplete="off" required/>
              </div>
              <div className="field">
              <label>Description</label> <textarea name="product_desc1" autoComplete="off" required/>
              </div>
              <button type="button" className="removeItemBtn" id="remove1">Delete Item</button>
            </div>
            )
    }
}

export default CatalogueItemInput