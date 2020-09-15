import React, {Fragment} from "react";
import { withRouter } from 'react-router-dom';

import BaseComponent from "../../utils/BaseComponent";
import CustomForm from "../../utils/CustomForm";
import CustomFormElement from "../../utils/CustomFormElement";
import Validator from "../../utils/Validator";
import SubmitButton from "../../utils/SubmitButton";
import {TextControl} from "../../utils/TextControl";

import {deleteToken} from "../../utils/ManageToken";
import {Row, Col} from "react-bootstrap";
import AXIOS from '../../utils/Axios';
import getRequests from '../../actions/getRequests';
import { connect } from 'react-redux';

class Login extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      inProgress: false,
      apiError: {
        isError: false,
        data: ""
      }
    };
  }

  componentDidMount = () => {
    deleteToken();
  }

  onValidSubmit = () => {
    const { email, password } = this.state;
    const { dispatch } = this.props;
    const data = Object.assign({}, {
      email,
      password,
    })
    this.setState({inProgress: true});
    AXIOS.SERVER.post("/user/login", data)
    .then((response) => {
      if (response.data.error) {
        this.setState({
          inProgress: false,
          apiError: {
            isError: response.data.error, 
            data: response.data.message
          }
        });
      } else {
        deleteToken();
        localStorage.setItem("access_token", response.data.data.token);
        localStorage.setItem("user_name", response.data.data.user.firstName);
        this.setState({
          inProgress: false,
        });
        dispatch(getRequests());
        this.props.history.push('/form');
      }
    })
    .catch((error) => {
      this.setState({
        inProgress: false,
        apiError: {
          isError: true,
          data: error.message
        }
      });
    });
  };

  openSignupForm = () => {
    this.props.history.push('/signup')
  };

  render() {
    return (
      <Fragment>
        <div className="login-section">
          <div className="login-wrapper">
            <div className="logo"><p>Sign in to your Account</p></div>
            <div className="login-form-wrapper">
              <CustomForm onValidSubmit={this.onValidSubmit}>
                <CustomFormElement
                  valueLink={this.linkState(this, "email")}
                  label="Email"
                  required
                  validations={[
                    {
                      validate: Validator.isRequired,
                      message: "Email is required"
                    },
                    {
                      validate: Validator.isEmail,
                      message: "Invalid email"
                    }
                  ]}
                  control={{
                    type: TextControl,
                    settings: {
                      placeholder: "",
                    }
                  }}
                />
                <CustomFormElement
                  valueLink={this.linkState(this, "password")}
                  required
                  label="Password"
                  validations={[
                    {
                      validate: Validator.isRequired,
                      message: "Password is required"
                    }
                  ]}
                  control={{
                    type: TextControl,
                    settings: {
                      type: "password",
                      placeholder: "",
                    }
                  }}
                />
                {this.state.apiError.isError ? 
                  <p className="error-text">{this.state.apiError.data}</p> : null}

                <SubmitButton
                  type="submit"
                  customClass="hbt-btn align-center"
                  formError={this.state.inProgress}
                  progressMessage="Validating..."
                  fullWidth>
                  Login
                </SubmitButton>
              </CustomForm>
              <Row>
                <Col md="12">
                  <div className="sign-up-section">
                    Not having an account?
                    <span className="sign-up-link" onClick={this.openSignupForm}>Create an Account</span>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  requestData: state.request.requestData,
  error: state.request.error,
  fetching: state.request.fetching,
});

const mapDispatchToProps = dispatch => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
