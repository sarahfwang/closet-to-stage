import React, {Component,} from 'react';
import {compose} from 'recompose'

import {withFirebase} from '../../firebase'
import {withAuthorization} from '../../auth/Session'
//import * as ROLES from '../../constants/roles'

import ItemPageLayout from '../../layouts/ItemPageLayout'
import PasswordChangeForm from '../PasswordChange' 


//TODO: Delete item
class MyCloset extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      user: {},
      loading: true,
      userItems: [],
      filtered: [],
      error: null,

    };
  }
 
  //populate all of the items
  componentDidMount() {
    const userItems = this.props.authUser.userItems
    const user = this.props.authUser

    //if user owns items
    //get data for each and add them to state
    if(userItems){
      let newUserItems = []
      let promises = []
      let count = 0

      userItems.forEach(itemID => {
        const promise = this.props.firebase.items().doc(itemID).get()
        .then(doc => {
          newUserItems.push({id: doc.id, ...doc.data()})
          count++
        })

        promises.push(promise)
      })


      Promise.all(promises).then(()=> {
        console.log("SETSTATE")
        console.log(count, "C",)
        console.log("newUserItems", newUserItems)

        this.setState({
          newUserItems,
          userItems: newUserItems,
          filtered: newUserItems,
        })
      })
      /* const promise = new Promise((resolve, reject) => { //makes sure for each runs before setState
        let count = 0

        userItems.forEach(itemID => {
          
          this.props.firebase.items().doc(itemID)
          .get()
          .then(doc => {
            newUserItems.push({id: doc.id, ...doc.data()})
            //put count++ here, doesnt work
          })
        })
        if(count == userItems.length){
          resolve(newUserItems)
        }
        else{
          reject("no items")
        }       
      }) */

      //maybe only render items after this is called?
      /* promise.then(result => {
        console.log("result", result)
        this.setState({
          userItems: result, 
          filtered: result
        },()=>{
          console.log("promise resolved", this.state)
          console.log(result.length, "length")
          this.setState({show: true})
        }) //result is newUserItems list
      }, error => {
        console.log("promise rejected", error)
      }) */
    }
    this.setState({user, loading: false})
  }

  handleFilterResultsChange = (filtered) =>{
    this.setState({filtered})
  } 

  handleRoute = (route) => {//TODO make it go to update-item/itemID 
    this.props.history.push(route)
  }

  componentWillUnmount() {
    
  }

  //when user clicks onDelete in ItemCard
  handleChangeItems = (itemID) => {
    const {userItems} = this.state

    const updatedUserItems = userItems.splice()

    let count = 0

    console.log("handleChangeItems", itemID)
    userItems.forEach((item, index) => {
      updatedUserItems.splice(index, 1)

      count++
      if(count == userItems.length){
        this.setState({
          userItems: updatedUserItems,
        },()=>console.log("delete State",this.state))
      }

    })

  }

  render() {
    const { loading, userItems, filtered} = this.state //passing userItems as a prop into ItemsList
    console.log("render", this.state)
    
    return (
      <div>
        <h1>My Closet</h1>
        {loading && <p>Loading...</p>}
        {/*  <PasswordChangeForm/> */}

        <ItemPageLayout items = {userItems} filtered = {filtered} handleFilterResultsChange={this.handleFilterResultsChange} handleRoute={this.handleRoute} handleChangeItems={this.handleChangeItems} account = {true} auID = {this.props.authUser.uid}/> 
           
      </div>
    );
  }
}



const condition = authUser => !! authUser

export default compose(
  withFirebase,
  withAuthorization(condition), //somehow this fixed my staying logged in error???
)(MyCloset) //need to study compose

