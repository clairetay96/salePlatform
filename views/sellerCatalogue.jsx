import React from 'react'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'

class SellerCatalogue extends React.Component {
    render() {
        let loggedIn = this.props.loggedIn
        let allItemsHTML = <div></div>
        let allItemsTable = <div></div>

        if(this.props.sellerItems){
            allItemsHTML = this.props.sellerItems.map((item,i)=>{
                let editURL = "/seller/catalogue/edit/"+item.item_id
                return (<tr><td>{item.item_name}</td> <td>{item.product_desc}</td> <td>{item.price}</td><td><a href={editURL}>Edit</a></td></tr>)
            })

            allItemsTable = (
                <table>
                    <tr>
                        <th>Item</th>
                        <th>Description</th>
                        <th>Price($)</th>
                        <th></th>
                    </tr>
                    {allItemsHTML}
                </table>)


        }
        return (
            <html>
                <Head />
                <body>
                <NavBar loggedIn={loggedIn}/>
                    <div className="container">

                        <h1>Your Catalogue</h1>
                        <div className="row">
                            <div className="col-md-3">
                                <a href="new">Add new items</a>
                            </div>
                            <div className="col-md-3 offset-md-1">
                                <a href="all">Edit all items</a>
                            </div>
                        </div>
                            <div className="allItems">
                            <h3>Your items</h3>
                                {allItemsTable}
                            </div>


                    </div>
                </body>
            </html>
            )
    }
}

module.exports = SellerCatalogue