import React, {Fragment} from "react";
import Topbar from "../../common_components/navbar/Topbar";
import {Button, Col, Grid, Row} from "react-bootstrap";

import BaseComponent from "../../utils/BaseComponent";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit";
import { COLUMNS } from '../constants/data';
import _ from 'lodash';
import { getToken } from '../../utils/ManageToken';
import getRequests from '../../actions/getRequests';
import jwt from 'jsonwebtoken';
import AXIOS from "../../utils/Axios";
import { connect } from 'react-redux';
import ConfirmationModal from "../../common_components/modals/ConfirmationModal";

class Assigned extends BaseComponent {

  addButtons = (requestData) => {
    const btnStyle = {
      "marginRight": "0.5rem",
      "marginTop": "0.5rem",
    };
    return (
      <Fragment>
        <Button style={btnStyle} className="hbt-enable-btn" variant="raised" bsStyle="primary" onClick={() => this.approveRequest(requestData)}>
          Approve
        </Button>
        <Button style={btnStyle} className="hbt-disable-btn" variant="raised" bsStyle="primary" onClick={() => this.openConfirmationModal(requestData)}>
          Reject
        </Button>
      </Fragment>
    )
  }

  approveRequest = (requestData) => {
    const { dispatch } = this.props;
    const { _id } = requestData;
    const data = Object.assign({}, {
      'id': _id,
      'status': 'APPROVED'
    })
    AXIOS.SERVER.put('/request/update', data).then(response => {
      dispatch(getRequests());
    }).catch(err => {
      this.setState({
        apiError: {
          isError: true,
          data: "Error while updating request",
        }
      })
    })

  }

  openConfirmationModal = (requestData) => {
    if (requestData._id !== 0) {
      this.setState({
        confirmationModal: true,
        id: requestData._id,
      });
    }
  };

  rejectRequest = (id, reason) => {
    const { dispatch } = this.props;
    const data = Object.assign({}, {
      id,
      'status': 'REJECTED',
      reason,
    })
    AXIOS.SERVER.put('/request/update', data).then(response => {
      this.setState({
        confirmationModal: false,
        id: "",
      })
      dispatch(getRequests());
    }).catch(err => {
      this.setState({
        apiError: {
          isError: true,
          data: "Error while updating request",
        }
      })
    })
  }

  closeConfirmationModal = () => {
    this.setState({
      confirmationModal: false,
    })
  }

  render() {
    const { SearchBar } = Search;
    const { requestData } = this.props;
    const assignedRequests = [];
    const token = getToken();
    const encryptedData = jwt.decode(token)
    for(let i=0;i<requestData.length; i++) {
      if(requestData[i].status === 'PENDING' && requestData[i].allocatedUserId === encryptedData.id) {
        assignedRequests.push({
          reqId: requestData[i]._id,
          createdOn: new Date(requestData[i].createdOn).toDateString(),
          modifiedOn: new Date(requestData[i].modifiedOn).toDateString(),
          message: requestData[i].message,
          action: this.addButtons(requestData[i]),
        })
      }
    }
    const updatedColumns = _.cloneDeep(COLUMNS);
    updatedColumns.push({
      dataField: 'action',
      text: 'Action'
    })
    const title = "Are you sure to reject this request?"
    return (
      <Fragment>
        {this.state.confirmationModal &&
          <ConfirmationModal id={this.state.id} title={title} reject={this.rejectRequest} show={true} onClose={this.closeConfirmationModal}/>
        }
        <Grid fluid>
          <div className="top-section">
            <Topbar activeKey={6}/>
          </div>
          <div className="main-section">
            <div className="right-side-section">
              <Grid className="main-container">
                <Row className="pd-t-2 pd-b-2 pd-r-1 pd-l-1">
                  <Col md={12}>
                    <h2>List of Assigned Requests</h2>
                  </Col>
                </Row>
                <Row>
                  <Col className="table-wrapper" md={12}>
                    <ToolkitProvider keyField="id" data={assignedRequests} columns={updatedColumns} search>
                      {props => (
                        <div>
                          <Grid className="enquiry-filter-container">
                            <Row>
                              <Col md={3}>
                                <SearchBar {...props.searchProps} />
                              </Col>
                            </Row>
                          </Grid>
                          <hr/>
                          <BootstrapTable
                            {...props.baseProps}
                            noDataIndication={"No results found"}
                            bordered={false}
                            pagination={paginationFactory()}
                          />
                        </div>
                      )}
                    </ToolkitProvider>
                  </Col>
                </Row>
              </Grid>
            </div>
          </div>
        </Grid>
      </Fragment>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(Assigned);