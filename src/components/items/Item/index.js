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

            show: false,
           
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

    handlePopUp = () => {
        this.setState({
            show: !this.state.show //TODO: FIX
        })
    }

    render(){
        const {index, itemID, itemName, price, brand, size, description, fbUrls, show} = this.state

        console.log("props", this.props)
        return(
            <div>
                <div className = "item-page">
                    <Slideshow imgSources = {fbUrls}/>
                    
                    <div className="info-col">
                        <h1>{itemName}</h1>
                        <h2>${price}</h2>
                        {brand? <p className="smol">{brand}</p>: <p className="smol">no brand</p>}
                        {size? <h3>size: {size}</h3>: <h3>no size</h3>}
                        <button onClick = {this.handlePopUp}>Message</button>
                        {show ? <PopupMessage itemID = {itemID} toUser = {this.props.authUser.uid}/> : <div></div>}
                        <p>notes: {description}</p>
                    </div>
                </div>
               {/*redirect to sign in page TODO */}
               
               
               
            </div>
            
        )
    } 
}

const condition = authUser => !! authUser

export default compose(
    withFirebase,
    withAuthorization(condition), //somehow this fixed my staying logged in error???
  )(Item) //need to study compose