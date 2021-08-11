import React, {useEffect, useState} from 'react'

import './popup-message.scss'

import {withFirebase} from '../../firebase'
import {withAuthorization} from '../../auth/Session'
import {compose} from 'recompose'

//TODO: pass authuser to everything

const PopupMessage = props => {
    // props: toUser, itemID
    // takes in fromUser from authUser props
    const [msg, setMsg] = useState("")
    const [messages, setMessages] = useState([])

    const fromUser  = props.authUser.uid
    useEffect(()=>{

        //console.log("auth", props.authUser)

        const toUser = props.toUser //toUser contains authUser's id
        const itemID = props.itemID

        //console.log("itemID", itemID, "to", toUser, "from", fromUser)

        if(toUser && itemID)
            props.firebase.itemChats().doc(itemID).collection(toUser).orderBy('created').onSnapshot(snapshot => {
                let messages = [] //have to set state outside of forEach function
            
                snapshot.forEach(doc => {
                    //console.log(doc.id, " => " , doc.data())
                    messages.push({...doc.data(), id: doc.id})
                    
                })
                setMessages(messages)
                console.log(messages,"mess")
            })
        
    },[props.toUser, props.itemID])

   //when a message sends
    const onSubmit = (event) => {
        const toUser = props.toUser
        const itemID = props.itemID
        const itemRef = props.firebase.itemChats().doc(itemID)
        const userRef = props.firebase.user()

        //array union--firebase.js
        //on item.js, this will only show if the toUser is not equal to the authUser
        props.firebase.updateItemBuyers(toUser, msg, itemRef)//pass the full userID, userprofile, 

        //add the message within the user within the item 
        itemRef.collection(toUser).add({
            msg,
            from: fromUser,
            created: props.firebase.serverTimestamp(),
        })
        .then(()=>{
            //clears for next message
            setMsg("")
        })

        //add meta data about chatrooms 
        itemRef.collection("buyerChatMeta").doc(toUser).set({ //buyerID represents chatroom
            lastMsg: msg,
            lastTime: props.firebase.serverTimestamp(),
        })

        //


       
        event.preventDefault()
    }

    const onChange = (event) => {
        //updates value of message in functional state
        setMsg(event.target.value)
    }


    return(
        <div className="popup-message">
            <form autoComplete="off" onSubmit = {onSubmit}>
            <div className="see-message">
                <ul>
                    {messages.map(msg => (
                        //this alright??? TODO
                        msg.from==props.authUser.uid?
                        <li key = {msg.id} className="right"><div className="txt-bubble-right" >{msg.msg}</div></li> :
                        <li key = {msg.id} className = "left"><div className="txt-bubble-left" >{msg.msg}</div></li>
                        
                    ))}
                </ul>  
            </div>

            <div className = "type-message">
                <input className="parvus" type="text" placeholder="talk here" onChange ={onChange} name ="msg" value={msg}/>
                <button className="primary-button parvus send-message" type="submit">send</button>
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