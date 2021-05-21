import React from 'react'
import "./testpage.css"

const typeCat = ["Top", "Bottom", "Set", "Leotard", "Dress"]
const styleCat = ["Contemporary", "Ballet", "Jazz"]
const colorCat = ["Red", "Green"]
const TestPage =() =>{
    return(
        <div className="page">
            <div className="col-filter">
                <div className="filter">
                    <div className="category">
                        <h3 className="category-title">Women's Costumes</h3>
                    </div>

                    <div className="filter-wrapper">

                        {/* type */}
                        <div className="filter-cat">
                            <h4 className="filter-cat-title">Type</h4>

                            {typeCat.map(prop => 
                                <div>
                                    <label className="selector-wrapper"> {/*label allows full click */}
                                        <input type="checkbox" />
                                        <span class="checkmark"></span>
                                        {prop}
                                    </label>
                                </div>
                                )}
                        </div>

                        {/* dance style */}
                        <div className="filter-cat">
                            <h4 className="filter-cat-title">Style</h4>

                            {styleCat.map(prop => 
                                <div>
                                    <label className="selector-wrapper"> {/*label allows full click */}
                                        <input type="checkbox" />
                                        <span class="checkmark"></span>
                                        {prop}
                                    </label>
                                </div>
                                )}
                        </div>
                    
                        {/* color */}
                        <div className="filter-cat"> 
                            <h4 className="filter-cat-title">Color</h4>
                                {colorCat.map(prop =>
                                    <div>
                                        <label className="selector-wrapper">
                                            <input type="checkbox" />
                                            <div className="swatch-wrapper">
                                                <div className={`swatch-${prop}`}></div>
                                            </div>
                                            <div className="swatch-label">
                                                {prop}
                                            </div>
                                        </label>
                                    </div>
                                    )}
                            
                            


                        </div>
                    </div>

                </div>
            </div>
            <div className="col-items">
                <div className="nav">
                    <p>nav</p>
                </div>
                <div className = "items">
                    <div className="t-item-card">
                        <div className="t-img"></div>
                        <div className="t-info-snipp">
                            <h4 className="t-item-name">test brand name: longer version overflow</h4>
                            <p className="t-item-price">$12</p>
                            <p className="t-item-brand">lululemon | s</p>
                            
                        </div>
                    </div>
                    <div className="t-item-card">
                        <div className="t-img"></div>
                        <div className="t-info-snipp">
                            <h4 className="t-item-name">test brand name: longer version, overflow</h4>
                            <p className="t-item-price">$12</p>
                            <p className="t-item-brand">lululemon</p>
                        </div>
                    </div>
                    <div className="t-item-card">
                        <div className="t-img"></div>
                        <div className="t-info-snipp">
                            <h4 className="t-item-name">test brand name: longer version, overflow</h4>
                            <p className="t-item-price">$12</p>
                            <p className="t-item-brand">lululemon</p>
                        </div>
                    </div>
                    <div className="t-item-card">
                        <div className="t-img"></div>
                        <div className="t-info-snipp">
                            <h4 className="t-item-name">test brand name: longer version, overflow</h4>
                            <p className="t-item-price">$12</p>
                            <p className="t-item-brand">lululemon</p>
                        </div>
                    </div>
                    
                </div>
            </div>
            
        </div>
        
    )
}
export default TestPage