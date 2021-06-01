import React from 'react'

import TestFilter from '../../pages/TestFilter'
import ItemCard from '../../items/ItemCard'

import './item-page-layout.scss'

const ItemPageLayout = ({items, filtered, handleFilterResultsChange, handleRoute}) => {

    return (
        <div className="page">
            <div className="col-filter">
                <TestFilter items = {items} handleSearchResultsChange={handleFilterResultsChange}/>
            </div>
            <div className="col-items">
                <div className="nav">
                    <p>path</p>
                </div>
                <div className = "items">
                    {filtered.map(item => (
                        <ItemCard item = {item} handleRoute = {handleRoute}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ItemPageLayout