import React from 'react'

//head tag present in every page for uniform styling
class Head extends React.Component {
    render () {

        let otherScriptsHTML = []

        //if additional styles are specified, generate a link stylesheet tag for each
        if(this.props.additionalStyle){
            this.props.additionalStyle.otherScripts.forEach((item)=>{
                otherScriptsHTML.push(<link href={item} rel="stylesheet"/>)
            })
        }

        return (
            <head>
                <title>Hayaku</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>

                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous" />

                <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"/>

                <link rel="stylesheet" href="/styles/index.css"/>
                {otherScriptsHTML}
            </head>

            )
    }
}

export default Head