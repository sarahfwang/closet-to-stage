import React, {Component} from 'react'
//import { compose } from 'recompose'

import {withFirebase} from '../../firebase'
//import {withAuthorization} from '../Session'


class ItemEditForm extends Component {
    constructor(props){
        super(props)

        this.state = {
            ...props.item, //spread out item into state-- id: , color: ,
            //initialItem: props.item,
        }
        console.log(this.state)

    }

    onChange = event =>{
        this.setState({
              //...this.state, //merging all the old parts of state with the edited properties below; not necesary anymore
              [event.target.name]:event.target.value //name and value come from the form inputs
        }) 
        console.log(this.state)
    }

    onSubmit = event =>{
        const editItem = this.state //editItem is state {id: , color: , ...}
        const itemID = this.state.id 
        //destructuring {itemID} from state messes things up
        
        this.props.firebase.doEditItem(editItem, itemID)
        event.preventDefault()
    }

    onChangeListing = event => { //what does event.preventDefault do?
        //const newListStatus = !this.state.isListed
        const itemID = this.state.id

        console.log(itemID)

        this.props.firebase.doChangeListing(itemID)
        event.preventDefault()
        //didn't work when changing state and passing it into a firebase function;
        //kept reuploading and changing twice
        //firebase.js handles the isListed change

    }

    onDelete = event => {//should they be allowed to delete?
        const itemID = this.state.id

        console.log(itemID)
        this.props.firebase.doDeleteItem(itemID)

        event.preventDefault();
    }

    render(){
        const {itemName, description, type, brand, quantity, color, price, size} = this.state

        return(
            <form>
                 <input
                    name="itemName"
                    value={itemName}
                    type="text"
                    onChange={this.onChange}
                    placeholder="itemName"
                />
                <br />
                <input
                    name="description"
                    value={description}
                    type="text"
                    onChange={this.onChange}
                    placeholder="description"
                />
                <br />
                <input
                    name="type"
                    value={type}
                    type="text"
                    onChange={this.onChange}
                    placeholder="type"
                />
                <br />
                <input
                    name="brand"
                    value={brand}
                    type="text"
                    onChange={this.onChange}
                    placeholder="brand"
                />
                <br />
                <input
                    name="quantity" //make this have distinct numbers
                    value={quantity}
                    type="text"
                    onChange={this.onChange}
                    placeholder="quantity"
                />
                <br />
                <label htmlFor="color">color: </label>
                <input
                    name="color"
                    value={color}
                    type="color"
                    onChange={this.onChange}
                    placeholder="color"
                />
                <br />
                <input
                    name="size"
                    value={size}
                    type="text"
                    onChange={this.onChange}
                    placeholder="size, ex: M, 2"
                />
                <br />
                <label htmlFor="price">$</label>
                <input
                    name="price"
                    value={price}
                    type="text"
                    onChange={this.onChange}
                    placeholder="00.00"
                />
                <br />
                <button onClick={this.onSubmit}> {/*spent 30 min realizing i spelled submit wrong. -_- */}
                    Change
                </button>
                <button>
                    Cancel Changes {/*no action yet */}
                </button>
                <button onClick={this.onChangeListing}>
                    ChangeListing
                </button>
                <button onClick={this.onDelete}>
                    Delete item
                </button>

            </form>
        )
    }
}
//const condition = authUser => !! authUser
/*export default compose(
  withFirebase,
  withAuthorization(condition), 
)(ItemEditForm) */

export default withFirebase(ItemEditForm)
