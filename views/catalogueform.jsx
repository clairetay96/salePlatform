import React from 'react'
import CatalogueItemInput from './components/catalogueInput.jsx'

class CatalogueForm extends React.Component {
    render() {
        return (
            <div>
                <form method="POST" action="/seller/catalogue/new/">

                    <div className="allItems">
                        <CatalogueItemInput/>
                    </div>

                    <button type="button" id="addItemBtn">Add another item</button>
                    <br/><br/>

                    <input type="hidden" name="seller_id" value={this.props.seller_id}/>

                    <input type="submit"/>
                </form>
                <script src="/addItem.js"></script>
            </div>
            )
    }
}

module.exports = CatalogueForm