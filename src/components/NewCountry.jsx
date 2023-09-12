import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { PlusCircleFill } from 'react-bootstrap-icons';

class NewCountry extends Component {
  state = {
    showModal: false,
  }

  render() { 
    return (
      <React.Fragment>
        <Button variant="outline-success" onClick={ () => this.setState({ showModal: true })}>
          <PlusCircleFill />
        </Button>
        <Modal show={ this.state.showModal }>
          <Modal.Header closeButton>
            <Modal.Title>New Country</Modal.Title>
          </Modal.Header>
          <Modal.Body>[ New Country Info Here ]</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary">
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
