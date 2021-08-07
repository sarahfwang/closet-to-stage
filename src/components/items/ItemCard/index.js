import React from 'react'

import './itemCard.scss'
import {withFirebase} from '../../firebase'

const ItemCard = ({item, handleRoute, ...props}) => {
    console.log("itemcard",props.auID)

    const onDelete = event => {//should they be allowed to delete?
        const itemID = item.id
        
        props.firebase.doDeleteItem(itemID, props.auID)

        event.preventDefault();
    }

    const onEdit = () => {
        const itemID = item.id

        props.history.push(`edit-item/${itemID}`)
    }

    //if we are in "my closet" with an authUser, give user access to edit
    if(props.account){
        return(
            <div className="t-item-card">
            <div className="t-img" onClick= {()=>{handleRoute(item.id)}}>
                {item.fbUrls? <img src = {item.fbUrls[0]}/>: <img />}
            </div>
            <button onClick={onEdit}>Edit</button>
            <button onClick={onDelete}>Delete</button>

            <div className="t-info-snipp">
                <h4 className="t-item-name">{item.itemName}</h4>
                <p className="t-item-price">{item.price? item.price : "--"}</p>
                <p className="t-item-brand smol">{item.brand?item.brand: "--"} | {item.size? item.size: "--"}</p>
                
            </div>
            </div>
        )
    }
    return(
        <div className="t-item-card">
            <div className="t-img" onClick= {()=>{handleRoute(item.id)}}>
                <img src = {item.fbUrls[0]}/>
            </div>
            <div className="t-info-snipp">
            <h4 className="t-item-name">{item.itemName}</h4>
                <p className="t-item-price">{item.price? item.price : "--"}</p>
                <p className="t-item-brand smol">{item.brand?item.brand: "--"} | {item.size? item.size: "--"}</p>
                
            </div>
        </div>
    )
}

export default withFirebase(ItemCard)