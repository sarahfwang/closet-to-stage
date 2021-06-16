import React from 'react'

import TestFilter from '../../pages/TestFilter'
import ItemCard from '../../items/ItemCard'

import './item-page-layout.scss'

const ItemPageLayout = ({items, filtered, handleFilterResultsChange, handleRoute, loc, ...props}) => {
    
    return (
        <div className="page">
            <div className="col-filter">
                <TestFilter items = {items} handleSearchResultsChange={handleFilterResultsChange} loc={loc}/>
            </div>
            <div className="col-items">
                <div className="path">
                    {/* <p>{loc.pathname}</p> */}
                </div>
                <div className = "items">
                   
                    {
                    filtered.map(item => (
                        <ItemCard item = {item} handleRoute = {handleRoute} {...props} key={item.id}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ItemPageLayout