import React from 'react'

import { withFirebase } from '../../firebase'
import {withAuthorization} from '../../auth/Session'
import {compose} from 'recompose'

class MessageConsole extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            userItems: [],
            selectedItem: "",
            buyers:[],
        }
    }

    componentDidMount(){
        const cuid = this.props.firebase.cuid()

        //gets all the items owned by the user
        this.props.firebase.user(cuid).get()
        .then(doc => {
            const userItems = doc.data().userItems
            this.setState({userItems})
        })
        //from there, get the items' potential buyers




    }

    setItem = (id) => {
       
        this.setState({selectedItem: id})

        this.props.firebase.itemChats().doc(id).get()
        .then(doc => {
            if(doc.data())
                this.setState({buyers: doc.data().buyers})
            else
                this.setState({buyers: []})
        })

    }

    

    render(){
        const {userItems, selectedItem, buyers} = this.state

        
        return(
            <div>
                {buyers.map(id => (
                    <p key={id} style={{cursor: "pointer"}} onClick = {()=>this.setBuyer(id)}>{id}</p>
                ))}
             
                <ul>
                    {userItems.map(id => (
                        <p key = {id} style={{cursor: "pointer"}} onClick = {() => this.setItem(id)}>{id}</p>
                    ))}
                </ul>
            </div>
        )
    }
}

//prob w Auth too

const condition = authUser => !! authUser

export default compose(
  withFirebase,
  withAuthorization(condition), //somehow this fixed my staying logged in error???
)(MessageConsole) //need to study compose