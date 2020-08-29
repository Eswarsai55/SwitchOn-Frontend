import React from "react";
import {NavLink} from "react-router-dom";
import BaseComponent from "../../utils/BaseComponent";
import {Nav, Navbar, NavItem} from "react-bootstrap";
import { getToken } from '../../utils/ManageToken';
import jwt from 'jsonwebtoken';

class Topbar extends BaseComponent {
  state = {

  }
  componentDidMount = () => {
    this.verifyToken();
  }

  verifyToken = () => {
    const token = getToken();
    const encryptedData = jwt.decode(token);
    if (encryptedData) {
      this.setState({
        alreadyLoggedIn: true,
      })
    }
  }
  render() {
    const { alreadyLoggedIn } = this.state;
    return (
      <Navbar className="custome-top-navbar">
        <Navbar.Collapse>
          <Nav>
            
            <NavItem>
              <NavLink to="/form" className={(this.props.activeKey === 1 && "active-nav").toString()}>Form</NavLink>
            </NavItem>

            <NavItem>
              <NavLink to="/assigned" className={(this.props.activeKey === 6 && "active-nav").toString()}>Assigned</NavLink>
            </NavItem>

            <NavItem>
              <NavLink to="/approved" className={(this.props.activeKey === 2 && "active-nav").toString()}>Approved</NavLink>
            </NavItem>

            <NavItem>
              <NavLink to="/pending" className={(this.props.activeKey === 3 && "active-nav").toString()}>Pending</NavLink>
            </NavItem>
            

            <NavItem>
              <NavLink to="/rejected" className={(this.props.activeKey === 4 && "active-nav").toString()}>Rejected</NavLink>
            </NavItem>

            <NavItem>
              <NavLink to="/requests" className={(this.props.activeKey === 5 && "active-nav").toString()}>Requests</NavLink>
            </NavItem>
              
          </Nav>
          {
            alreadyLoggedIn ? 
              <Nav pullRight>
                <NavItem href="/login" className="navbar-logout">
                  Logout
                </NavItem>
              </Nav> :
              <Nav pullRight>
                <NavItem href="/login" className="navbar-logout">
                  LOGIN
                </NavItem>
                <NavItem href="/signup" className="navbar-logout">
                  SIGNUP
                </NavItem>
              </Nav>
          }
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Topbar;
