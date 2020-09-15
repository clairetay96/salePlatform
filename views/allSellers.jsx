import React from 'react'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'
import TrackSeller from './components/trackSellerButton.jsx'
import UntrackSeller from './components/untrackSellerButton.jsx'

class AllSellers extends React.Component {
    render() {
        let loggedIn = this.props.loggedIn
        let sellerInfo = this.props.rows //this returns an array of catalogue items and the relevant information
        let sortedSellers = {}

        //loop through the items and sort them by seller into sortedSellers. The keys for sortedSellers are the seller usernames, which are unique.
        for(let i=0;i < sellerInfo.length; i++){
            let item=sellerInfo[i]
            if(Object.keys(sortedSellers).includes(item.username)){
                sortedSellers[item.username].push(item)
            } else {
                sortedSellers[item.username] = [item]
            }
        }

        //For each seller, create a div that displays the username, whether the seller is tracked, and maximum 3 items from their catalogue. item here refers to username of seller.
        let sellerInfoHTML = Object.keys(sortedSellers).map((item)=>{
            let indivInfo = sortedSellers[item] //this is an array that contains item information


            let untrackButton = <TrackSeller seller_username={item} />
            //buyer_id is undefined if a buyer is not logged in, null if the buyer does not follow the seller, and the buyer_id of the logged in buyer if the buyer follows the seller.
            if(indivInfo[0]['buyer_id']){
                untrackButton = <UntrackSeller seller_username={item}/>
            }

            //create image cards for each item, for up to 3 items.
            let allItems = []
            let sellerURL = "/seller/"+item+"/"
            //loop thr
            for(let i=0;i<indivInfo.length;i++){
                let saleItem = indivInfo[i]
                if(i==3){
                    break
                }
                allItems.push(<div className="image-cards"><img src={saleItem.image_url}/><div className="item-desc"><p>{saleItem.item_name}</p> <p>{saleItem.price}</p></div></div>)
            }

            return <div className="indiv-seller"><div className="card-title"><a href={sellerURL}><h3>{item}</h3></a> {untrackButton}</div> <div className="item-cards">{allItems}</div></div>

        })



        return (
            <html>
                <Head additionalStyle={{otherScripts: ["/styles/browse.css"]}}/>
                <body>
                <NavBar loggedIn={loggedIn}/>
                    <div className="container">

                    <div className="browse-items">
                    <h1>Sellers</h1>
                        {sellerInfoHTML}
                    </div>

                    </div>
                </body>
            </html>
            )
    }
}

module.exports = AllSellers