import React, {Fragment} from "react";
import Topbar from "../../common_components/navbar/Topbar";
import { Col, Grid, Row} from "react-bootstrap";

import BaseComponent from "../../utils/BaseComponent";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit";
import { COLUMNS } from '../constants/data'
import _ from 'lodash';
import { getToken } from '../../utils/ManageToken';
import jwt from 'jsonwebtoken';
import { connect } from 'react-redux';

class Rejected extends BaseComponent {
  render() {
    const { SearchBar } = Search;
    const { requestData } = this.props;
    const updatedColumns = _.cloneDeep(COLUMNS);
    updatedColumns.push({
      dataField: 'rejectedReason',
      text: 'RejectedReason'
    })
    const rejectedRequests = [];
    const token = getToken();
    const encryptedData = jwt.decode(token);
    for (let i=0; i<requestData.length; i++) {
      if (requestData[i].status === 'REJECTED' && requestData[i].ownerId === encryptedData.id) {
        rejectedRequests.push({
          createdOn: new Date(requestData[i].createdOn).toDateString(),
          modifiedOn: new Date(requestData[i].modifiedOn).toDateString(),
          reqId: requestData[i]._id,
          message: requestData[i].message,
          rejectedReason: requestData[i].reason,
        })
      }
    }
    return (
      <Fragment>
        <Grid fluid>
          <div className="top-section">
            <Topbar activeKey={4}/>
          </div>
          <div className="main-section">
            <div className="right-side-section">
              <Grid className="main-container">
                <Row className="pd-t-2 pd-b-2 pd-r-1 pd-l-1">
                  <Col md={12}>
                    <h2>List of Rejected Requests</h2>
                  </Col>
                </Row>
                <Row>
                  <Col className="table-wrapper" md={12}>
                    <ToolkitProvider keyField="id" data={rejectedRequests} columns={updatedColumns} search>
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

export default connect(mapStateToProps, mapDispatchToProps)(Rejected);