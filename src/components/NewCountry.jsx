import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { PlusCircleFill } from 'react-bootstrap-icons';

class NewCountry extends Component {
  state = {  }

  render() { 
    return (
      <React.Fragment>
        <Button variant="outline-success">
          <PlusCircleFill />
        </Button>
      </React.Fragment>
    );
  }
}

export default NewCountry;
