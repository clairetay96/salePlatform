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
                <td>{item.sale_name}</td>
                <td>{item.sale_id}</td>
                <td>{item.time_live.slice(0,10)}</td>
                <td>follow</td>
                </tr>)
        })

        let pastSalesTable = (
            <table>
            <tr>
                <th>Sale Name</th>
                <th>ID</th>
                <th>Date Live</th>
                <th>Orders</th>
                {pastSalesHTML}
            </tr>
            </table>
            )

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
                <div className="row">

                    <div className="upcoming-drops col-md-5 offset-md-1">
                        <div className="card-headers">
                            <h3>Upcoming Drops</h3>
                            <a href="/seller/sales/new">Add a new sale</a>
                        </div>
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
                        {pastSalesTable}
                    </div>
                </div>
                <br/>

                <div className="row">
                    <div className="catalogue col-md-10 offset-md-1">
                        <div className="card-headers">
                            <h3>Catalogue</h3>
                            <a href="/seller/catalogue/edit/">Edit your catalogue</a>
                        </div>
                        <ul className="list-inline">
                            {catalogueItemsHTML}
                        </ul>
                    </div>
                </div>



                </body>
            </html>)
    }
}

module.exports = SellerHomepage