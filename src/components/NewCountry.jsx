import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { PlusCircleFill } from 'react-bootstrap-icons';

class NewCountry extends Component {
  state = {
    showModal: false,
  }
  handleModalClose = () => this.setState({ showModal: false });

  render() { 
    return (
      <React.Fragment>
        <Button variant="outline-success" onClick={ () => this.setState({ showModal: true })}>
          <PlusCircleFill />
        </Button>
        <Modal show={ this.state.showModal } onHide={ this.handleModalClose }>
          <Modal.Header closeButton>
            <Modal.Title>New Country</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="modalForm1">
              <Form.Label>Country Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="enter name"
                autoFocus
                autoComplete='off'
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={ this.handleModalClose }>
              Close
            </Button>
            <Button variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default NewCountry;
