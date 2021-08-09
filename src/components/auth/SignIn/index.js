import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {compose} from "recompose"

import {SignUpLink} from '../SignUp'
import {PasswordForgetLink} from '../../user/PasswordForget'
import { withFirebase } from '../../firebase'
import * as ROUTES from '../../../constants/routes'

const SignInPage =() =>{
    return(
        <div>
            <h1>SignIn</h1>
            <SignInForm />
            <PasswordForgetLink />
            <SignUpLink />
            
        </div>
        
    )
}

const INITIAL_STATE = { //include initial state to reset your input fields after submitting, ALSO, include an 'error'
    email:"",
    password:"",
    error:null,
}
class SignInFormBase extends Component {
    constructor(props){
        super(props)
        this.state = {
            ...INITIAL_STATE
        }
    }

    onSubmit = event =>{
        const {email, password} = this.state
        
        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({...INITIAL_STATE})
                this.props.history.push(ROUTES.HOME)//???don't really understand
            })
            .catch(error => {
                this.setState({error})
            })
        
        event.preventDefault()
    }

    onChange = (event) =>{
    
        this.setState(
            {
                [event.target.name]: event.target.value
            }        
        )
        
    }

    render(){
        const {error} = this.state
        
        return(
            <div>
                <form onSubmit = {this.onSubmit}>
                    <input 
                        name="email"
                        value={this.state.email}
                        type ="text"
                        placeholder="email"
                        onChange={this.onChange}/>
                    <input 
                        name="password"
                        value={this.state.password}
                        type ="password"
                        placeholder="password"
                        onChange={this.onChange} />
                    <button type= "submit">SignIn</button>

                {error && <p>{error.message/*notsure???*/}</p>} 
                </form>
                
            </div>
        )
    }
}


const SignInForm = compose(
    withRouter,
    withFirebase,
)(SignInFormBase)

export default SignInPage

export {SignInForm}
