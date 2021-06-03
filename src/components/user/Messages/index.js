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

        //need to choose selectedID
        //also need to add, create a timestamp
        /* this.props.firebase.user(cuid).collection("test").doc(selectedID).set({
            affiliated:message
        })

        this.props.firebase.affiliated(cuid).add({
            affiliated: message
        }) */

        //affiliated is an OBJECT
        if(this.props.firebase.affiliated(cuid)== null|| !Object.keys(this.props.firebase.affiliated(cuid)).includes(selectedID)){
            
            //push creates a new space, then you can set it
           
            
            this.props.firebase.rooms().add({
                from: cuid,
                message: message,
                timestamp: Date.now(),
            })
            .then(doc => {
                //doc.id is the room id
                this.props.firebase.affiliated(cuid).add({
                    [selectedID]: doc.id
                })
            })

        }
        else{
            //finds the room key to the itemID in affiliated
            //adds the message to the room key
            //can you do .get(selectedID)?
            this.props.firebase.affiliated(cuid).get()
            .then(doc => {
                //selectedID is the itemID
                //doc[selectedID] is the room key
                this.props.firebase.messages().doc(doc[selectedID]).add({
                    from: cuid,
                    message: message,
                    timestamp: Date.now(),
                })
            })
        }
        console.log("Hi")
        event.preventDefault()
    }
    render(){
        const {itemIDs, selectedID, message} = this.state

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
                        <div className = "shelf-tab" onClick = {()=>{
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
            </div>
        )
    }
}

export default withFirebase(Messages)