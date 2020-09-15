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

        //makes dates pretty
        let date_slicer = (date) =>{
            let year = date.slice(0,2)
            let month = date.slice(5,7)
            let day = date.slice(8,10)
            let time = date.slice(11,16)

            return day+"/"+month+"/"+year+" "+time
        }


        //make a div for each item in the catalogue that contains item and image description
        let catalogueItemsHTML = catalogueItems.map((item)=>{
            let editURL = "/seller/catalogue/edit/"+item.item_id
            return (
                <div className="catalogue-card">
                    <img src={item.image_url}/>
                    <div className="catalogue-card-header">
                    <h5>{item.item_name}</h5>
                    <a href={editURL}>Edit</a>
                    </div>
                    <div className="catalogue-card-desc">
                        {item.product_desc}
                    </div>
                </div>)
        })

        //wrap all items into a div with filter search functionality
        let catalogueItemsDiv = <div className="db-divbox"><input type="text" className="filter-search" placeholder="Search your items"/><div className="catalogue-items">{catalogueItemsHTML}</div></div>

        //sort sales into past and upcoming
        let upcomingsales = []
        let pastsales = []
        let now = new Date()
        sales.forEach((item)=>{
            if(Date.parse(item.time_live+"+08:00")>=now){
                upcomingsales.push(item)
            } else {
                pastsales.push(item)
            }
        })

        //make a table rows for past sales
        let pastSalesHTML = pastsales.map((item)=>{
            let closed=<div style={{'color':'red'}} className="text-center">LIVE</div>
            if(item.sold_out){
                closed=<div className="text-center">CLOSED</div>
            }
            return (<tr className="table-row-link">
                <td>{item.sale_name}</td>
                <td className="sale-ID">{item.sale_id}</td>
                <td>{date_slicer(item.time_live)}</td>
                <td className="text-center">{item.order_count}</td>
                <td>{closed}</td>
                </tr>)
        })

        //wrap table into a div with filter search functionality
        let pastSalesTable = (
            <div className="db-table">
            <input type="text" className="filter-table" placeholder="Search past sales"/>
            <table className="past-sales">
            <tr>
                <th>Sale Name</th>
                <th>ID</th>
                <th>Drop Time</th>
                <th>Orders</th>
                <th className="text-center">Status</th>
                {pastSalesHTML}
            </tr>
            </table>
            </div>
            )

        //make table row for upcoming sales, option to edit sales
        let upcomingSalesHTML = upcomingsales.map((item)=>{
            return (<tr>
                <td><a href={`/seller/${seller_username}/sales/${item.sale_id}/`}>{item.sale_name}</a></td>
                <td>{item.sale_id}</td>
                <td>{date_slicer(item.time_live)}</td>
                <td>{item.tracker_count}</td>
                <td><a href={`/seller/${seller_username}/sales/${item.sale_id}/edit`}>Edit</a></td>
                </tr>)
        })

        //wrap table in div with filter search functionality
        let upcomingSalesTable = (
                    <div className="db-table">
                    <input type="text" className="filter-table" placeholder="Search upcoming sales"/>
                    <table>
                        <tr>
                            <th>Sale Name</th>
                            <th>ID</th>
                            <th>Drop Time</th>
                            <th>Trackers</th>
                            <th></th>
                            <th></th>
                        </tr>
                        {upcomingSalesHTML}
                        </table>
                        </div>)

        return (
            <html>
                <Head additionalStyle={{otherScripts: ["/styles/dashboards.css"]}}/>
                <body>
                <NavBar loggedIn={loggedIn}/>
                <div class="container">
                <div class="welcome-header">
                    <h1>Welcome, <span id="username">{seller_username}</span>.</h1>
                    <div>Followers: {followerNo}</div>
                </div>
                <div className="row">

                    <div className="col-md-6">
                    <div className="upcoming-drops">
                        <div className="card-headers">
                            <h3>Upcoming Drops</h3>
                            <a href="/seller/sales/new">Add a new sale</a>
                        </div>
                        {upcomingSalesTable}

                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="past-drops">
                            <div className="card-headers">
                                <h3>Past Drops</h3>
                            </div>
                                {pastSalesTable}
                        </div>
                    </div>
                </div>
                <br/>

                <div className="row">
                    <div className="col-md-12">
                        <div className="catalogue">
                            <div className="card-headers">
                                <h3>Catalogue</h3>
                                <a href="/seller/catalogue/edit/">Edit your catalogue</a>
                            </div>
                                {catalogueItemsDiv}
                        </div>
                    </div>
                </div>
                </div>


                    <script src="/scripts/dashboards.js"></script>
                </body>
            </html>)
    }
}

module.exports = SellerHomepage