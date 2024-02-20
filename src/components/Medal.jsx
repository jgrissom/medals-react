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
        <DashSquare 
            onClick={ () => country[medal.name] > 0 && onDecrement(country.id, medal.name) } 
            className="me-2 icon-btn" />
          <Badge bg="primary" text="light">
            { country[medal.name] }
          </Badge>
          <PlusSquare 
            onClick={ () => onIncrement(country.id, medal.name) }
            className="ms-2 icon-btn" />
        </div>
      </React.Fragment>
    );
  }
}

export default Medal;
