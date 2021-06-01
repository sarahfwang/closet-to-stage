import React, {Component} from 'react'
import {Link} from "react-router-dom"

import {withFirebase} from '../../firebase'
import SearchBar from '../../items/SearchBar'
import Filter from '../Filter'

import "./old-itempage.css"

class ItemPageBase extends Component{
    constructor(props){
        super(props)
        this.state={
            loading: false,
            itemsList:[], //the list of items
            fullList:[],
            error: null,
        }
    }

    handleSearchResultsChange = (itemsList) => { //pass this to Filter 
        this.setState({itemsList})
        console.log(this.state)
    }

    componentDidMount(){ //work on uploading only a few items to each page
          console.log("hi")
        this.props.firebase.items() // this. referes to element it's called upon
            .where('isListed','==',true)
            .get()
            .then(snapshot => { //TODO .get().then
                let itemsList = [];

                snapshot.forEach(doc => {
                    console.log(doc.id, '=>',doc.data())

                    itemsList.push({itemID: doc.id, ...doc.data()})
                })

                this.setState({itemsList: itemsList, fullList: itemsList}) //itemsList changes, fullList does not
            })

    }

    componentWillUnmount() {
        //this.unsubscribe(); don't need, since .get() instead of .onSnapshot
    }

    render(){
        const {itemsList, fullList} = this.state

        return(
            <div className="row">
                {/*loading status, make sure to change componentdidmount too*/}
                {/* TODO: <SearchBar /> */}
                <div className="path"><p>path</p></div>
                <Filter handleSearchResultsChange = {this.handleSearchResultsChange} fullList={fullList}/> {/*changes state in ItemPage*/}
                <div className="items-list">
                    <div className="category">
                        <h3>Category</h3>
                    </div>
                    <div className="sort-results">
                        <p>sort by</p>
                    </div>
                    <ItemsList  items = {itemsList}/>
                    <div className = "test-items-list">
                        <div className= "test-card">
                            <div className="test-card-content">
                                <div className="test-img-holder">
                                    <div className="test-img"></div>
                                </div>
                                <div className="test-text-holder">
                                    <div className="test-item-name">
                                        <p>test item name eeeeeeeeeeeeeeeeeeeeee</p>
                                    </div>
                                    <div className="test-item-price">
                                        <p>$12.00</p>
                                    </div>
                                    <div className="test-item-brand">
                                        <p>item brand here</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className= "test-card">
                            <div className="test-card-content">
                                <div className="test-img"></div>
                            </div>
                        </div>
                        <div className= "test-card">
                            <div className="test-card-content"></div>
                        </div>
                        <div className= "test-card">
                            <div className="test-card-content"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const ItemsList = ({items}) =>(
    <div > {/*className vs class is React convention*/}
        <ul>
            {items.map(item=>( //map uses ()
                <li key={item.itemID}>
                    <Item item={item}/>
                </li>
            ))}
        </ul>
    </div>
) 

const Item=(props)=>{
    //console.log(item.itemID)
    /* {itemName: , color: , itemID: ,} */

    return(
        <div className="item-card-display">
            <a href={`items/${props.item.itemID}`}> 
                <img src={props.item.imageAsUrl}></img>
            </a>
            
            <div className="item-card-info">
                <p>{props.item.itemName}</p>
                <p>{props.item.price}</p>
                <p>{props.item.size}</p>
                <p>{props.item.brand}</p>
            </div>
            <div className="testing-info">
                <p>type: {props.item.type}</p>
                <p>color: todo</p>
                <p>itemID: {props.item.itemID}</p>
                <p>userID: {props.item.userID}</p>
            </div>
            <Link to={{pathname: `/items/${props.item.itemID}`}}>view</Link>
        </div>
        
    )
}

const ItemPage = withFirebase(ItemPageBase)

export default ItemPage
export {ItemsList, Item }
