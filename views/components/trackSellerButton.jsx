import React from 'react'

//add track seller relation to seller_tracker table
class TrackSeller extends React.Component {
    render() {
        let actionURL = "/seller/"+this.props.seller_username+"/track"
        return (
            <form method="POST" action={actionURL}>
                <input type="submit" value="Track Seller"/>
            </form>
            )

    }
}

export default TrackSeller