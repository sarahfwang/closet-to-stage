import React from 'react'
import { getDisplayName } from 'recompose'
import './testitembig.scss'

class TestItemBig extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            urls: ["https://images.unsplash.com/photo-1554080353-a576cf803bda?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGhvdG98ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
            "https://cdn.britannica.com/67/19367-050-885866B4/Valley-Taurus-Mountains-Turkey.jpg",
            "https://dqaecz4y0qq82.cloudfront.net/products/mt735.jpg?preset=zoom&404=y"],
        }
    }
    render(){
        const {urls} = this.state;

        return(
            <div>
                <div className="test-i-b-page">
                    <div className="img-col">
                        <div className="img-cont add-cont">
                            <div className="button-cont">
                                <button>Add photos</button>
                            </div>
                        </div>
                        {urls.map(url => 
                            <div className="img-cont">
                                <img src={url}/>
                            </div>
                        )}
                        
                      
                    </div>
                    <div className="info-col"> 
                        <div className="info-item-name info-cont">
                            <input 
                                type = "text"
                                placeholder="Enter item name"
                                autocomplete="off"
                            ></input>
                        </div>
                        <div className="info-brand-name info-cont">
                            <input 
                                type = "text"
                                placeholder="Enter brand"
                                autocomplete="off"
                            ></input>
                        </div>  
                        <div className="info-price info-cont">
                            <label>$</label>
                            <input 
                                type = "text"
                                placeholder="Enter price"
                                autocomplete="off"
                            ></input>
                        </div>
                        <div className="info-size info-cont">
                            <input 
                                type = "text"
                                placeholder="Enter size"
                                autocomplete="off"
                            ></input>
                        </div>
                        <div className="info-notes info-cont">
                            <textarea 
                                type = "text"
                                placeholder="Enter notes"
                                autocomplete="off"
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
}
export default TestItemBig