import React, { Component } from 'react';
import Badge from 'react-bootstrap/Badge';
import { DashSquare, PlusSquare } from 'react-bootstrap-icons';

class Medal extends Component {
  state = {  }
  render() { 
    const { medal, country, onIncrement, onDecrement } = this.props;
    return (
      <React.Fragment>
        <div style={{ textTransform: "capitalize"}}>
          { medal.name } Medals
        </div>
        <div className="medal-count">
          <DashSquare className="mr-2" />
          <Badge bg="primary" text="light">
            { country[medal.name] }
          </Badge>
          <PlusSquare className="ml-2" />
        </div>
      </React.Fragment>
    );
  }
}

export default Medal;
