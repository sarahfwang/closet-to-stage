import React from 'react';
import { Link } from 'react-router-dom';
 
import SignOutButton from '../SignOut'
import * as ROUTES from '../../constants/routes';

import {AuthUserContext} from '../Session'

import './navigation.css'

const Navigation = () => (
    <div className="nav">
      <AuthUserContext.Consumer>
        {authUser => //can replace with authUser
          authUser ? <NavigationAuth /> : <NavigationNonAuth />
        }
      </AuthUserContext.Consumer>
    </div>
);

//splits up the old navigation component into auth and non-auth, then uses a ternary oper above
const NavigationAuth = () =>( //use parentheses not bracket dumb b
  <div >
    <ul>
      <li>
        <Link to={ROUTES.LANDING}>Landing</Link>
      </li>
      <li>
        <Link to={ROUTES.HOME}>Home</Link>
      </li>
      <li>
        <Link to={ROUTES.ACCOUNT}>Account</Link>
      </li>
      <li>
        <Link to={ROUTES.ADMIN}>Admin</Link>
      </li>

      <li>
        <Link to="/testbig">Test big</Link>
      </li>

      <li>
        <Link to={ROUTES.ITEM_PAGE}>ItemPage</Link>
      </li>
      
      <li>
        <Link to="/itemform">ItemForm</Link>
      </li>
      
      <li>
        <SignOutButton />
      </li>
    </ul>
  </div>
)

const NavigationNonAuth = () =>(
  <div>
    <ul>
      <li>
        <Link to={ROUTES.LANDING}>Landing</Link>
      </li>
      <li>
        <Link to={ROUTES.ITEM_PAGE}>ItemPage</Link>
      </li>
      {/* <li>
        <Link to={'/item-page2'}>ItemPage2</Link>
      </li> */}
      <li>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </li>
      <li>
        <Link to="/testbig">Test big</Link>
      </li>
      
    </ul>
  </div>
)
export default Navigation;