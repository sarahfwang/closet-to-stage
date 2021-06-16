import React from 'react'

import './itemCard.scss'

const ItemCard = ({item, handleRoute, ...props}) => {
    console.log("itemcard",props)

    if(props.account){
        return(
            <div className="t-item-card">
            <div className="t-img" onClick= {()=>{handleRoute(item.id)}}>
                <img src = {item.fbUrls[0]}/>
            </div>
            <button>Edit</button>
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

export default ItemCard