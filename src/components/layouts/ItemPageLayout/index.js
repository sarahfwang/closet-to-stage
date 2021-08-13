import React, {useState} from 'react'

import TestFilter from '../../pages/TestFilter'
import ItemCard from '../../items/ItemCard'

import './item-page-layout.scss'

const ItemPageLayout = ({items, filtered, handleFilterResultsChange, handleRoute, loc, auID, ...props}) => {
    const [numItems, setNumItems] = useState()

    return (
        <div className="page">
            <div className="item-layout-cont">
                <div className="col-filter">
                    <TestFilter items = {items} handleSearchResultsChange={handleFilterResultsChange} loc={loc} setNumItems={setNumItems}/>
                </div>
                <div className="col-items">
                    <div className="path">
                        {/* {<p>{loc.pathname}</p>} */}
                    </div>
                    <div className = "items">
                        {filtered?
                            filtered.map(item => (
                                <ItemCard item = {item} handleRoute = {handleRoute} auID = {auID} {...props} key={item.id}/> 
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