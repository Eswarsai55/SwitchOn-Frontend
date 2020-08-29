import React, {Fragment} from "react";

import BaseComponent from "../../utils/BaseComponent";
import CustomForm from "../../utils/CustomForm";
import CustomFormElement from "../../utils/CustomFormElement";
import CustomSelectControl from "../../utils/CustomSelectControl";
import Validator from "../../utils/Validator";
import SubmitButton from "../../utils/SubmitButton";
import {TextControl} from "../../utils/TextControl";
import {withRouter} from 'react-router-dom';
import SuccessModal from '../../common_components/modals/SuccessModal';

import {Row, Col} from "react-bootstrap";
import AXIOS from '../../utils/Axios';


class SignUp extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      selectedDepartment: "",
      signupSuccess: false,
      inProgress: false,
      successData: "",
      apiError: {
        isError: false,
        data: ""
      }
    };
  }

  componentDidMount() {
    this.getDepartments();
  }

  getDepartments = () => {
    AXIOS.SERVER.get("/department")
    .then(response => {
      const { data } = response.data;
      if(response.data.data.error) {
        this.setState({
          apiError: {
            isError: response.data.error,
            data: response.data.message
          }
        })
      } else {
        const formattedDepartments = [];
        for(let i=0; i < data.length; i++) {
          formattedDepartments.push({
            value: data[i]._id,
            label: data[i].departmentName,
          })
        }
        this.setState({
          departmentOptions: formattedDepartments,
        })
      }
    })
    .catch(err => {
      this.setState({
        inProgress: false,
        apiError: {
          isError: true,
          data: err.message
        }
      })
    })
  }

  onValidSubmit = () => {
    const { email, firstName, lastName, password, phoneNumber, selectedDepartment} = this.state;
    const data = Object.assign({}, {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      departmentId: selectedDepartment,
    })
    this.setState({inProgress: true});
    AXIOS.SERVER.post("/user/signup", data)
    .then((response) => {
      if (response.data.error) {
        this.setState({
          inProgress: false,
          apiError: {isError: response.data.error, data: response.data.message}
        });
      } else {
        this.setState({
          inProgress: false,
          openSuccessModal: true,
        });
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

  openLoginForm = () => {
    this.props.history.push('/login')
  }

  closeSuccessModal = () => {
    this.setState({
      openSuccessModal: false,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      selectedDepartment: "",
    })
  }

  render() {
    const { departmentOptions } = this.state;
    return (
      <Fragment>
        {this.state.openSuccessModal &&
          <SuccessModal show={this.state.openSuccessModal} 
            title="Account creation Successful"
            formattedDepartments={departmentOptions}
            subMessage="to Login"
            route="login"
            message="You have successfully signed up." onClose={this.closeSuccessModal}/>}
        <div className="login-section">
          <div className="login-wrapper">
            <div className="logo"><p>Create an Account</p></div>
            <div className="login-form-wrapper">
              <CustomForm onValidSubmit={this.onValidSubmit}>
                <Row>
                  <Col md="6">
                    <CustomFormElement
                      valueLink={this.linkState(this, "firstName")}
                      label="First Name"
                      required
                      validations={[
                        {
                          validate: Validator.isRequired,
                          message: "First Name is required"
                        }
                      ]}
                      control={{
                        type: TextControl,
                        settings: {
                          placeholder: "",
                        }
                      }}
                    />
                  </Col>
                  <Col md="6">
                    <CustomFormElement
                      valueLink={this.linkState(this, "lastName")}
                      label="Last Name"
                      required
                      validations={[
                        {
                          validate: Validator.isRequired,
                          message: "Last Name is required"
                        }
                      ]}
                      control={{
                        type: TextControl,
                        settings: {
                          placeholder: "",
                        }
                      }}
                    />
                  </Col>
                </Row>
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
                  label="Password"
                  required
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
                <Row>
                  <Col md="6">
                    <CustomFormElement
                      valueLink={this.linkState(this, "phoneNumber")}
                      label="Phone Number"
                      required
                      validations={[
                        {
                          validate: Validator.isRequired,
                          message: "Phone Number is required"
                        }
                      ]}
                      control={{
                        type: TextControl,
                        settings: {
                          placeholder: "",
                        }
                      }}
                    />
                  </Col>
                  <Col>
                    <CustomFormElement
                      valueLink={this.linkState(this, 'selectedDepartment')}
                      label="Department"
                      required
                      validations={[
                        {
                          validate: Validator.isRequired,
                          message: 'Department is required'
                        }
                      ]}
                      control={{
                        type: CustomSelectControl,
                        settings: {
                          options: departmentOptions,
                          multiple: false,
                          searchable: true
                        }
                      }}
                    />
                  </Col>
                </Row>
                {this.state.apiError.isError ? 
                  <p className="error-text">{this.state.apiError.data}</p> : null}

                <SubmitButton
                  type="submit"
                  customClass="hbt-btn align-center"
                  formError={this.state.inProgress}
                  progressMessage="Validating..."
                  fullWidth>
                  SignUp
                </SubmitButton>
              </CustomForm>
              <Row>
                <Col md="12">
                  <div className="sign-up-section">
                    Already have an account?
                    <span className="sign-up-link" onClick={this.openLoginForm}>Login</span>
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

export default withRouter(SignUp);
