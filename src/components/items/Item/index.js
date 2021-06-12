import React from 'react'

import {withFirebase} from '../../firebase'
import {withAuthorization} from '../../auth/Session'
import {compose} from 'recompose'
import MessageBox from '../MessageBox'
import Slideshow from '../Slideshow'
import PopupMessage from '../PopupMessage'

import './item.scss'
import 'react-slideshow-image/dist/styles.css'


class Item extends React.Component {
    constructor(props){
        super(props)
        const itemID = this.props.match.params.itemID //takes itemID from the Route in App
        //https://stackoverflow.com/questions/48084981/how-can-i-get-a-variable-from-the-path-in-react-router

        this.state = {
            index:0,
            itemID, //sets {id: id}
            fbUrls: [],
           
        }
       
    }

    componentDidMount () {
        const {itemID} = this.state //gets id value from state

        const itemRef = this.props.firebase.item(itemID) //gets reference for item with an id of {id}

        itemRef.get()
            .then(doc=>{
                this.setState({...doc.data()}) //destructures the object returened by doc.data(), ids merge to one 
                console.log(this.state)
            })
   
    }


    render(){
        const {index, itemID, itemName, price, brand, size, description, fbUrls} = this.state

        console.log("props", this.props)
        return(
            <div>
                <div className = "item-page">
                    <Slideshow imgSources = {fbUrls}/>
                    {/* <div className = "img-col">
                        <div className = "item-img-cont">
                            <div className="main-img-cont">
                                <img src = {fbUrls[index]}/>
                            </div>
                            
                            <div className="side-img-cont">
                                {
                                fbUrls.map(url => 
                                    <div>
                                        <div className = "img-prev">
                                            <img src = {url}/>
                                        </div>
                                    </div>
                                )}
                                
                            </div>
                        </div>
                    </div> */}
                    <div className="info-col">
                        <h1>{itemName}</h1>
                        <h2>${price}</h2>
                        {brand? <p>{brand}</p>: <p>no brand</p>}
                        <button>Message</button>
                        {size? <h3>size: {size}</h3>: <h3>no size</h3>}
                        <p>notes: {description}</p>
                    </div>
                </div>
               {/*redirect to sign in page TODO */}
               {this.props.authUser? <PopupMessage itemID = {itemID} fromUser = {this.props.authUser.uid} toUser = {this.props.authUser.uid}/> : <div></div>}
               
            </div>
            
        )
    } 
}

const condition = authUser => !! authUser

export default compose(
    withFirebase,
    withAuthorization(condition), //somehow this fixed my staying logged in error???
  )(Item) //need to study compose