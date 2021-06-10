import React from 'react'

import PopupMessage from '../../items/PopupMessage'
import { withFirebase } from '../../firebase'
import {withAuthorization} from '../../auth/Session'
import {compose} from 'recompose'

class MessageConsole extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            userItems: [],
            buyers:{},

            selectedItem:"",
            selectedBuyer:"",

            messages:[],
        }
    }

    componentDidMount(){
        const cuid = this.props.firebase.cuid()

        //gets all the items owned by the user
        this.props.firebase.user(cuid).get()
        .then(doc => {
            const userItems = doc.data().userItems
            this.setState({userItems})
        })
        //from there, get the items' potential buyers
        //.then() after setState
        .then(()=>{
            const userItems = this.state.userItems
            //for each userItem in itemChats
            //ones that have doc.data(), or buyers
            //add the userItem like {item:[user1, user2]}

            this.props.firebase.itemChats().where(this.props.firebase.docPath(), "in", userItems).get()
            .then(snapshot => {
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
            })
        })
    }

    setItem = (id) => {
       
        this.setState({selectedItem: id})


        this.props.firebase.itemChats().doc(id).get()
        .then(doc => {
            if(doc.data())
                this.setState({
                    buyers: {[id]:doc.data().buyers, ...this.state.buyers}
                })
            else
                this.setState({buyers: []})
        })

    }

    setItem = (selectedItem, selectedBuyer) => {
        this.setState({
            selectedItem,
            selectedBuyer,
        }, ()=>console.log("state",this.state))

    }
    

    render(){
        const {userItems, selectedItem, selectedBuyer, buyers} = this.state

        if(selectedBuyer)
            return(
                <div>
                    {Object.entries(buyers).map(([item, buyerList]) => 
                        <div key={item}> 
                            <p>item: {item}</p>
                            <ul>buyers: 
                                {buyerList.map(id => 
                                    <li key={id} onClick = {() => this.setItem(item, id)} style = {{cursor: "pointer"}}>{id}</li>
                                )}
                            </ul>
                        </div>
                    )}
                    <div>
                        <PopupMessage itemID = {selectedItem} userID = {selectedBuyer} />
                    </div>
                </div>
                
            )
           
        else
            return(
                <div>
                    {Object.entries(buyers).map(([item, buyerList]) => 
                        <div> 
                            <p>item: {item}</p>
                            <ul>buyers: 
                                {buyerList.map(id => 
                                    <li key={id} onClick = {() => this.setItem(item, id)} style = {{cursor: "pointer"}}>{id}</li>
                                )}
                            </ul>
                        </div>
                    )}
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