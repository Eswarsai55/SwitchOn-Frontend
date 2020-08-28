import React, { Fragment } from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import BaseComponent from '../../utils/BaseComponent';
import Login from '../../pages/login/Login';
import { withRouter } from 'react-router-dom';

class SuccessModal extends BaseComponent {
  
  openLoginForm = (route) => {
    this.props.history.push(`/${route}`);
    this.props.onClose();
  }

  render() {
    const { title, message, subMessage, route} = this.props;
    return (
      <Fragment>
        <Modal show={this.props.show} onHide={this.props.onClose}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
            <Col md="12">
              <div className="sign-up-section">
                <h1>{message}</h1>
                <span className="sign-up-link" onClick={() => this.openLoginForm(route)}>Click Here</span> {subMessage}
              </div>
            </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </Fragment>
    )
  }
}

export default withRouter(SuccessModal);