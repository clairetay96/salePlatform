import React from 'react'

class Homepage extends React.Component {
    render() {
        let buyerUsername = this.props.buyer.rows[0].username
        let buyersSalesTr = this.props['sales_tracked'].rows
        let buyersSellersTr = this.props['sellers_tracked'].rows
        let buyersOrders = this.props.orders.rows

        return (
            <html>
                <head>
                    <title>Hayaku</title>
                    <link rel="stylesheet" type="text/css" href="/homepage.css"/>
                </head>
                <body>
                This is {buyerUsername}'s' homepage.

                    {buyersSellersTr[0].sale_id}
                </body>
            </html>)
    }
}

module.exports = Homepage