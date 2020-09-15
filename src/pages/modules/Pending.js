import React, {Fragment} from "react";
import Topbar from "../../common_components/navbar/Topbar";
import { Col, Grid, Row } from "react-bootstrap";

import BaseComponent from "../../utils/BaseComponent";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit";
import { COLUMNS } from '../constants/data';
import fetchRequestData from '../../actions/getRequests';
import { getToken } from '../../utils/ManageToken';
import jwt from 'jsonwebtoken';
import { connect } from 'react-redux';

class Pending extends BaseComponent { 
  render() {
    const { SearchBar } = Search;
    const { requestData } = this.props;
    const token = getToken();
    const encryptedData = jwt.decode(token)
    const pendingRequests = [];
    for(let i=0;i<requestData.length; i++) {
      if(requestData[i].status === 'PENDING' && requestData[i].ownerId === encryptedData.id) {
        pendingRequests.push({
          reqId: requestData[i]._id,
          createdOn: new Date(requestData[i].createdOn).toDateString(),
          modifiedOn: new Date(requestData[i].modifiedOn).toDateString(),
          message: requestData[i].message,
        })
      }
    }
    return (
      <Fragment>
        <Grid fluid>
          <div className="top-section">
            <Topbar activeKey={3}/>
          </div>
          <div className="main-section">
            <div className="right-side-section">
              <Grid className="main-container">
                <Row className="pd-t-2 pd-b-2 pd-r-1 pd-l-1">
                  <Col md={12}>
                    <h2>List of Pending Requests</h2>
                  </Col>
                </Row>
                <Row>
                  <Col className="table-wrapper" md={12}>
                    <ToolkitProvider keyField="id" data={pendingRequests} columns={COLUMNS} search>
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

export default connect(mapStateToProps, mapDispatchToProps)(Pending);