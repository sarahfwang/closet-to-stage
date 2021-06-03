import React from 'react'

import './item-edit-card.scss'
//card should show messages
//make handle route go to a full page
//otherwise make a button that shows a pop up edit

const ItemCard = ({item, handleRoute}) => {
    return(
        <div className="t-item-card">
            <div className="t-img" onClick= {()=>{handleRoute(item.id)}}>
                <img src = {item.fbUrls[0]}/>
                <button>Edit</button>
            </div>
            <div className="t-info-snipp">
                <h4 className="t-item-name">{item.itemName}</h4>
                <p className="t-item-price">{item.price}</p>
                <p className="t-item-brand">{item.brand} | {item.size}</p>
            </div>
        </div>
    )
}

export default ItemCard