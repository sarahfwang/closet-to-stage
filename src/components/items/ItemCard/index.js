import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'

import './itemCard.scss'
import {withFirebase} from '../../firebase'

const ItemCard = ({item, handleRoute, ...props}) => {
    const [itemID, setItemID] = useState('')
    
    useEffect(() => {
        setItemID(item.id)
        console.log("itemcard itemID",item.id)
    }, [item])
  

    const onDelete = event => {//should they be allowed to delete? TODO: Make delete

        const itemID = item.id
        
        //deleted from firebase
        props.firebase.doDeleteItem(itemID, props.auID)

        //deletes from algolia
        props.firebase.doDeleteNote(itemID, "items")

        //delete from top-layer page (which keeps items)
        props.handleChangeItems(itemID)

    }

    //if we are in "my closet" with an authUser, give user access to edit
    
        return(
            <div className="t-item-card ">
            <div className="t-img" onClick= {()=>{handleRoute(`/item-page/${itemID}`)}}>
                {item.fbUrls? <img src = {item.fbUrls[0]}/>: <img/>}
            </div>
            {props.account ?  
            <div>
                <Link to={{pathname: `/update-item/${itemID}`}} className="primary-button minor">Edit</Link>
                <button className="secondary-button minor" onClick={onDelete}>Delete</button>
            </div>:
            <div></div>
            }
            <div className="t-info-snipp">
                <h4 className="t-item-name">{item.itemName}</h4>
                <p className="t-item-price">{item.price? `$${item.price}` : "$--"}</p>
                <p className="t-item-brand smol">{item.brand?item.brand: "NA"} | {item.size? `size: ${item.size}`: "NA"}</p>
            </div>
            </div>
        )
    
   
}

export default withFirebase(ItemCard)