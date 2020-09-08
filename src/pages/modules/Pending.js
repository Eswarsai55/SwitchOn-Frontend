import React, {Fragment} from "react";
import Topbar from "../../common_components/navbar/Topbar";
import { Col, Grid, Row } from "react-bootstrap";

import BaseComponent from "../../utils/BaseComponent";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit";
import { COLUMNS } from '../constants/data';
import fetchRequestData from '../../actions/getrequestData';
import { getToken } from '../../utils/ManageToken';
import jwt from 'jsonwebtoken';

class Pending extends BaseComponent {
  constructor() {
    super();
    this.state = {
      pendingRequests: [],
      apiError: {
        isError: false,
        data: ""
      }
    }
  }
  
  componentDidMount = () => {
    this.getPendingRequests();
  }

  getPendingRequests = () => {
    const pendingRequests = [];
    const token = getToken();
    const encryptedData = jwt.decode(token)
    fetchRequestData().then(response => {
      for(let i=0;i<response.length; i++) {
        if(response[i].status === 'PENDING' && response[i].ownerId === encryptedData.id) {
          pendingRequests.push({
            reqId: response[i]._id,
            createdOn: new Date(response[i].createdOn).toDateString(),
            modifiedOn: new Date(response[i].modifiedOn).toDateString(),
            message: response[i].message,
          })
        }
      }
      this.setState({
        pendingRequests,
        apiError: {
          isError: false,
          data: "",
        }
      })
    }).catch(err => {
      this.setState({
        apiError: {
          isError: true,
          data: "Error while fetching pending requests",
        }
      })
    })
  }

  render() {
    const { SearchBar } = Search;
    const { pendingRequests, apiError } = this.state;
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
                    {apiError.isError && <p className="error-text">{apiError.data}</p>}
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

export default Pending;