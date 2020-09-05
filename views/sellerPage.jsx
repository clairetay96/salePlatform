import React from 'react'
import CatalogueItemInput from './components/catalogueInput.jsx'
import TrackSeller from './components/trackSellerButton.jsx'

class SellerPage extends React.Component {
    render() {
        let allItems = this.props.items.rows
        let allSales = this.props.sales.rows
        let seller_username = this.props.seller_username
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
            <TrackSeller seller_username={seller_username} />
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