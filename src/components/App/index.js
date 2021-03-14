import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../pages/Navigation';
import LandingPage from '../pages/Landing';
import SignUpPage from '../auth/SignUp';
import SignInPage from '../auth/SignIn';
import PasswordForgetPage from '../user/PasswordForget';
import HomePage from '../pages/Home';
import AccountPage from '../user/Account';
import AdminPage from '../user/Admin';
import ItemPage from '../pages/ItemPage'
import Form from '../items/ItemForm'
import Filter from '../items/Filter'
import Item from '../items/Item'
import NewFilterPage from '../z-Test'

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../auth/Session';

import './app.css'

const App = () => (
  <Router>
    <div>
      <header>
      {/* <div class="measurements">
          <div>
            <div class="first"></div> 
            <h5>30px(1.8rem)</h5>
          </div>
          <div>
            <div class="second"></div> 
            <h5>50px(3.1rem)</h5>
          </div>
          <div>
            <div class="third"></div> 
            <h5>100px(6.6rem)</h5>
          </div>
        </div> */}
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
      <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route exact path={ROUTES.ADMIN} component={AdminPage} />
      <Route exact path={ROUTES.ITEM_PAGE} component={ItemPage} />
      <Route exact path={'/item-page2'} component={ItemPage2} />
      <Route exact path="/itemform" component = {Form} />
      <Route exact path="/filter" component = {Filter} />
      <Route exact path="/items/:itemID" component = {Item}/> {/*':' allows Item to access itemID */}
      <Route exact path="/items/:type?/:color?/brand?:" component={NewFilterPage}/>
      <Route path ="/test" component = {NewFilterPage} />
    </div>
  </Router>
);

export default withAuthentication(App);