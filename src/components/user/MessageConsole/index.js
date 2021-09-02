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
            wantItems:{},

            messages:[],
        }
    }

    componentDidMount(){
        //get all the items owned by the user
        //from there, get the items' potential buyers
        //userItems is a list of all items that have at least one message
        const userItems = this.props.authUser.userItems

        //TODO: each item should have a list of buyers... so don't have to go through messages every time. eh honestly this is the same. Saves one step when u want to get img urls, whcih is in items db
        if(userItems)
            userItems.forEach(userItem => {//for each item the user has
                let coverImgURL = ""
                let itemName = ""

                this.props.firebase.item(userItem).get()
                .then(doc => {
                    coverImgURL = doc.data().fbUrls[0]
                    itemName = doc.data().itemName
                })


                //get doc ref in chats
                this.props.firebase.itemChats().doc(userItem).get()
                .then(doc => { //for each item that someone inuqired about
                    if (doc.exists) {
                        //add the buyer to lits of buyers
                        const buyerIDs = doc.data().buyers
                        let buyerProfiles = []
                        let buyerUsernames = []

                        //only after looping through all potential buyers
                        let buyerPromises = []

                        buyerIDs.forEach(buyerID => {
                            const promise = this.props.firebase.user(buyerID).get()
                            .then(doc=>{
                                let buyerProfile = doc.data().profile
                                let buyerUsername = doc.data().username

                                if (!buyerProfile){
                                    buyerProfile = ""
                                }

                                if(!buyerUsername){
                                    buyerUsername = ""
                                }

                                buyerProfiles = buyerProfiles.concat(buyerProfile)
                                buyerUsernames = buyerUsernames.concat(buyerUsername)
                            })

                            buyerPromises.push(promise)
                        })

                        Promise.all(buyerPromises).then(()=> {
                            this.setState({
                                buyers:{
                                    [doc.id]: {
                                        buyerIDs,
                                        buyerProfiles,
                                        buyerUsernames,
                                        coverImgURL,
                                        itemName,
                                    }
                                }
                            }, ()=>console.log(this.state,"buyer"))
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
        //why we need buyers array
        this.props.firebase.itemChats().where("buyers", "array-contains", this.props.authUser.uid).get() //less buggy because one true database
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
               
                let coverImg = ""
                let itemName = ""
      
                //get the image and owner for the item
                this.props.firebase.item(doc.id).get().then(item => {
                    coverImg = item.data().fbUrls[0]
                    itemName = item.data().itemName
                })
                .then(() => {
                    console.log(coverImg,"cover")
                    console.log(itemName, "itemName")
                    this.setState({
                        want:{
                            [doc.id]:{
                                coverImg,
                                itemName,
                        
                            },
                            ...this.state.want
                        }
                    })
                })
            })
        })
    }

    //when the user clicks on an item name from their message shelf
    //selected Item, toUser=user in database(buyer)
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
        const {selectedItem, toUser, buyers, wantItems, want} = this.state
        // console.log("mc state", this.state)
        let showStyle = {display: "none"}
        if (want)
            console.log("want", Object.entries(want))

            return(
                <div className="mc-cont page">
                    <div className="mc-shelf">
                    <h2>messages for {this.props.authUser.username}</h2>
                        <div className="magnus">clotheshanger</div>
                        <div className="mc-section">
                            {
                                Object.entries(buyers).map(([itemID, {buyerIDs, buyerProfiles, buyerUsernames, coverImgURL, itemName}]) =>
                                    <div key={itemID}> 
                                        <div className = "mc-item" onClick={() => this.show(itemID)}>
                                            <img className="mini-img" src={coverImgURL}/>
                                            <div className="parvus mc-name">{itemName}</div>
                                        </div>
                                        
                                        <ul id={`give-${itemID}`} style = {showStyle} className="mc-buyers-list">
                                            {buyerIDs.map((id, index) => //list of buyers for closet item
                                                <li key={id} onClick = {() => this.setItem(itemID, id)} style = {{cursor: "pointer"}} className="mc-buyer">
                                                    <img className="mini-img" src={buyerProfiles[index]}/>
                                                    <div className="parvus mc-name">{buyerUsernames[index]}</div>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )
                                //if the user does not receive messages about their items  TODO
                            }
                        </div>
               
                 
                        <div className="magnus">want:</div>
                        <div className="mc-section">
                            <ul className="mc-want-list">
                                {want? Object.entries(want).map(([itemID, {coverImg, itemName}])=>
                                <li key = {itemID} onClick = {() => this.setItem(itemID, this.props.authUser.uid)} style = {{cursor: "pointer"}} className="mc-item">
                                    <img className="mini-img" src={coverImg}/>
                                    <div className="parvus mc-name" >{itemName}</div>
                                </li>
                                ):
                                <div></div>}
                            
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