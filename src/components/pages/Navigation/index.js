import React from 'react';
import { Link } from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUser, faComments } from '@fortawesome/free-regular-svg-icons'
 
import SignOutButton from '../../auth/SignOut'
import SearchBar from '../../items/SearchBar'
import * as ROUTES from '../../../constants/routes';

import {AuthUserContext} from '../../auth/Session'

import './navigation.scss'


const Navigation = () => (
    <AuthUserContext.Consumer>
      {authUser => //can replace with authUser
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
);
//TODO: HOME is an example of a logged in user
//splits up the old navigation component into auth and non-auth, then uses a ternary oper above
const NavigationAuth = () =>( //use parentheses not bracket dumb b
  <div className="header-nav">
    <div className="page-links">
      <ul>
        {/* <li>
          <Link to={ROUTES.LANDING}>Landing</Link>
        </li> */}
        {/* <li>
          <Link to={ROUTES.HOME}>Home</Link>
        </li> */}
        <li>
          <Link to={ROUTES.LISTINGS}>Listings</Link>
        </li>
        <li className="list-button">
          <Link to={ROUTES.LIST}>List</Link>
        </li>
       {/*  <li>
          <Link to={ROUTES.ADMIN}>Admin</Link>
        </li> */}
      </ul>
    </div>
    <div className="account-links">
      <ul>
       {/*  TODO: add this <li>
          <Link to="/account">edit account</Link>
        </li> */}
        <li >
          <Link to="/messages"> <FontAwesomeIcon icon={faComments}/> </Link>
        </li>
        <li >
          <Link to = "/my-closet"> <FontAwesomeIcon icon={faUser}/></Link>
        </li>
        <li className="break">
          |
        </li>
        <li className="sign-out">
          <SignOutButton />
        </li>
        <li className="search">
          <SearchBar />
        </li>

      </ul>
   </div>
  </div>
  
)

const NavigationNonAuth = () =>(
  <div className="header-nav">
    <div className="page-links">
      <ul>
        <li>
          <Link to={ROUTES.LISTINGS}>Listings</Link>
        </li>

        <li className="list-button">
          <Link to={ROUTES.LIST}>List</Link>
        </li>
      </ul>
    </div>
    <div className="account-links">
      <ul>
        <li>
          <Link to={ROUTES.SIGN_UP}>Sign up</Link>
        </li>
        <li className="break">
          |
        </li>
        <li>
          <Link to={ROUTES.SIGN_IN}>Log In</Link>
        </li>
        
        <li className="search">
          <SearchBar />
        </li>
      </ul>
        
    </div>
  </div>
)
export default Navigation;