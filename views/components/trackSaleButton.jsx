import React from 'react'

//add track sale relation to sale_tracker table
class TrackSale extends React.Component {
    render() {
        let actionURL = "/seller/"+this.props.seller_username+"/sales/"+this.props.sale_id+"/track"
        return (
            <form method="POST" action={actionURL}>
                <input type="submit" value="Track Sale"/>
            </form>
            )

    }
}

export default TrackSale