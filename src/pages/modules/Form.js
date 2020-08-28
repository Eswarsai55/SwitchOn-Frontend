import React, {Fragment} from "react";
import { Grid } from "react-bootstrap";

import BaseComponent from "../../utils/BaseComponent";
import Topbar from '../../common_components/navbar/Topbar';
import CustomForm from "../../utils/CustomForm";
import CustomFormElement from "../../utils/CustomFormElement";
import FullScreenLoader from '../../common_components/FullScreenLoader';
import Validator from "../../utils/Validator";
import SubmitButton from "../../utils/SubmitButton";
import {TextControl} from "../../utils/TextControl";
import AXIOS from '../../utils/Axios';
import CustomSelectControl from "../../utils/CustomSelectControl";
import SuccessModal from "../../common_components/modals/SuccessModal";
import { withRouter } from 'react-router-dom';

class Form extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      selectedUser: "",
      userOptions: [],
      departmentOptions: [],
      selectedDepartment: "",
      apiError: {
        isError: false,
        data: ""
      }
    }
  }

  componentDidMount = () => {
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

  getUsers = () => {
    const { selectedDepartment } = this.state;
    AXIOS.SERVER.get("/user")
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
        const formattedUsers = [];
        for(let i=0; i < data.length; i++) {
          if (data[i].departmentId === selectedDepartment) {
            formattedUsers.push({
              value: data[i]._id,
              label: data[i].firstName,
            })
          }
        }
        this.setState({
          userOptions: formattedUsers,
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

  showLoader = (showLoader) => {
    this.setState({showLoader})
  }

  onValidSubmit = () => {
    const { selectedDepartment, selectedUser, message } = this.state;
    const data = Object.assign({}, {
      departmentId: selectedDepartment,
      userId: selectedUser,
      status: 'PENDING',
      message,
    })
    this.showLoader(true)
    AXIOS.SERVER.post('/request/create', data)
    .then(response => {
      this.showLoader(false)
      this.setState({
        formSubmissionSuccess: true,
      })
    }).catch(err => {
      this.setState({
        apiError: {
          isError: true,
          data: err.message
        }
      })
    })
  }

  closeSuccessModal = () => {
    this.setState({
      formSubmissionSuccess: false,
      message: "",
      selectedUser: "",
      selectedDepartment: "",
      apiError: {
        isError: false,
        data: ""
      }
    })
  }


  render() {
    const { departmentOptions, userOptions } = this.state;
    return (
      <Fragment>
        {
          this.state.showLoader
          && <FullScreenLoader/>
        }
        {
          this.state.formSubmissionSuccess &&
          <SuccessModal title="Form Submission Successful" message = "You have successfully submitted your request"
           route="form" subMessage="to submit another form" show={this.state.formSubmissionSuccess} onClose={this.closeSuccessModal}/>
        }
        <Grid fluid>
          <div className="top-section">
            <Topbar activeKey={1}/>
          </div>
        </Grid>
        <div className="login-section">
          <div className="login-wrapper">
            <div className="form-logo"><p>Submit your Request</p></div>
            <div className="login-form-wrapper">
              <CustomForm onValidSubmit={this.onValidSubmit}>
                <CustomFormElement
                  valueLink={this.linkState(this, "selectedDepartment")}
                  label="Department"
                  required
                  validations={[
                    {
                      validate: Validator.isRequired,
                      message: "Department is required"
                    }
                  ]}
                  control={{
                    type: CustomSelectControl,
                    settings:{
                      options: departmentOptions,
                      multiple: false,
                      searchable: true,
                      onChangeCallback: () => {
                        this.getUsers();
                      }
                    }
                  }}
                />
                <CustomFormElement
                  valueLink={this.linkState(this, "selectedUser")}
                  label="User"
                  required
                  validations={[
                    {
                      validate: Validator.isRequired,
                      message: "User is required"
                    }
                  ]}
                  control={{
                    type: CustomSelectControl,
                    settings:{
                      options: userOptions,
                      multiple: false,
                      searchable: true,
                    }
                  }}
                />
                <CustomFormElement
                  valueLink={this.linkState(this, "message")}
                  label="Message"
                  required
                  validations={[
                    {
                      validate: Validator.isRequired,
                      message: "Message is required"
                    }
                  ]}
                  control={{
                    type: TextControl,
                    settings:{
                      placeholder: ""
                    }
                  }}
                />
                <SubmitButton
                  type="submit"
                  customClass="hbt-btn align-center"
                  formError={this.state.inProgress}
                  progressMessage="Validating..."
                  fullWidth>
                  Submit
                </SubmitButton>
              </CustomForm>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default withRouter(Form);