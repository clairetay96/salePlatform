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
                         <div>
                            <a href="new">Add a new item</a>
                            </div>
                            <div>
                            <a href="all">Edit all items</a>
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