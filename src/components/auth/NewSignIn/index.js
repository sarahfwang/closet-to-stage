import React from 'react'
//import { FirebaseAuth } from 'react-firebaseui';
import {withFirebase} from '../../firebase'
import startFirebaseUI from '../../firebase/firebaseui'


class NewSignIn extends React.Component{
    constructor(props){
        super(props)
    }

    componentDidMount(){
        console.log("newsignin props", this.props)
        this.props.firebase.startFirebaseUI("#firebaseui")//need hash mark
    } 
   render(){
       return(
        
           <div id="firebaseui">
               
               
           </div>

       )
   }
}

export default withFirebase(NewSignIn)