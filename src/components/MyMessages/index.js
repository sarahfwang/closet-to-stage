import React, {useEffect, useState} from 'react'

import MessageBox from '../items/MessageBox'
import {withAuthorization} from '../auth/Session'
import {compose} from 'recompose'
import { withFirebase } from '../firebase'

//messageBox takes in an itemID as id
//and a buyerID 

const MyMessages = (props) => {
    const [sellIDs, setSell] = useState([])
    const [buyIDs, setBuy] = useState([])
    const [itemID, setItem] = useState("")

    const[prospBuyers, setBuyers] = useState([])

    let messageBox = null

    if(itemID){
         messageBox = <MessageBox id={itemID} buyerID = {props.firebase.currentUser().uid}/>
    }
    else{
         messageBox = <div></div>
    }


    useEffect(()=>{

        const cuid = props.firebase.currentUser().uid

        const userItemsList = ["54jN9tGFtNVHzsqu0Cuq", "YxEeJTPbulsvHRn50qeV"]

        userItemsList.map(itemID => {
            if(props.firebase.itemChats().doc(itemID).exists)
            
        })

        //TODO: don't...do this. Just make it part of users
        const itemsRef = props.firebase.items()
        const userItems = itemsRef.where('userID', '==', cuid).get()
        .then(snapshot => {
            if(snapshot.empty)
                {console.log('user no items')
                return}
            
            //for each item the user owns
            snapshot.forEach(doc => {
                console.log(doc.id)

                props.firebase.itemChats().doc(doc.id).get().then(doc => {
                    if(doc.buyers)
                        console.log(doc.buyers)
                })
                
            })
        })
        .then(()=>{
            //only part where you would actually need firestore
            sellIDs.map(id => {

            })
        })
        .then(()=> {
            console.log(sellIDs)

            //TODO: change to user's buying items
            setBuy(["54jN9tGFtNVHzsqu0Cuq"])
        } 
        )

        //get all the user's owned items
        // returned function will be called on unMount
    }, [])

    return(
        <div>
            <div>
               sell:
               <ul>
                    {sellIDs.map(id => (
                        <li>
                            <p>{id}</p>
                        </li>
                    ))}
               </ul>
               
            </div>
            <div>
                buy
                <ul>
                {buyIDs.map(id => (
                    <li>
                        <p style = {{cursor : "pointer"}}onClick = {()=>{setItem(id)}}>{id}</p>
                    </li>     
                ))}
                </ul>
                
            </div>
            <div>
                messages for: {itemID}
                {messageBox}
                
            </div>

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