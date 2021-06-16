import React, {useEffect, useState} from 'react'

import './popup-message.scss'

import {withFirebase} from '../../firebase'
import {withAuthorization} from '../../auth/Session'
import {compose} from 'recompose'

//TODO: pass authuser to everything

const PopupMessage = props => {
    const [msg, setMsg] = useState("")
    const [messages, setMessages] = useState([])

    //since these don't change, don't use useState
    //const [userID, setUserID] = useState(props.authUser.uid)
    //const [itemID, setItemID] = useState(props.itemID) 
    const fromUser  = props.authUser.uid
    
    
    //userID is the user in the firestore database
    useEffect(()=>{

        console.log("auth", props.authUser)

        const toUser = props.toUser
        const itemID = props.itemID

        console.log("itemID", itemID, "to", toUser, "from", fromUser)

        if(toUser && itemID)
            props.firebase.itemChats().doc(itemID).collection(toUser).orderBy('created').onSnapshot(snapshot => {
                let messages = [] //have to set state outside of forEach function
            
                snapshot.forEach(doc => {
                    //console.log(doc.id, " => " , doc.data())
                    messages.push({...doc.data(), id: doc.id})
                    
                })
                setMessages(messages)
            })

    },[props.toUser, props.itemID])

   //when a message sends
    const onSubmit = (event) => {
        const toUser = props.toUser
        const itemID = props.itemID

        const itemRef = props.firebase.itemChats().doc(itemID)

        //array union--firebase.js
        props.firebase.updateItemBuyers(toUser, itemRef)

        //add the message within the user within the item 
        itemRef.collection(toUser).add({
            msg,
            from: fromUser,
            created: props.firebase.serverTimestamp(),
        })
        .then(()=>{
            setMsg("")
        })
       
        event.preventDefault()
    }

    const onChange = (event) => {
        setMsg(event.target.value)
       
    }


    return(
        <div className="popup-message" >
            <h3>send messages</h3>
            
            <form autoComplete="off" onSubmit = {onSubmit}>
            <div className="see-message">
                <ul>
                    {messages.map(msg => (
                        //this alright??? TODO
                        msg.from==props.authUser.uid?
                        <li key = {msg.id} style ={{textAlign: "right", listStylePosition: "inside"}}>{msg.msg}, {msg.from} </li> :
                        <li key = {msg.id} style ={{textAlign: "left", listStylePosition: "inside"}}>{msg.msg}, {msg.from} </li> 
                        
                    ))}
                </ul>  
            </div>

            <div className = "type-message">
                <input  type="text" placeholder="talk here" onChange ={onChange} name ="msg" value={msg}/>
                <button type="submit">send</button>
            </div>
            
            </form>
            
        </div>
    )
    
}


const condition = authUser => !! authUser

export default compose(
  withFirebase,
  withAuthorization(condition), //somehow this fixed my staying logged in error???
)(PopupMessage) //need to study compose