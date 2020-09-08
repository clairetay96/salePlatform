import React from 'react'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'
import TrackSeller from './components/trackSellerButton.jsx'
import UntrackSeller from './components/untrackSellerButton.jsx'

class AllSellers extends React.Component {
    render() {
        let loggedIn = this.props.loggedIn
        let sellerInfo = this.props.rows
        let sortedSellers = {}


        for(let i=0;i < sellerInfo.length; i++){
            let item=sellerInfo[i]
            if(Object.keys(sortedSellers).includes(item.username)){
                sortedSellers[item.username].push(item)
            } else {
                sortedSellers[item.username] = [item]
            }
        }

        let sellerInfoHTML = Object.keys(sortedSellers).map((item)=>{
            let indivInfo = sortedSellers[item]
            let untrackButton = <TrackSeller seller_username={item} />
            if(indivInfo[0]['buyer_id']){
                untrackButton = <UntrackSeller seller_username={item}/>
            }

            let allItems = []
            let sellerURL = "/seller/"+item+"/"

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
                <Head additionalStyle={{otherScripts: ["/browse.css"]}}/>
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