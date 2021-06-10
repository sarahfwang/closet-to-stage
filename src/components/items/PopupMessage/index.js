import React from 'react'

import './popup-message.scss'

import {withFirebase} from '../../firebase'
import {withAuthorization} from '../../auth/Session'
import {compose} from 'recompose'

//TODO: pass authuser to everything

class PopupMessage extends React.Component{
    constructor(props){
        super(props)

        this.state ={
            msg:"",
            cuid: props.firebase.cuid(),
            itemID: props.id,

            messages:[],
        }


    }

    componentDidMount (){
        const {itemID, cuid} = this.state
        console.log("cuid", cuid)


       //get all of the messages, in time order
       this.props.firebase.itemChats().doc(itemID).collection(cuid).orderBy('created').onSnapshot(snapshot => {
           let messages = [] //have to set state outside of forEach function
        
            snapshot.forEach(doc => {
                //console.log(doc.id, " => " , doc.data())
                
                messages.push({msg: doc.data().msg, id: doc.id})
                
            })

            this.setState({
                messages
            })
       })

    }

    componentWillUnmount(){

    }

    onSubmit = (event) => {
        const {msg, itemID, cuid} = this.state

        const itemRef = this.props.firebase.itemChats().doc(itemID)


        //TODO: inefficient
       /*  itemRef.add({
            buyers:[]
        })
        .then(doc => {
            if(doc.data().)
                this.props.firebase.itemChats().doc(itemID).update({
                    buyers: [cuid]
                })
            else{
                let buyers = doc.data().buyers.concat(cuid)

                this.props.firebase.itemChats().doc(itemID).update({
                    buyers,
                })
            }
            
        }) */

        this.props.firebase.updateItemBuyers(cuid, itemRef)

        //add the message within the user within the item 
        itemRef.collection(cuid).add({
            msg,
            from: cuid,
            created: this.props.firebase.serverTimestamp(),
        })
        .then(()=>{
            this.setState({msg:""})
        })
       
        event.preventDefault()
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        console.log(this.state)
    }

    render(){
        const {msg, messages} = this.state

        return(
            <div className="popup-message">
                <h3>send messages</h3>
               
                <form autoComplete="off" onSubmit = {this.onSubmit}>
                <div className="see-message">
                    <ul>
                        {messages.map(msg => (
                            <li key = {msg.id}>{msg.msg}</li>
                        ))}
                    </ul>  
                </div>

                <div className = "type-message">
                    <input  type="text" placeholder="talk here" onChange ={this.onChange} name ="msg" value={msg}/>
                    <button type="submit">send</button>
                </div>
                
                </form>
               
            </div>
        )
    } 
}


const condition = authUser => !! authUser

export default compose(
  withFirebase,
  withAuthorization(condition), //somehow this fixed my staying logged in error???
)(PopupMessage) //need to study compose