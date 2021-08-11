import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {compose} from 'recompose'

import {withFirebase} from '../../firebase'
import * as ROUTES from '../../../constants/routes'
import * as ROLES from '../../../constants/roles'


//import Firebase from '../Firebase/index'

const SignUpPage =() =>{
    
    return(
        <div>
            <h1>SignUp</h1>
            <SignUpForm />
            
        </div>
    )
}

const INITIAL_STATE = {
    username: '',
    email:'',
    passwordOne:'',
    passwordTwo:'',
    isAdmin: false, //!!!must change later
    error: null ,     
}

class SignUpFormBase extends Component {

    
    constructor(props){
        super(props)
        this.state = {...INITIAL_STATE}
    }

    onSubmit = event =>{
        const {username, email, passwordOne, isAdmin} = this.state //curly??? and doCreate???
        const roles = {}

        if(isAdmin){
            roles[ROLES.ADMIN] = ROLES.ADMIN
        }

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {    //because createUser returns a Promise<UserCredential>
                return this.props.firebase
                    .user(authUser.user.uid)
                    .set({
                        username,
                        email,
                        roles,
                        profile:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",//TODO HARDCODED
                    }, {merge: true})
            })
            .then(()=>{
                this.setState({...INITIAL_STATE})
                this.props.history.push(ROUTES.HOME)//???
            })
            .catch(error => {
             this.setState({ error });
            });
 
        event.preventDefault();
        
    }

    onChange = event =>{
        let name = event.target.name
        this.setState({
            [event.target.name]:event.target.value
        })
        console.log(this.state[name])
    }

    onChangeCheckbox = event =>{
        console.log(this.state)
        this.setState({[event.target.name]: event.target.checked})
    }

    render() {
        const{
            username,
            email,
            passwordOne,
            passwordTwo,
            isAdmin,
            error
        } = this.state //use curly or square???

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '';

        return (
            <form onSubmit={this.onSubmit}>
                <input 
                    name="username"
                    value={username}
                    onChange = {this.onChange}
                    type="text"
                    placeholder="username"
                />
                <input 
                    name="email"
                    value={email}
                    onChange = {this.onChange}
                    type="text"
                    placeholder="email"
                />
                <input 
                    name="passwordOne"
                    value={passwordOne}
                    onChange = {this.onChange}
                    type="password"
                    placeholder="password"
                />
                <input 
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange = {this.onChange}
                    type="password"
                    placeholder="confirm password"
                />
                <label>
                    Admin:
                    <input
                        name="isAdmin"
                        type="checkbox"
                        checked={isAdmin}
                        onChange={this.onChangeCheckbox}
                    />
                </label>
                <button disabled={isInvalid} type="submit">
                    Sign Up
                </button>

                <p>{error && `${error}`}</p>
            </form>
        )
    }
        
}
//??? above `$

const SignUpLink =()=>{
    return(
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>SignUp</Link>
    </p>
    )
    

}
const SignUpForm = compose(
    withRouter,
    withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export {SignUpForm, SignUpLink}
