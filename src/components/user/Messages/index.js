import React from 'react'

import {withFirebase} from "../../firebase"
import './messages.scss'

//user-icon will likely be used

class Messages extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            itemIDs:["54jN9tGFtNVHzsqu0Cuq"],
            
            messages:[],
            selectedID:"",
            message:"",

            error:"",
        }

    }

    componentDidMount(){

    }

    setSelect = (id) => {
        //retrieve messages from firestore RIGHT AFTER state is set
        this.setState({selectedID:id})
        
        this.props.firebase.messages();
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        }, ()=> console.log(this.state))
    }

    onSubmit = (event) => {
        //add message to firestore

        const {selectedID, message} = this.state

        const cuid = this.props.firebase.currentUser().uid

        let promises = []

        //need to choose selectedID
        //also need to add, create a timestamp
        /* this.props.firebase.user(cuid).collection("test").doc(selectedID).set({
            affiliated:message
        })

        this.props.firebase.affiliated(cuid).add({
            affiliated: message
        }) */

        //affiliated is an OBJECT
        //affiliated() goes to affiliated collection on user doc
        
        if(!this.props.firebase.affiliated().doc(selectedID).exists){
            
            //push creates a new space, then you can set it
           
            const promise = this.props.firebase.rooms().add({})
            .then(doc => {
                //doc.id is the room id
                this.props.firebase.affiliated(cuid).doc(selectedID).set({
                    roomKey: doc.id
                })

                this.props.firebase.rooms().doc(doc.id).collection("messages").add({
                    from: cuid,
                    message: message,
                    timestamp: Date.now(),
                })
            })

            promises.push(promise)

        }
        else{
            //finds the room key to the itemID in affiliated
            //adds the message to the room key
            //can you do .get(selectedID)?

            //returns the collection
            const promise = this.props.firebase.affiliated(cuid).doc(selectedID).get()
            .then(doc => {
                //selectedID is the itemID
                //doc[selectedID] is the room key

                this.props.firebase.rooms().doc(doc.roomKey).collection("messages").add({
                    from: cuid,
                    message: message,
                    timestamp: Date.now(),
                })
            })

            promises.push(promise)
        }

        Promise.all(promises).then(() => {
            this.setState({message:"",})  
        });

        event.preventDefault()
       
    }
    render(){
        const {itemIDs, message, error} = this.state

        return(
            <div className = "message-page">
                <div className = "message-shelf">
                    <div className = "shelf-tab">
                        <div>item</div>
                        {/*overlapping icons */}
                        <div className = "potential-buyers">
                            <div className="icon-cont">
                                <div className="icon-wrapper"></div>
                                <div className = "icon pink"></div>
                            </div>
                            
                            <div className="icon-cont">
                                <div className="icon-wrapper"></div>
                                <div className = "icon blue"></div>
                            </div>
                           
                            <div className="icon-cont">
                                <div className="icon-wrapper"></div>
                                <div className = "icon pink"></div>
                            </div>
                        </div>
                    </div>
                    {itemIDs.map(itemID => (
                        //hmmm TODO: should have the item picture too
                        <div className = "shelf-tab" key={itemID} onClick = {()=>{
                            this.setSelect(itemID)
                            }}>
                            <div>{itemID}</div>
                        </div>

                    ))}
                    
                </div>
                <div className="message-display">
                    <ul>
                        {}
                    </ul>
                    <form className="message-form" onSubmit={this.onSubmit}>
                        <input
                            type = "text"
                            placeholder = "type message"
                            name ="message"
                            value = {message}
                            onChange = {this.onChange}
                        />
                        <button type="submit">Send</button>
                    </form>
                    
                </div>
                <p>{error}</p>
            </div>
        )
    }
}

export default withFirebase(Messages)