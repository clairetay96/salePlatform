import React from 'react'
import Head from './components/Head.jsx'
import NavBar from './components/navBar.jsx'

class SellerHomepage extends React.Component {
    render() {
        let catalogueItems = this.props.catalogue.rows
        let sales = this.props.sales.rows
        let followerNo = this.props.followers.rowCount
        let loggedIn = this.props.loggedIn
        let seller_username = this.props.username

        let catalogueItemsHTML = catalogueItems.map((item)=>{
            return <li className="list-inline-item">{item.item_name}</li>
        })

        let upcomingsales = []
        let pastsales = []
        let now = new Date()
        sales.forEach((item)=>{
            if(Date.parse(item.time_live)>=now){
                upcomingsales.push(item)
            } else {
                pastsales.push(item)
            }
        })

        let pastSalesHTML = pastsales.map((item)=>{
            return (<tr>
                <td>{item.sale_id}</td>
                <td>{item.time_live}</td>
                </tr>)
        })

        let upcomingSalesHTML = upcomingsales.map((item)=>{
            return (<tr>
                <td>{item.sale_id}</td>
                <td>{item.time_live}</td>
                <td><a href={`/seller/${seller_username}/sales/${item.sale_id}/edit`}>Edit</a></td>
                </tr>)
        })

        return (
            <html>
                <Head />
                <body>
                <NavBar loggedIn={loggedIn}/>
                <div class="welcome-header">
                    <h1>Welcome, {seller_username}</h1>
                    <p>Follower count: {followerNo}</p>
                </div>
                <div className="row center-contents">

                    <div className="upcoming-drops col-md-5">
                        <h3>Upcoming Drops</h3>
                        <a href="/seller/sales/new">Add a new sale</a>
                        <table>
                        <tr>
                            <th>Sale ID</th>
                            <th>Drop Date</th>
                            <th></th>
                        </tr>
                        {upcomingSalesHTML}
                        </table>
                    </div>

                    <div className="past-drops col-md-5">
                        <h3>Past Drops</h3>
                        {pastSalesHTML}
                    </div>
                </div>

                <div>
                    <h3>Catalogue</h3>
                    <a href="/seller/catalogue/edit/">Edit your catalogue</a>
                    <ul className="list-inline">
                        {catalogueItemsHTML}
                    </ul>
                </div>



                </body>
            </html>)
    }
}

module.exports = SellerHomepage