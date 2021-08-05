import React from 'react'
import {useLocation, withRouter} from 'react-router-dom'

import {withFirebase} from '../../firebase'
import './test-filter.scss'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { fas, faUser } from '@fortawesome/free-regular-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

class TestFilter extends React.Component {
    constructor(props){
        super(props)

        this.state ={
            type:{Top:false, Bottom:false, },
            style:{Ballet:false, Jazz:false },
            color:{Red:false, Green:false},
        }
        
        console.log(this.props.loc)

    }

    
    onClick = (cat) => (e) => {
        const id = e.target.id
        const name = e.target.name

        const checkbox = document.getElementById(id)

        console.log("location", this.props.location)

        //changes to true or false, depending on checkmark
        this.setState({
            [cat]:{
                ...this.state[cat],
                [name]: checkbox.checked
            }
        }, this.updateItemsList)
    }

    updateItemsList = () => {
        let promises = []
        let temp = this.props.items

        Object.entries(this.state).map(([cat, catChecks]) => {
            let queryCat = []

            Object.entries(catChecks).map(([field, check]) => {
                //if Top=true
                //'Top' => 'top', so that fb looks for 'style = top'
                if(check)
                    queryCat.push(field.toLowerCase())
            })

            let zeroList = []

            if(queryCat.length>0){
                //where brand, 'in', [Capezio, ]
                let promise = this.props.firebase.items().where(cat, 'in', queryCat)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        if(doc.data().isListed){
                            const found = temp.some(il => il.id === doc.id)

                            if(found){ //why found instead of !found?
                                zeroList.push({id: doc.id, ...doc.data()})
                            }
                        }
                    })
                })
                .then(()=>{
                    temp = zeroList
                })
                
                promises.push(promise)

            }
        })

        Promise.all(promises).then(()=> {
            this.props.handleSearchResultsChange(temp)
            console.log(temp)
        })
    }

    render(){
        const{type, style, color} = this.state

        return(
            <div className="filter">
                <div className="category">
                    <h3 className="category-title">Women</h3>
                </div>
    
                <div className="filter-wrapper">
                    {/* with more categories, map keys of state */}

                    {/* type, prop is type of article of clothing*/}
                    <div className="filter-cat">
                        <h4 className="filter-cat-title">Type</h4>
    
                        {Object.keys(type).map(prop => 
                            <div key={prop}>
                                <label className="selector-wrapper"> {/*label allows full click */}
                                    <input id={prop} name={prop} type="checkbox" onClick={this.onClick("type")}/>
                                    <span className="checkmark"><FontAwesomeIcon className = "newcheckmark" icon = {faCheck}/></span>
                                    <span className="smol">{prop}</span>
                                </label>
                            </div>
                            )}
                        
                    </div>
    
                    {/* dance style */}
                    <div className="filter-cat">
                        <h4 className="filter-cat-title">Style</h4>
    
                        {Object.keys(style).map(prop => 
                            <div key={prop}>
                                <label className="selector-wrapper"> {/*label allows full click */}
                                <input id={prop} name={prop} type="checkbox" onClick={this.onClick("style")}/>
                                    <span className="checkmark"><FontAwesomeIcon className = "newcheckmark" icon = {faCheck}/></span>
                                    <span className="smol">{prop}</span>
                                </label>
                            </div>
                            )}
                    </div>
                
                    {/* color */}
                    <div className="filter-cat"> 
                        <h4 className="filter-cat-title">Color</h4>
                        {Object.keys(color).map(prop =>
                            <div key={prop}>
                                <label className="selector-wrapper">
                                    <input type="checkbox" />
                                    <div className="swatch-wrapper">
                                        <div className={`swatch-${prop}`}></div>
                                    </div>
                                    <div className="swatch-label">
                                    <span className="smol">{prop}</span>
                                    </div>
                                </label>
                            </div>
                            )}
                    </div>
                </div>
        
            </div>
        )
    }
}

export default withFirebase(TestFilter)