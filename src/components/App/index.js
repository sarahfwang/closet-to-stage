import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../pages/Navigation';
import LandingPage from '../pages/Landing';
import SignUpPage from '../auth/SignUp';
import SignInPage from '../auth/SignIn';
import PasswordForgetPage from '../user/PasswordForget';
import HomePage from '../pages/Home';
import MyCloset from '../user/MyCloset';
import Account from '../user/Account'
//import Messages from '../user/Messages'
import AdminPage from '../user/Admin';
import ItemPage from '../pages/ItemPage'
import Form from '../items/ItemForm'
import Item from '../items/Item'
import NewFilterPage from '../z-Test'
import ItemUpdateForm from '../items/ItemUpdateForm'
//import TestPage from '../pages/TestPage'
//import TestItemBig from '../TestItemBig'

import MessageConsole from '../user/MessageConsole'

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../auth/Session';

import './app.css'

const App = () => (
  <Router>
    <div>
      <header>
        <div className="header-brand">
          <h1 className="header-brand-name">closet to stage</h1>
        </div>
       
   
        <Navigation />
      </header>


      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route
        exact
        path={ROUTES.PASSWORD_FORGET}
        component={PasswordForgetPage}
      />
      <Route exact path={ROUTES.HOME} component={HomePage} />
      {/* <Route exact path="/messages" component = {Messages} /> */}
      <Route exact path={ROUTES.ADMIN} component={AdminPage} />
      <Route exact path={ROUTES.WOMEN} component={ItemPage} />
      {/* <Route exact path={'/item-page2'} component={ItemPage2} /> */}
      <Route exact path={ROUTES.LIST} component = {Form} />
      <Route exact path="/item-page/:itemID" component = {Item}/> {/*':' allows Item to access itemID */}
      <Route exact path="/update-item/:itemID" component = {ItemUpdateForm}/> {/*':' allows Item to access itemID */}
      {/* <Route exact path="/items/:type?/:color?/brand?:" component={NewFilterPage}/> */}

      <Route exact path="/my-closet" component={MyCloset} />
      <Route exact path="/messages" component = {MessageConsole} />
      <Route exact path="/account" component = {Account} />
      {/* <Route exact path="/mymessages" component={MyMessages}/> */}
      
      
    </div>
  </Router>
);

export default withAuthentication(App);