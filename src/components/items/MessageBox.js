import React from 'react'
import {withFirebase} from '../firebase'
import './items.css'

class MessageBox extends React.Component{
    constructor(props){
        super(props)

        this.state ={
            msg:"",
            messages:[],
        }


    }

    componentDidMount (){
       /*  const itemID = this.props.id
        const buyerID = this.props.buyerID
        console.log(this.state.messages) */

        
        /* const msgRef = this.props.firebase.itemChats().doc(itemID).collection(buyerID)

        this.msgUnsubscribe = msgRef.onSnapshot(snapshot => { //either get or on snapshot or set upload
            let messages = [] //have to set state outside of forEach function
        
            snapshot.forEach(doc => {
                //console.log(doc.id, " => " , doc.data())
                
                messages.push(doc.data())
                
            })
            //sorts by time
            //TODO: do some sort of FieldValue
            messages.sort((a,b)=>{
                var keyA = a.created,
                keyB = b.created;
                //Compare the 2 timestamps
                if(keyA < keyB ) return -1
                if(keyA > keyB) return 1
                return 0
            })
            this.setState({
                messages
            })
        }) */
    }

    componentWillUnmount(){
        this.msgUnsubscribe()
    }

    onSubmit = (event) => {
        const {msg} = this.state
        const itemID = this.props.id
        const buyerID = this.props.buyerID
        const uid = this.props.firebase.currentUser().uid

        const itemRef = this.props.firebase.itemChats().doc(itemID)
        
        itemRef.get()
        .then(doc =>{
            let buyerList = doc.data().buyers

            if(!buyerList)
                itemRef.update({buyers:[buyerID]})
            else{
                buyerList.concat(buyerID)
                itemRef.update({buyers: buyerList})
            }
                
        })

        itemRef.collection(buyerID).add({
            msg,
            from: uid,
            created: Date.now(),
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
        console.log(messages)

        return(
            <div>
                <h3>messages</h3>
                <ul>
                    {messages.map(msgObj => (
                        <li style={{display:"block"}}>{msgObj.msg}</li>
                    )    
                    )}
                </ul>
                
                <form autoComplete="off" onSubmit = {this.onSubmit}>

                <input type="text" placeholder="talk here" onChange ={this.onChange} name ="msg" value={msg}/>
                <button type="subnit">send</button>
                </form>
               
            </div>
        )
    } 
}

export default withFirebase(MessageBox)