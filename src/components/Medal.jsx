import React from 'react';
import Badge from 'react-bootstrap/Badge';
import { DashSquare, PlusSquare } from 'react-bootstrap-icons';

const Medal = props => {
  const { medal, country, onIncrement, onDecrement } = props;
  return (
    <React.Fragment>
      <div style={{ textTransform: "capitalize"}}>
        { 
          ( country[medal.name].page_value !== country[medal.name].saved_value) ?
            <span className="delta">{medal.name} Medals: </span>
          :
            <span>{medal.name} Medals</span>
        }
      </div>
      <div className="medal-count">
      <DashSquare 
          onClick={ () => country[medal.name].page_value > 0 && onDecrement(country.id, medal.name) }
          className="me-2 icon-btn" />
        <Badge bg="primary" text="light">
          {/* use medal count displayed in the web page for medal count totals */}
          { country[medal.name].page_value }
        </Badge>
        <PlusSquare 
          onClick={ () => onIncrement(country.id, medal.name) }
          className="ms-2 icon-btn" />
      </div>
    </React.Fragment>
  );
}

export default Medal;
