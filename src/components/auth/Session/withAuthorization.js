import React from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose' //??? still don't really understand this

import {withFirebase} from '../../firebase'
import * as ROUTES from '../../../constants/routes'
import AuthUserContext from './context'

const withAuthorization = condition => Component => { //withAuthorization(condition){return anyfunction(Component){return }}
    class WithAuthorization extends React.Component { 
        componentDidMount(){
            this.listener = this.props.firebase.onAuthUserListener(
                authUser => {
                    if(!condition(authUser)) {
                        this.props.history.push(ROUTES.SIGN_IN)
                    }
                },
                () => {
                    this.props.history.push(ROUTES.SIGN_IN)
                    console.log(this.props.firebase.user())
                },
            )
        }

        componentWillUnmount(){
            //this.props.firebase.user().off(); //!!! needs a fixing
            //this.listener()
        }

        render(){
            console.log({...this.props})
            return (
            <AuthUserContext.Consumer>
                {authUser => 
                    condition(authUser)? <Component {...this.props} authUser = {authUser}/>:null}
            </AuthUserContext.Consumer> )
            //ya always need this.props, i think, unless it's a class
        }
    }

    return compose(
        withRouter,
        withFirebase,
    ) (WithAuthorization)
}

export default withAuthorization

//note to self: research role-based authorization