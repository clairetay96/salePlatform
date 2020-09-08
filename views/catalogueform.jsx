import React from 'react'
import CatalogueItemInput from './components/catalogueInput.jsx'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'

class CatalogueForm extends React.Component {
    render() {
        let loggedIn = this.props.loggedIn
        let addDel = this.props.addDel
        console.log(this.props)

        let deleteButton;
        let addButton;

        if(addDel&&addDel.del){
            deleteButton = (<button type="button" className="removeItemBtn">Delete Item</button>)
        }
        if (addDel&&addDel.add){
            addButton = (<button type="button" id="addItemBtn">Add another item</button>)
        }

        let allItemsHTML = <CatalogueItemInput />

        if(this.props.sellerItems){
            allItemsHTML = this.props.sellerItems.map((item,i)=>{
                return (<div className="itemInput">
                    <div className="field">
              <label>Item name</label> <input type="text" name={"item_name"+i} autoComplete="off" defaultValue={item.item_name}/>
              </div>
            <div className="field">
              <label>Price</label> <input type="text" name={"price"+i} autoComplete="off" defaultValue={item.price}/>
              </div>
            <div className="field">
              <label>Description</label> <input type="text" name={"product_desc"+i} autoComplete="off" defaultValue={item.product_desc}/>
              </div>
            <div className="field">
              <label>Image URL</label> <input type="text" name={"imgURL"+i} autoComplete="off" defaultValue={item.image_url}/>
              </div>
              {deleteButton}
              <input type="hidden" name={"item_id"+i} value={item.item_id}/>
            </div>)
            })

        }
        return (
            <html>
                <Head additionalStyle={{otherScripts: ["/forms.css"]}}/>
                <body>
                <NavBar loggedIn={loggedIn}/>
                    <div class="container">
                        <div className="form-title">
                            <h2>Update Catalogue</h2>
                        </div>
                        <form method="POST" action="/seller/catalogue/edit/">

                            <div className="additional-deets">
                                <div className="allItems">
                                    {allItemsHTML}
                                </div>

                                {addButton}

                                <input type="hidden" name="seller_id" value={this.props.sellerID}/>
                            </div>
                            <div className="submit-button">
                                <input type="submit"/>
                            </div>
                        </form>
                        <script src="/addItem.js"></script>
                    </div>
                </body>
            </html>
            )
    }
}

module.exports = CatalogueForm