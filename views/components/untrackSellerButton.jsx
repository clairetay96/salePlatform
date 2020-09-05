import React from 'react'

class UntrackSeller extends React.Component {
    render() {
        let actionURL = "/seller/"+this.props.seller_username+"/track?_method=DELETE"
        return (
            <form method="POST" action={actionURL}>
                <input type="submit" value="Untrack Seller"/>
            </form>
            )

    }
}

export default UntrackSeller