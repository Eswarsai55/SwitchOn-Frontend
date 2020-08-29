import React, {Component} from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

import "./App.css";
import "./assets/scss/style.scss";

import {getToken} from "./utils/ManageToken";

import NotFound from "./pages/extra_pages/NotFound";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import Requests from './pages/modules/Requests';
import Assigned from './pages/modules/Assigned';
import Form from './pages/modules/Form';
import Approved from './pages/modules/Approved';
import Pending from './pages/modules/Pending';
import Rejected from './pages/modules/Rejected';


const PrivateRoute = ({component: Component, ...rest}) => (
  <Route
      {...rest}
      render={props =>
          !App.requireAuth() ? (
              <Component {...props} />
          ) : (
              <Redirect
                  to={{
                      pathname: "/login",
                      state: {from: props.location}
                  }}
              />
          )
      }
  />
);

const Home = () => (
  <Redirect
      to={{
          pathname: "/form",
      }}
  />
);

class App extends Component {
  static requireAuth() {
    const token = getToken();
    return !token;
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/form" component={Form}/>
          <PrivateRoute exact path="/assigned" component={Assigned}/>
          <PrivateRoute exact path="/approved" component={Approved}/>
          <PrivateRoute exact path="/pending" component={Pending}/>
          <PrivateRoute exact path="/rejected" component={Rejected}/>
          <PrivateRoute exact path="/requests" component={Requests}/>
          <Route exact path="/signup" component={SignUp}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/" component={Home}/>
          <Route path="/" component={NotFound}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;