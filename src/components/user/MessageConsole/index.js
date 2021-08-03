import React from 'react'

import PopupMessage from '../../items/PopupMessage'
import { withFirebase } from '../../firebase'
import {withAuthorization} from '../../auth/Session'
import {compose} from 'recompose'

import "./message-console.scss"

class MessageConsole extends React.Component{
    constructor(props){
        super(props)

        console.log("mc props", props)

        this.state = {
            /* buyers: {
                [itemID]: {
                    list of potential buyers: [], 
                    coverImgURL: "",
            } */
            buyers:{},

            selectedItem:"",
            toUser:"",
            //give: toUser is the person wanting it
            //want: toUser is authUser

            wantItems:[],

            messages:[],
        }
    }

    componentDidMount(){

        //get all the items owned by the user
        //from there, get the items' potential buyers
        //userItems is a list of all items that have at least one message
        const userItems = this.props.authUser.userItems

        //for each userItem in itemChats
        //ones that have doc.data(), or buyers
        //add the userItem like {item:[user1, user2]}
        /* if(userItems) 
            this.props.firebase.itemChats().where(this.props.firebase.docPath(), "in", userItems).get()
            .then(snapshot => {
                if(snapshot.empty)
                    console.log("No chats")
                else
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
            }) */
        //if the current User has any items that other people messaged for
        //then go into the chats database and find the chats

        //TODO: each item should have a list of buyers... so don't have to go through messages every time. eh honestly this is the same. Saves one step when u want to get img urls, whcih is in items db
        if(userItems)
            userItems.forEach(userItem => {
                let coverImgURL = ""

                this.props.firebase.item(userItem).get()
                .then(doc => {
                    coverImgURL = doc.data().fbUrls[0]
                })


                //get doc ref in chats
                this.props.firebase.itemChats().doc(userItem).get()
                .then(doc => {
                    if (doc.exists) {

                        //add the buyer to lits of buyers
                        this.setState({
                            buyers:{
                                [doc.id]: {
                                    buyerList: doc.data().buyers,
                                    coverImgURL
                                },
                                ...this.state.buyers
                            }
                        })
                    }
                    else {
                        console.log("no chats for", userItem)
                    }
                })
            })

        this.getWants()
    }

    getWants = () => {
        //hmmm could make this a part of itemform TODO
        //hmmm why??
        let wantItems = []

        this.props.firebase.itemChats().where("buyers", "array-contains", this.props.authUser.uid).get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                wantItems.push(doc.id)
            })
        })
        .then(()=>{
            this.setState({wantItems}, console.log("wantItems", wantItems))
        })
    }

    //when the user clicks on an item name from their message shelf
    setItem = (selectedItem, toUser) => {
        this.setState({
            selectedItem,
            toUser,
        }, ()=>console.log("to user:",this.state.toUser))

    }

    //user clicks itemname on the shelf
    //toggles showing the list of potential buyers
    show = (itemID) => {
        const f = document.getElementById(`give-${itemID}`)
        
        if (f.style.display == "none")
            f.style.display = "block"
        else
            f.style.display = "none"

    }
    

    render(){
        const {selectedItem, toUser, buyers, wantItems} = this.state
        // console.log("mc state", this.state)
        let showStyle = {display: "none"}

            return(
                <div className="mc-cont">
                    <div className="mc-shelf">
                    <h2>messages for {this.props.authUser.uid}</h2>
                        <div>
                            <div className="magnus">give:</div>
                            {Object.entries(buyers).map(([item, {buyerList, coverImgURL}]) =>
                                <div key={item} className = "item-on-shelf"> 
                                    <div className="parvus" onClick={() => this.show(item)}>item: {item}</div>
                                    <ul id={`give-${item}`} style = {showStyle}>
                                        {buyerList.map(id => 
                                            <li key={id} onClick = {() => this.setItem(item, id)} style = {{cursor: "pointer"}}>
                                                <div className="mini-img-cont">
                                                    <img className="mini-img" src={coverImgURL}/>
                                                </div>
                                                {id}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="magnus">want:</div>
                                <ul>
                                    {wantItems.map(item => 
                                        <li key={item} onClick = {()=> this.setItem(item, this.props.authUser.uid)} style={{cursor: "pointer"}}>{item}</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    
                    {/*renders message box on right side if an item has the user, honestly don't need conditional
                    
                    toUser always refers to the potential buyer (in database)
                    - in the "want", the toUser is the current user
                    */}
                    <div className="pm-cont"> 
                        {toUser? <PopupMessage itemID = {selectedItem}  toUser = {toUser} /> : null}
                    </div>
                </div>
                
            )
           
        
    }
}

//user needs to be auth first
//then can get user's cuid whenever on this page

const condition = authUser => !! authUser

export default compose(
  withFirebase,
  withAuthorization(condition), //somehow this fixed my staying logged in error???
)(MessageConsole) //need to study compose