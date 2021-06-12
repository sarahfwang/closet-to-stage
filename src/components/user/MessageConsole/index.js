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
            toUser:"",
            //give: toUser is the person wanting it
            //want: toUser is authUser

            wantItems:[],

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
        /* if(userItems) 
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
            }) */
        if(userItems)
            userItems.forEach(userItem => {

                //get doc ref in chats
                this.props.firebase.itemChats().doc(userItem).get()
                .then(doc => {
                    if (doc.exists) {

                        //add the buyer to buyers
                        this.setState({
                            buyers:{
                                [doc.id]: doc.data().buyers,
                                ...this.state.buyers
                            }
                        })
                    }
                    else {
                        console.log("no chats for", userItem)
                    }
                })
            })

        this.getWants()
    }

    getWants = () => {
        //hmmm could make this a part of itemform TODO
        let wantItems = []

        this.props.firebase.itemChats().where("buyers", "array-contains", this.props.authUser.uid).get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                wantItems.push(doc.id)
            })
        })
        .then(()=>{
            this.setState({wantItems}, console.log("wantItems", wantItems))
        })
    }


    setItem = (selectedItem, toUser) => {
        this.setState({
            selectedItem,
            toUser,
        }, ()=>console.log("to user:",this.state.toUser))

    }
    

    render(){
        const {selectedItem, toUser, buyers, wantItems} = this.state
        console.log("mc state", this.state)
        
            return(
                <div style = {{display:"flex"}}>
                    <div>
                    <p>me: {this.props.authUser.uid}</p>
                        <div>
                            give:
                            {Object.entries(buyers).map(([item, buyerList]) => 
                                <div key={item}> 
                                    <p>item: {item}</p>
                                    <ul>
                                        {buyerList.map(id => 
                                            <li key={id} onClick = {() => this.setItem(item, id)} style = {{cursor: "pointer"}}>{id}</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div>
                            want:
                            <ul>
                                {wantItems.map(item => 
                                    <li key={item} onClick = {()=> this.setItem(item, this.props.authUser.uid)} style={{cursor: "pointer"}}>{item}</li>
                                )}
                            </ul>
                            

                        </div>

                    </div>
                    
                    
                    <div>
                        {toUser? <PopupMessage itemID = {selectedItem} fromUser = {this.props.authUser.uid} toUser = {toUser} /> : null}
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