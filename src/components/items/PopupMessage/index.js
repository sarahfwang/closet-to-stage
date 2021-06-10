import React, {useEffect, useState} from 'react'

import './popup-message.scss'

import {withFirebase} from '../../firebase'
import {withAuthorization} from '../../auth/Session'
import {compose} from 'recompose'

//TODO: pass authuser to everything

const PopupMessage = props => {
    const [msg, setMsg] = useState("")
    const [messages, setMessages] = useState([])

    const [userID, setUserID] = useState(props.userID)
    const [itemID, setItemID] = useState(props.itemID)

    
    useEffect(()=>{
        setUserID(props.userID)
        setItemID(props.itemID)

        props.firebase.itemChats().doc(itemID).collection(userID).orderBy('created').onSnapshot(snapshot => {
            let messages = [] //have to set state outside of forEach function
        
            snapshot.forEach(doc => {
                //console.log(doc.id, " => " , doc.data())
                
                messages.push({...doc.data(), id: doc.id})
                
            })
            setMessages(messages)
        })

    },[props.userID, userID, props.itemID, itemID])

   
    const onSubmit = (event) => {

        const itemRef = props.firebase.itemChats().doc(itemID)

        //array union--firebase.js
        props.firebase.updateItemBuyers(userID, itemRef)

        //add the message within the user within the item 
        itemRef.collection(userID).add({
            msg,
            from: userID,
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
                        <li key = {msg.id}>{msg.msg}</li>
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