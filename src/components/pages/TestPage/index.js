import React from 'react'

import {withFirebase} from '../../firebase' 
import { mapProps, renderComponent } from 'recompose'

import "./testpage.scss"
import TestFilter from '../TestFilter'



class TestPage extends React.Component{
    constructor(props){
        super(props)

        this.state = {
           items:[],
           filtered:[],
           loading:"false",
        }
    }
   

    handleFilterResultsChange = (filtered) =>{
        this.setState({filtered})
    }

    handleRoute = (id) => {
        console.log(id)
        this.props.history.push(`/test/${id}`)
    }

    componentDidMount= () => {
        
        this.props.firebase.items()
            .where('isListed', '==', true)
            .get()
            .then(snapshot => {
                let tempList = [] 

                snapshot.forEach(doc => {
                    tempList.push({id: doc.id, ...doc.data()})
                })

                this.setState({
                    items: tempList,
                    filtered: tempList,
                })

            })  
            
    }

    //cat is spec
    
    render(){
        const {items, filtered} = this.state
        return(
            <div className="page">
                <div className="col-filter">
                    <TestFilter items = {items} handleSearchResultsChange={this.handleFilterResultsChange}/>
                </div>
                <div className="col-items">
                    <div className="nav">
                        <p>nav</p>
                    </div>
                    <div className = "items">
                        {filtered.map(item => (
                            <div className="t-item-card">
                            <div className="t-img" onClick= {()=>{this.handleRoute(item.id)}}>
                                <img src = {item.fbUrls[0]}/>
                            </div>
                            <div className="t-info-snipp">
                                <h4 className="t-item-name">{item.itemName}</h4>
                                <p className="t-item-price">{item.price}</p>
                                <p className="t-item-brand">{item.brand} | {item.size}</p>
                                
                            </div>
                        </div>
                        ))}
                          
                        
                    </div>
                </div>
                
            </div>
            
        )
    }
    
}
export default withFirebase(TestPage)