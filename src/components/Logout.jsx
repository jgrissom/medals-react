import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import { PersonCheckFill } from 'react-bootstrap-icons';

const Logout = (props) => {
  const [ showModal, setShowModal ] = useState(false);

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => {
    setShowModal(true);
  }
  const handleModalKeyPress = (e) => (e.keyCode ? e.keyCode : e.which) === 13 && handleLogout();
  const handleLogout = () => {
    props.onLogout();
    handleModalClose();
  }

  return (
    <React.Fragment>
      <Nav.Link className="btn" href="#" onClick={ handleModalShow }><PersonCheckFill /></Nav.Link>
      <Modal onKeyPress={ handleModalKeyPress } show={ showModal } onHide={ handleModalClose }>
        <Modal.Header closeButton>
          <Modal.Title>Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Click Logout to continue
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={ handleModalClose }>
            Close
          </Button>
          <Button variant="primary" onClick={ handleLogout }>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default Logout;
