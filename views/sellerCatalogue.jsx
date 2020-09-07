import React from 'react'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'

class SellerCatalogue extends React.Component {
    render() {
        let loggedIn = this.props.loggedIn
        let allItemsHTML = <div></div>
        if(this.props.sellerItems){
            allItemsHTML = this.props.sellerItems.map((item,i)=>{
                return (<p>{item.item_name}  <a href={item.item_id}>Edit</a></p>)
            })

        }
        return (
            <html>
                <Head />
                <body>
                <NavBar loggedIn={loggedIn}/>
                    <div>

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
                                {allItemsHTML}
                            </div>


                    </div>
                </body>
            </html>
            )
    }
}

module.exports = SellerCatalogue