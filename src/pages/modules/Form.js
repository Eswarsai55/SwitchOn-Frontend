import React, {Fragment} from "react";
import { Grid, Row, Col } from "react-bootstrap";

import BaseComponent from "../../utils/BaseComponent";
import Topbar from '../../common_components/navbar/Topbar';
import CustomForm from "../../utils/CustomForm";
import CustomFormElement from "../../utils/CustomFormElement";
import FullScreenLoader from '../../common_components/FullScreenLoader';
import Validator from "../../utils/Validator";
import SubmitButton from "../../utils/SubmitButton";
import {TextControl} from "../../utils/TextControl";
import AXIOS from '../../utils/Axios';
import jwt from 'jsonwebtoken';
import { getToken } from '../../utils/ManageToken';
import getUsers from '../../actions/getUser';
import getDepartments from '../../actions/getDepartments';
import CustomSelectControl from "../../utils/CustomSelectControl";
import SuccessModal from "../../common_components/modals/SuccessModal";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

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
    const { dispatch } = this.props;
    dispatch(getDepartments());
    dispatch(getUsers());
  }

  componentWillReceiveProps = (nextProps) => {
    const { userData, departmentData } = nextProps;
    const formattedDepartments = [];
    for(let i=0; i < departmentData.length; i++) {
      formattedDepartments.push({
        value: departmentData[i]._id,
        label: departmentData[i].departmentName,
      })
    }
    const formattedUsers = [];
    for(let i=0; i < userData.length; i++) {
      formattedUsers.push({
        value: userData[i]._id,
        label: `${userData[i].firstName} ${userData[i].lastName}`,
      })
    }
    this.setState({
      users: userData,
      departmentOptions: formattedDepartments,
      departments: formattedDepartments,
      userOptions: formattedUsers,
      allocationOptions: formattedUsers,
    }, () => {
      this.verifyToken()
    })
  }

  verifyToken = () => {
    const token = getToken();
    const encryptedData = jwt.decode(token);
    if (encryptedData) {
      this.setState({
        owner: true,
        ownerId: encryptedData.id,
        ownerDepartment: encryptedData.departmentId
      }, () => {
        this.updateFields();
      })
    }
  }

  updateFields = () => {
    const { userOptions, departmentOptions, owner, ownerId, users } = this.state;
    const ownerDepartment = users.find(user => user._id === ownerId).departmentId;
    const updateddepartmentOptions = departmentOptions.filter(department => department.value !== ownerDepartment);
    if (owner) {
      const updateduserOptions = userOptions.filter(user => user.value === ownerId);
      this.setState({
        userOptions: updateduserOptions,
      })
    }
    this.setState({
      departmentOptions: updateddepartmentOptions,
      ownerDepartment
    }, () => {
      this.updateallocationUsers();
    })
  }

  updateallocationUsers = () => {
    const { users, ownerDepartment, selectedDepartment } = this.state;
    const allocationOptions = users.filter(user => user.departmentId !== ownerDepartment);
    const formattedAllocationOptions = [];
    for (let i=0; i< allocationOptions.length; i++) {
      if (!selectedDepartment || selectedDepartment === allocationOptions[i].departmentId) {
        formattedAllocationOptions.push({
          value: allocationOptions[i]._id,
          label: `${allocationOptions[i].firstName} ${allocationOptions[i].lastName}`,
        })
      }
    }
    this.setState({
      allocationOptions: formattedAllocationOptions
    })
  }

  showLoader = (showLoader) => {
    this.setState({showLoader})
  }

  setFields = () => {
    const { departments } = this.state;
    this.setState({
      departmentOptions: departments,
      selectedDepartment: "",
      selectedUser: "",
    }, () => {
      this.updateFields()
    })
  }

  onValidSubmit = () => {
    const { selectedDepartment, selectedUser, message, ownerId } = this.state;
    const data = Object.assign({}, {
      departmentId: selectedDepartment,
      allocatedUserId: selectedUser,
      status: 'PENDING',
      ownerId,
      message,
    })
    this.showLoader(true)
    AXIOS.SERVER.post('/request/create', data)
    .then(response => {
      this.showLoader(false)
      if(response.data.data.error) {
        this.setState({
          apiError: {
            isError: true,
            data: response.data.error.message,
          }
        })
      } else {
        this.setState({
          formSubmissionSuccess: true,
          apiError: {
            isError: false,
            data: ""
          }
        })
      }
    }).catch(err => {
      this.showLoader(false);
      this.setState({
        apiError: {
          isError: true,
          data: "Error while submitting form",
        }
      })
    })
  }

  closeSuccessModal = () => {
    this.setState({
      formSubmissionSuccess: false,
      ownerId: "",
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
    const { departmentOptions, userOptions, allocationOptions } = this.state;
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
                <Row>
                  <Col md="6">
                    <CustomFormElement
                      valueLink={this.linkState(this, "ownerId")}
                      label="Created By"
                      required
                      validations={[
                        {
                          validate: Validator.isRequired,
                          message: "Created by is required"
                        }
                      ]}
                      control={{
                        type: CustomSelectControl,
                        settings:{
                          options: userOptions,
                          multiple: false,
                          searchable: true,
                          onChangeCallback: () => {
                            this.setFields();
                          }
                        }
                      }}
                    />
                  </Col>
                  <Col md="6">
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
                            this.updateallocationUsers();
                          }
                        }
                      }}
                    />
                  </Col>
                </Row>
                <CustomFormElement
                  valueLink={this.linkState(this, "selectedUser")}
                  label="Allocated To"
                  required
                  validations={[
                    {
                      validate: Validator.isRequired,
                      message: "Allocated To is required"
                    }
                  ]}
                  control={{
                    type: CustomSelectControl,
                    settings:{
                      options: allocationOptions,
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
                {
                  this.state.apiError.isError ? 
                    <p className="error-text">{this.state.apiError.data}</p> : null
                }
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

const mapStateToProps = state => ({
  requestData: state.request.requestData,
  userData: state.user.userData,
  departmentData: state.department.departmentData,
  error: state.department.error,
  isFetching: state.department.fetching,
});

const mapDispatchToProps = dispatch => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Form));