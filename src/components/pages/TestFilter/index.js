import React from 'react' //TODO: add rerouting to new link on filter click?
import {Link} from 'react-router-dom'
import queryString from 'query-string'

import {withFirebase} from '../../firebase'
import './test-filter.scss'
import * as LISTS from '../../../constants/lists'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

//class is basically a re-router
class TestFilter extends React.Component {
    constructor(props){
        super(props)

        // state will represent the queryStringobject to stringify
        this.state ={
            type:[],
            style:[],
            color:[],
        }
    }
    //TODO: MAKE NAV SHOW THE CURRENTLY SELECTED FILTERS< MAKE FILTER SHOW CURRENTLY SELECTED
    componentDidMount(){ //TODO: get rid of parsed in upper component
        console.log("componentDidMount")

        const location = this.props.location
        const parsed = queryString.parse(location.search, {arrayFormat: 'comma'})

        Object.entries(parsed).forEach(([key, value]) => {

            if(Array.isArray(value)){//
                value.forEach(spec => {
                    const checkbox = document.getElementById(spec)
                })
            }
            else{
                const checkbox = document.getElementById(value)
                checkbox.checked = true
            }
        })
    }
    //TODO: if it is in state, make it checked
    onClick = (cat) => (e) => {
        const id = e.target.id //e.g. dress (type)
        const name = e.target.name //e.g. dress (type)
        const value = e.target.value
        const checkbox = document.getElementById(id)
        const location = this.props.location
        
        console.log("id", id)
        console.log("name", name)
        console.log("value", value)
        console.log("location", location)

        console.log("cat", cat)
        console.log(this.state[cat])//contains the array of specs

        console.log("checked", checkbox.checked)
        if(checkbox.checked){ //if checkbox is checked put in array
            this.setState(state => {
                const newList = state[cat].concat(value)

                return({
                    [cat]: newList,
                })
            }, ()=> {
                
                console.log("state", this.state)
                this.stringify()
            })
        }
        else{ //checkbox is unchecked => take out of [cat] array
            this.setState(state => {
                const indexSpec = state[cat].indexOf(value)
                let newList = state[cat]
                newList.splice(indexSpec, 1) //splice returns array of those taken out

                return({
                    [cat]: newList
                })
            }, ()=> {
                console.log("state", this.state)
                this.stringify()
            })
        }
    }

    onClickColor = (e) =>{
        const color = e.target.value
        console.log("color", color)
        console.log("checked", e.target.checked)

        //if it is checked, 
        this.setState({
            color:[color]
        }, ()=> {
            console.log("state", this.state)
            this.stringify()
        })
    }
    

    stringify = () => {//makes current state into a url, pushes new route
        console.log("stringify state", this.state)

        const newQueryString = queryString.stringify(this.state, {arrayFormat: 'comma'})
        console.log(newQueryString)

        this.props.handleRoute(`/listings/?${newQueryString}`) //must let handle route in page??
    }

    
    render(){

        return(
            <div className="filter">
                <div className="category">
                    <h3 className="category-title">Listings</h3> {/*TODO: Make this category title change */}
                </div>

                <div className="filter-wrapper">
                    {/* with more categories, map keys of state */}

                    {/* type, prop is type of article of clothing*/}
                    <div className="filter-cat">
                        <h4 className="filter-cat-title">Type</h4>

                        {LISTS.TYPES.map(thisType => 
                            <label className="selector-wrapper" key={thisType} > {/*label allows full click */}                               
                                <input id={thisType} name={thisType} value={thisType} type="checkbox" onClick={this.onClick("type")} />
                                <span className="checkmark"><FontAwesomeIcon className = "newcheckmark" icon = {faCheck}/></span>
                                <span className="smol">{thisType}</span>
                                {/* <span className="checkmark"><FontAwesomeIcon className = "newcheckmark" icon = {faCheck}/></span>
                                <Link name={type} className="smol"  to={(location) => this.handleFilter(location)(["type", type])}>{type}</Link> */}
                            </label>
                            
                        )}
                        
                    </div>
    
                    {/* dance style */}
                    <div className="filter-cat">
                        <h4 className="filter-cat-title">Style</h4>
                        {LISTS.STYLES.map(style => 
                            <label className="selector-wrapper" key={style}> {/*label allows full click */}
                                <input id={style} name={style} value={style} type="checkbox" onClick={this.onClick("style")}/>
                                <span className="checkmark"><FontAwesomeIcon className = "newcheckmark" icon = {faCheck}/></span>
                                <span className="smol">{style}</span>
                            </label>

                        )}
                    </div>

                    <div className="filter-cat">
                        <h4 className="filter-cat-title">Color</h4>
                        {LISTS.COLORS.map(color => ( //color is only one...so radio?
                            <label className="selector-wrapper" key={color}>
                                <input id={color} value={color} name="color" type="radio" onClick={this.onClickColor} /* onClick={this.onClickMutExclusive("color")} *//>
                                
                                <div className={`swatch-${color}`}></div>
                                
                                {/* <span className={`checkmark-${color}`}></span> */}
                                <span className="smol">{color}</span>

                            </label>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default withFirebase(TestFilter)