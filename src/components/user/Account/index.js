import React, {Component } from 'react';
import {compose} from 'recompose'

import {withFirebase} from '../../firebase'
import {withAuthorization} from '../../auth/Session'
//import * as ROLES from '../../constants/roles'

import ItemPageLayout from '../../layouts/ItemPageLayout'

import PasswordChangeForm from '../PasswordChange' 
import ItemEdit from '../../items/ItemEdit'

import './account.css'

//TODO: Delete item
class AccountPage extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      user: {},
      loading: false,
      userItems: [],
      filtered: [],
    };
  }
 
  componentDidMount() {
    this.setState({ loading: true });

    var cuser = this.props.firebase.currentUser()
    console.log(cuser)

    if(cuser != null){ //but do you really need this? because account can only be accessed by auth users
        var cuid = cuser.uid;
        //console.log(cuid)
        
        this.unsubscribeUser = this.props.firebase.user(cuid)
          .onSnapshot(snapshot => { //or change back to .get
            if(snapshot){//need???
              this.setState({
                user: snapshot.data(),
                loading: false
              })
              //console.log(this.state.user)
            }  
          })

          this.props.firebase.items().where('userID','==',cuid)
            .get().then(querySnapshot => {
              let userItems = []
              if(querySnapshot.empty){
                console.log("No Items for this User")
                return;
              }

              querySnapshot.forEach(doc => {
                //doc.data() returns an object-- the full item
                userItems.push({id: doc.id, ...doc.data()})
                //console.log(userItems)
              })

              this.setState({ //setting all of userItems to state to send   to <ItemsList/>
                userItems,
                filtered: userItems,
              })

            })

    }
  }
  handleFilterResultsChange = (filtered) =>{
    this.setState({filtered})
} 
  componentWillUnmount() {
      this.unsubscribeUser()
     
      //this.props.firebase.users().off()//removes the listener??? or user().off()
  }
  render() {
      const { user, loading, userItems, filtered } = this.state //passing userItems as a prop into ItemsList
 
    return (
      <div>
        <h1>Account</h1>
        <p>Account details</p>
        
        {loading && <p>Loading...</p>}
        <PasswordChangeForm/>
        <User user={user} />

        <a href="/itemform"> Add Item</a>


            <ItemPageLayout items = {userItems} filtered = {filtered} handleFilterResultsChange={this.handleFilterResultsChange} handleRoute={()=>{}} account = {true} />
            <ItemsList items = {userItems} /> 
      </div>
    );
  }
}

const User = ({user}) => ( 
    <div>
      <ul>   
          <li >
              <span>
                  <p>Email: {user.email}</p>
              </span>
              <span>
                  <p> username: {user.username}</p>
              </span>
          </li>     
      </ul>

    </div>
)

const ItemsList = (props) => { //props: {items: [{item1}, {item2}, ...]}
  
  return (
    <div className="itemslist">
      <ul>
        {props.items.map(item=> <li key={item.id}> <ItemEdit item={item}/> </li>)} 
      </ul>
    </div>
  )
}


 const Item =  (props) =>{ //or use ({item}) instead of (props) and change accoridngly
  //console.log(props.item)
return(
    <div className="item">
      <strong>itemName: {props.item.item.itemName}, color: {props.item.item.color} </strong>
    </div>
  )
} 
 


const condition = authUser => !! authUser

export default compose(
  withFirebase,
  withAuthorization(condition), //somehow this fixed my staying logged in error???
)(AccountPage) //need to study compose

