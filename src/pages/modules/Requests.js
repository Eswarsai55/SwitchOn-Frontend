import React, {Fragment} from "react";
import Topbar from "../../common_components/navbar/Topbar";
import {Col, Grid, Row} from "react-bootstrap";

import BaseComponent from "../../utils/BaseComponent";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit";
import { COLUMNS } from '../constants/data'
import _ from 'lodash';
import { getToken } from '../../utils/ManageToken';
import jwt from 'jsonwebtoken';
import { connect } from 'react-redux';

class Request extends BaseComponent {
  render() {
    const { SearchBar } = Search;
    const { requestData, userData } = this.props;
    const token = getToken();
    const encryptedData = jwt.decode(token);
    let requests = [];
    const updatedColumns = _.cloneDeep(COLUMNS);
    updatedColumns.splice(1,0,{
      dataField: 'allocatedTo',
      text: 'AllocatedTo'
    }, {
      dataField: 'status',
      text: 'Status',
    })
    for (let i=0; i<requestData.length; i++) {
      if (requestData[i].departmentId === encryptedData.departmentId) {
        const user = userData.find(user => user._id === requestData[i].allocatedUserId);
        requests.push({
          createdOn: new Date(requestData[i].createdOn).toDateString(),
          modifiedOn: new Date(requestData[i].modifiedOn).toDateString(),
          reqId: requestData[i]._id,
          message: requestData[i].message,
          allocatedTo: `${user.firstName} ${user.lastName}`,
          status: requestData[i].status,
        })
      }
    }
    
    return (
      <Fragment>
        <Grid fluid>
          <div className="top-section">
            <Topbar activeKey={5}/>
          </div>
          <div className="main-section">
            <div className="right-side-section">
              <Grid className="main-container">
                <Row className="pd-t-2 pd-b-2 pd-r-1 pd-l-1">
                  <Col md={12}>
                    <h2>List of Requests</h2>
                  </Col>
                </Row>
                <Row>
                  <Col className="table-wrapper" md={12}>
                    <ToolkitProvider keyField="id" data={requests} columns={updatedColumns} search>
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

const mapStateToProps = (state) => ({
  requestData: state.request.requestData,
  error: state.request.error,
  fetching: state.request.fetching,
  userData: state.user.userData,
});

const mapDispatchToProps = dispatch => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(Request);