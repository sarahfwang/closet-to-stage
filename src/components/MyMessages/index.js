import React, {useEffect, useState} from 'react'

import MessageBox from '../items/MessageBox'
import {withAuthorization} from '../auth/Session'
import {compose, mapPropsStream} from 'recompose'
import { withFirebase } from '../firebase'

//messageBox takes in an itemID as id
//and a buyerID 
const want = ["54jN9tGFtNVHzsqu0Cuq", "YxEeJTPbulsvHRn50qeV"]
const give = ["LQGHpu0YNiHfarqZqfQJ"]


//user, sarah, wants u's item
const MyMessages = (props) => {
    const uid = props.firebase.currentUser().uid
    const [buyerIDs, setBuyers] = useState([])

    useEffect(() => {


        give.map(itemID => {
    
            //props.firebase.itemChats().doc("54jN9tGFtNVHzsqu0Cuq").get().then(doc => console.log(doc.data()))
            
            //doesn't work like this!: console.log(props.firebase.itemChats().doc("54jN9tGFtNVHzsqu0Cuq").exists)
            
            props.firebase.itemChats().doc(itemID).get()
            .then(doc => {
                if(doc){
                    const buyerIDs = doc.data().buyers       
                    setBuyers(buyerIDs)              
                }                        
            })
        
        })
    }, [])

    return(
        <div>
            want
            <ul>
                {want.map(itemID => (
                    <div>
                        {itemID}
                        <MessageBox id = {itemID} buyerID = {uid}/>
                        <br/>
                    </div>
                ))}
            </ul>

            give
            <ul>
                {buyerIDs.map(buyerID => (
                    <MessageBox id = {"LQGHpu0YNiHfarqZqfQJ"} buyerID = {buyerID}/>
                ))}
            </ul>
        </div>
    )
}

const condition = authUser => !! authUser
//need withAuth to access current user
export default compose(
  withFirebase,
  withAuthorization(condition), //somehow this fixed my staying logged in error???
)(MyMessages) //need to study compose

//get all user's owned items (query)
//get all user's past messaged ITEMS (query) (empty for now)
//display the buy and sell