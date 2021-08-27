import React, {useState} from 'react'

import TestFilter from '../../pages/TestFilter'
import ItemCard from '../../items/ItemCard'

import './item-page-layout.scss'

const ItemPageLayout = ({items, filtered, handleFilterResultsChange, handleRoute, handleChangeItems, location, auID, ...props}) => {
    console.log("items- layout:", items)
    console.log("filtered - layout:", filtered)
    const [numItems, setNumItems] = useState()

    return (
        <div className="page">
            <div className="item-layout-cont">
                <div className="col-filter">
                    <TestFilter items = {items} handleSearchResultsChange={handleFilterResultsChange} handleRoute={handleRoute} location={location} setNumItems={setNumItems}/>
                </div>
                <div className="col-items">
                    <div className="path">
                        {filtered.length} items found
                        {/* Object.keys(parsed).map(key => 
                            <div>{key}</div>
                        ) */}
                    </div>
                    <div className = "items">
                        {filtered?
                            filtered.map(item => (
                                <ItemCard item = {item} handleRoute = {handleRoute} handleChangeItems={handleChangeItems} auID = {auID} {...props} key={item.id}/> 
                            )) : 
                            <div></div>
                        }
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default ItemPageLayout