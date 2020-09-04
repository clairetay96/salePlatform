import React from 'react'
import CatalogueItemInput from './components/catalogueInput.jsx'

class SellerPage extends React.Component {
    render() {
        let allItems = this.props.items.rows
        let allSales = this.props.sales.rows
        console.log(allItems,allSales)

        let allItemsHTML = allItems.map((item)=>{
            return <li>{item.item_name}</li>
        })
        let allSalesHTML = allSales.map((item)=>{
            let saleLink = "sales/" + item.sale_id + "/"
            return <li><a href={saleLink}>{item.sale_id}</a></li>
        })

        return (
            <div>
            Items:
                {allItemsHTML}
                <br/>
            Sales:
                {allSalesHTML}
            </div>
            )
    }
}

module.exports = SellerPage