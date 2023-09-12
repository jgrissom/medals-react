import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { PlusCircleFill } from 'react-bootstrap-icons';

class NewCountry extends Component {
  state = {
    showModal: false,
    showToast: false,
    newCountryName: "",
  }
  handleModalClose = () => this.setState({ showModal: false });
  handleModalKeyPress = (e) => (e.keyCode ? e.keyCode : e.which) === 13 && this.handleAdd();
  handleAdd = () => {
    this.state.newCountryName.length > 0 ? this.props.onAdd(this.state.newCountryName) : this.setState({ showToast: true });
    this.handleModalClose();
  }

  render() { 
    return (
      <React.Fragment>
        <Button variant="outline-success" onClick={ () => this.setState({ showModal: true, newCountryName: "" })}>
          <PlusCircleFill />
        </Button>
        <Modal onKeyPress={ this.handleModalKeyPress } show={ this.state.showModal } onHide={ this.handleModalClose }>
          <Modal.Header closeButton>
            <Modal.Title>New Country</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="modalForm1">
              <Form.Label>Country Name</Form.Label>
              <Form.Control
                type="text"
                name="newCountryName"
                onChange={ (e) => this.setState({ [e.target.name]: e.target.value}) }
                value={ this.state.newCountryName }
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
            <Button variant="primary" onClick={ this.handleAdd }>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <ToastContainer className="position-fixed" style={{top:5,right:5,zIndex:5,width:'18rem'}}>
        <Toast show={ this.state.showToast } onClose={ () => this.setState({showToast: false })} delay={ 2000 } autohide>
          <Toast.Header className="justify-content-between">
            <strong className="me-auto">Country Not Added</strong>
          </Toast.Header>
          <Toast.Body>Enter a name to add a new country</Toast.Body>
        </Toast>
        </ToastContainer>
      </React.Fragment>
    );
  }
}

export default NewCountry;
