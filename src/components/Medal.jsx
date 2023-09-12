import React, { Component } from 'react';
import Badge from 'react-bootstrap/Badge';


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
          <Badge bg="primary" text="light">
            { country[medal.name] }
          </Badge>
        </div>
      </React.Fragment>
    );
  }
}

export default Medal;
