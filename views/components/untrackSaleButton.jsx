import React from 'react'

//delete sale track relation
class UntrackSale extends React.Component {
    render() {
        let actionURL = "/seller/"+this.props.seller_username+"/sales/"+this.props.sale_id+"/track?_method=DELETE"
        return (
            <form method="POST" action={actionURL}>
                <input type="submit" value="Untrack Sale"/>
            </form>
            )

    }
}

export default UntrackSale