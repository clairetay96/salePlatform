import React from 'react'
const path = require('path')

class SellerCatalogue extends React.Component {
    render() {
        let allItemsHTML = <div></div>
        if(this.props.sellerItems){
            allItemsHTML = this.props.sellerItems.map((item,i)=>{
                return (<a href={item.item_id}><p>{item.item_name}</p></a>)
            })

        }
        return (
            <html>
                <head></head>
                <body>
                    <div>


                            <div className="allItems">
                                {allItemsHTML}
                            </div>
                            <div>
                            <a href="new">Add a new item</a>
                            </div>
                            <div>
                            <a href="all">Edit all items</a>
                            </div>

                    </div>
                </body>
            </html>
            )
    }
}

module.exports = SellerCatalogue