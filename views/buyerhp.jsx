import React from 'react'

class Homepage extends React.Component {
    render() {
        let buyerUsername = this.props.buyer.rows[0].username
        let buyersSalesTr = this.props['sales_tracked'].rows
        let buyersSellersTr = this.props['sellers_tracked'].rows
        let buyersOrders = this.props.orders.rows

        let trackedSellerHTML = buyersSellersTr.map((item)=>{
            return <p>{item.username}, {item.sale_id}, <span className="livetime">{item.time_live}<span className="countdown"></span></span></p>
        })

        let trackedSaleHTML = buyersSalesTr.map((item)=>{
            return <li>{item.seller_username}, {item.sale_id}</li>
        })

        let ordersHTML = buyersOrders.map((item)=>{
            return <p>{item.order_id}</p>
        })

        console.log(buyersSellersTr)

        return (
            <html>
                <head>
                    <title>Hayaku</title>
                </head>
                <body>
                This is {buyerUsername}'s' homepage.<br/>
                Sales of Tracked Sellers:
                    {trackedSellerHTML}
                Tracked Sales:<br/>
                    {trackedSaleHTML}
                Order History:
                    {ordersHTML}
                    <script src="/buyerhp.js"></script>
                </body>
            </html>)
    }
}

module.exports = Homepage