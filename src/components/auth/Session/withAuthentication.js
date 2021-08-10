import React from 'react'

import {withFirebase} from '../../firebase'
import {AuthUserContext} from '../Session'

const withAuthentication = Component =>{
    class WithAuthentication extends React.Component{
        constructor(props){
            super(props);
        
            this.state = {
              authUser: null,
            }
          }
        
          componentDidMount () { 
            this.props.firebase.onAuthUserListener(
              authUser =>{ //arbitrary 'authUser' defined in firebase.js
                this.setState({authUser}) //provides context with db user and authuser email and id
              },
              ()=>{
                this.setState({authUser: null}) //arrow functions used to set 'this' properly
              }
            )//listener is triggered every time data changes !!! OH
              
          }
        
          componentWillUnmount () {
            //this.props.firebase.user().off(); //detatches callback
          }
        render(){
            return(
                <AuthUserContext.Provider value={this.state.authUser}>
                    <Component {...this.props} /> 
                </AuthUserContext.Provider>
                
            )
        }
    }
    return withFirebase(WithAuthentication) //WHY ??? does this work
}

export default withAuthentication