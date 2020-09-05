import React from 'react'

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