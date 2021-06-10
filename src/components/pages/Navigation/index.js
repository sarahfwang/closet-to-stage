import React from 'react';
import { Link } from 'react-router-dom';
 
import SignOutButton from '../../auth/SignOut'
import * as ROUTES from '../../../constants/routes';

import {AuthUserContext} from '../../auth/Session'

import './navigation.css'

const Navigation = () => (
    <AuthUserContext.Consumer>
      {authUser => //can replace with authUser
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
);

//splits up the old navigation component into auth and non-auth, then uses a ternary oper above
const NavigationAuth = () =>( //use parentheses not bracket dumb b
  <div className="header-nav">
    <div className="page-links">
      <ul>
        <li>
          <Link to={ROUTES.LANDING}>Landing</Link>
        </li>
        {/* <li>
          <Link to={ROUTES.HOME}>Home</Link>
        </li> */}

      
        <li>
          <Link to={ROUTES.ITEM_PAGE}>ItemPage</Link>
        </li>
        <li>
          <Link to="/itemform">ItemForm</Link>
        </li>

        {/*test page */}
        {/* <li>
          <Link to="/testbig">Test item</Link>
        </li>  */}
        <li>
          <Link to={ROUTES.ADMIN}>Admin</Link>
        </li>
      </ul>
    </div>
    <div className="account-links">
      <li className="sign-out">
        <SignOutButton />
      </li>
      <li>
        <Link to={ROUTES.ACCOUNT}>my items</Link>
      </li>
      <li>
        <Link to="/messages">Messages</Link>
      </li>
    </div>
  </div>
  
)

const NavigationNonAuth = () =>(
  <div className="header-nav">
    <div className="page-links">
      <ul>
        <li>
          <Link to={ROUTES.LANDING}>Landing</Link>
        </li>
        <li>
          <Link to={ROUTES.ITEM_PAGE}>ItemPage</Link>
        </li>
        
      </ul>
    </div>
    <div className="account-links">
        <li>
          <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </li>
    </div>
  </div>
)
export default Navigation;