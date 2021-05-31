import React from 'react'

import {withFirebase} from '../../firebase'
import MessageBox from '../MessageBox'

import './item.scss'
import 'react-slideshow-image/dist/styles.css'


class Item extends React.Component {
    constructor(props){
        super(props)
        const id = this.props.match.params.itemID //takes itemID from the Route in App
        //https://stackoverflow.com/questions/48084981/how-can-i-get-a-variable-from-the-path-in-react-router

        this.state = {
            id, //sets {id: id}
        }
       
    }

    componentDidMount () {
        const {id} = this.state //gets id value from state

        const itemRef = this.props.firebase.item(id) //gets reference for item with an id of {id}

        itemRef.get()
            .then(doc=>{
                this.setState({...doc.data()}) //destructures the object returened by doc.data(), ids merge to one 
                console.log(this.state)
            })
    }

    render(){
        const {id, itemName, price, brand, size, description, type , color} = this.state

        return(
            <div>
                <div className = "item-page">
                    <div className = "img-col">
                        <div className = "item-img-cont">
                            <div className="main-img-cont">
                                <img/>
                            </div>
                            <div className="side-img-cont">
                                <div>
                                    <div className = "img-prev"></div>
                                </div>
                                <div>
                                    <div className = "img-prev"></div>
                                </div>
                                <div>
                                    <div className = "img-prev"></div>
                                </div>
                                <div>
                                    <div className = "img-prev"></div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <div className="info-col">
                        <h1>{itemName}</h1>
                        <h2>${price}</h2>
                        <p>{brand}</p>
                        <h3>size: {size}</h3>
                        <button>Message</button>
                        <p>notes: {description}</p>
                    </div>
                </div>
                <MessageBox id={id}/>
            </div>
            
        )
    } 
}


export default withFirebase(Item)