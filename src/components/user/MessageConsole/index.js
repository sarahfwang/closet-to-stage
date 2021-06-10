import React from 'react'

import PopupMessage from '../../items/PopupMessage'
import { withFirebase } from '../../firebase'
import {withAuthorization} from '../../auth/Session'
import {compose} from 'recompose'

class MessageConsole extends React.Component{
    constructor(props){
        super(props)

        console.log("mc props", props)

        this.state = {
            buyers:{},

            selectedItem:"",
            selectedBuyer:"",

            messages:[],
        }
    }

    componentDidMount(){

        //get all the items owned by the user
        //from there, get the items' potential buyers
       
        const userItems = this.props.authUser.userItems

        //for each userItem in itemChats
        //ones that have doc.data(), or buyers
        //add the userItem like {item:[user1, user2]}
        if(userItems) 
            this.props.firebase.itemChats().where(this.props.firebase.docPath(), "in", userItems).get()
            .then(snapshot => {
                if(snapshot.empty)
                    console.log("No chats")
                else
                    snapshot.forEach(doc => {
                        //doc is item, doc.id==item.id
                        console.log(doc.id,"->",doc.data())

                        this.setState(state => {
                            //state.buyers is an object with key value-array pairs 

                            return {
                                buyers:{
                                    [doc.id]: doc.data().buyers,
                                    ...state.buyers
                                }
                            }
                        })
                    
                    })
            })
        
    }

    setItem = (id) => {
       
        this.setState({selectedItem: id})


        this.props.firebase.itemChats().doc(id).get()
        .then(doc => {
            if(doc.data())
                this.setState({
                    buyers: {[id]:doc.data().buyers, ...this.state.buyers}
                })
            else
                this.setState({buyers: []})
        })

    }

    setItem = (selectedItem, selectedBuyer) => {
        this.setState({
            selectedItem,
            selectedBuyer,
        }, ()=>console.log("state",this.state))

        this.setState({
            random:"hi"
        })

    }
    

    render(){
        const {userItems, selectedItem, selectedBuyer, buyers} = this.state
        console.log("mc state", this.state)
        
            return(
                <div>
                    message console
                    <div>
                        {Object.entries(buyers).map(([item, buyerList]) => 
                            <div key={item}> 
                                <p>item: {item}</p>
                                <ul>buyers: 
                                    {buyerList.map(id => 
                                        <li key={id} onClick = {() => this.setItem(item, id)} style = {{cursor: "pointer"}}>{id}</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                    
                    <div>
                        {selectedBuyer? <PopupMessage itemID = {this.state.selectedItem} userID = {this.state.selectedBuyer} /> : null}
                    </div>
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