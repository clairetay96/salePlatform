import React from 'react'

class SellerHomepage extends React.Component {
    render() {
        let catalogueItems = this.props.catalogue.rows
        let sales = this.props.sales.rows

        let catalogueItemsHTML = catalogueItems.map((item)=>{
            return <p>{item.item_name}</p>
        })
        let salesHTML = sales.map((item)=>{
            return <p>{item.sale_id}, {item.time_live}</p>
        })

        return (
            <html>
                <head>
                    <title>Hayaku: Seller</title>
                    <link rel="stylesheet" type="text/css" href="/homepage.css"/>
                </head>
                <body>
                <h1>Welcome.</h1>
                <h3>Your Sales</h3>
                {salesHTML}
                <h3>Your Catalogue</h3>
                {catalogueItemsHTML}

                </body>
            </html>)
    }
}

module.exports = SellerHomepage