import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import { Person } from 'react-bootstrap-icons';

const Login = (props) => {
  const [ showModal, setShowModal ] = useState(false);
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => {
    setShowModal(true);
    setUsername("");
    setPassword("");
  }
  const handleModalKeyPress = (e) => username.length > 0  && password.length > 0 && (e.keyCode ? e.keyCode : e.which) === 13 && handleLogin();
  const handleLogin = () => {
    props.onLogin(username, password);
    handleModalClose();
  }

  return (
    <React.Fragment>
      <Nav.Link className="btn" href="#" onClick={ handleModalShow }><Person /></Nav.Link>
      <Modal onKeyPress={ handleModalKeyPress } show={ showModal } onHide={ handleModalClose }>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              onChange={ (e) => setUsername(e.target.value) }
              value={ username }
              placeholder="enter username"
              autoFocus
              autoComplete='off'
            />
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              onChange={ (e) => setPassword(e.target.value) }
              value={ password }
              placeholder="enter password"
              autoComplete='off'
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={ handleModalClose }>
            Close
          </Button>
          <Button variant="primary" onClick={ handleLogin } disabled={ username.length > 0  && password.length > 0 ? false : true }>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default Login;
