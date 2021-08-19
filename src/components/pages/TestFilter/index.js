import React from 'react' //TODO: add rerouting to new link on filter click?
import {Link} from 'react-router-dom'
import queryString from 'query-string'

import {withFirebase} from '../../firebase'
import './test-filter.scss'
import * as LISTS from '../../../constants/lists'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'


class TestFilter extends React.Component {
    constructor(props){
        super(props)

        // state will represent the queryStringobject to stringify
        this.state ={
            type:[],
            style:[],
            //color:"",
        }
    }

    
    onClick = (cat) => (e) => {
        const id = e.target.id //e.g. type
        const name = e.target.name //e.g. type
        const checkbox = document.getElementById(id)
        const location = this.props.location

        console.log("location", location)
        console.log("name", name)
        console.log("cat", cat)
        console.log(this.state[cat])


        if(checkbox.checked){
            this.setState(state => {
                const newList = state[cat].concat(name)

                return({
                    [cat]: newList,
                })
            }, ()=> {
                console.log("state", this.state)
                this.stringify()
            })
        }
        else{
            this.setState(state => {
                const indexSpec = state[cat].indexOf(name)
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

    stringify = () => {
        /* Object.entries(this.state).forEach(([cat, specArr])=> {
            console.log("key", cat, "value", specArr)
        }) */

        //TODO: GOTTA RESURFACE STATE as in, make state part of the itemPage

        console.log(this.state)
        const newQueryString = queryString.stringify(this.state, {arrayFormat: 'comma'})

        console.log(newQueryString)

        this.props.handleRoute(`/listings/?${newQueryString}`) //must let handle route in page??
        
        
    }

    /* updateItemsList = () => {
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
    } */

    //DONT USE
    handleFilter = (location) => ([cat,spec]) =>{
        console.log("state", this.state)
        //console.log("location", location)
        console.log("cat", cat)
        console.log("spec", spec)

        const parsed = queryString.parse(location.search)
        console.log("parsed", parsed)

        if(this.state[cat].indexOf(spec) > 0){//already exists
            this.setState(state => {
                const indexSpec = state[cat].indexOf(spec)
                const newCatArr = state[cat].splice(indexSpec, 1)

                return({
                    [cat]: newCatArr,
                })
            })
        }
        else{
            this.setState(state => {
                const newCatArr = state[cat].concat(spec)

            return({
                [cat]: newCatArr,
            })

            })
        }
        return(`${location.pathname}?sort=name`)
    }

    render(){
        const{type, style, color} = this.state

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
    
                        {/* {Object.keys(type).map(prop => 
                            <div key={prop}>
                                <label className="selector-wrapper"> 
                                    <input id={prop} name={prop} type="checkbox" onClick={this.onClick("type")}/>
                                    <span className="checkmark"><FontAwesomeIcon className = "newcheckmark" icon = {faCheck}/></span>
                                    <span className="smol">{prop}</span>
                                </label>
                            </div>
                            )} */}

                        {LISTS.TYPES.map(type => 
                            <label className="selector-wrapper" key={type} > {/*label allows full click */}
                                <input id={type} name={type} type="checkbox" onClick={this.onClick("type")}/>
                                <span className="checkmark"><FontAwesomeIcon className = "newcheckmark" icon = {faCheck}/></span>
                                <span className="smol">{type}</span>
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
                                <input id={style} name={style} type="checkbox" onClick={this.onClick("style")}/>
                                <span className="checkmark"><FontAwesomeIcon className = "newcheckmark" icon = {faCheck}/></span>
                                <span className="smol">{style}</span>
                            </label>

                        )}
    
                       
                    </div>

                    <div>
                        <Link
                            to={{
                                pathname:"/courses",
                                search:"?sort=name?add=item",
                                hash:"#the-hash",
                                state: {fromhere: true}
                            }}
                        >Take me there</Link>
                    </div>
                
                    {/* color */}
                    {/* <div className="filter-cat"> 
                        <h4 className="filter-cat-title">Color</h4>

                        
                        {LISTS.COLORS.map(color => 
                            <label className="selector-wrapper" key={color}>
                                <input type="checkbox" />
                                <div className="swatch-wrapper">
                                    <div className={`swatch-${color}`}></div>
                                </div>
                                <div className="swatch-label">
                                    <span className="smol">{color}</span>
                                </div>
                            </label>
                        )}
                    </div> */}

                </div>
        
            </div>
        )
    }
}

export default withFirebase(TestFilter)