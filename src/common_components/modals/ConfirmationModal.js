import React from "react";
import {Button, Col, Modal, Row} from "react-bootstrap";
import BaseComponent from "../../utils/BaseComponent";
import CustomForm from '../../utils/CustomForm';
import CustomFormElement from '../../utils/CustomFormElement';
import Validator from "../../utils/Validator";
import { TextControl } from "../../utils/TextControl";

class ConfirmationModal extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      reason: "",
    }
  }

  render() {
    const btnStyle = {
        "marginRight": "0.5rem",
    };
    return (
      <Modal show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CustomForm>
            <CustomFormElement
              valueLink={this.linkState(this, 'reason')}
              label="Reason"
              required
              validations={[
                {
                  validate: Validator.isRequired,
                  message: 'Reason is required'
                }
              ]}
              control={{
                type: TextControl,
                settings: {
                  placeholder: '',
                }
              }}
            />
          </CustomForm>

          <Row>

            <Col md={2} mdOffset={4}>
              <Button
                style={btnStyle}
                variant="success"
                bsStyle="success"
                type="submit"
                block
                disabled={this.state.reason === ""}
                onClick={() => this.props.reject(this.props.id, this.state.reason)}
              >
                Yes
              </Button>
            </Col>

            <Col md={2}>
              <Button
                style={btnStyle}
                variant="danger"
                bsStyle="danger"
                type="submit"
                block
                onClick={this.props.onClose}
              >
                No
              </Button>
            </Col>

          </Row>

        </Modal.Body>
      </Modal>
    )
  }

}

export default ConfirmationModal;
