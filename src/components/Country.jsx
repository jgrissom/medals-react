import React, { Component } from 'react';
import Medal from './Medal';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

class Country extends Component {
  getMedalsTotal(country, medals) {
    let sum = 0;
    medals.forEach(medal => { sum += country[medal.name]; });
    return sum;
  }
  render() { 
    const { country, medals, onIncrement, onDecrement, onDelete } = this.props;
    return (
      <Card>
        <Card.Body>
          <Card.Title className="d-flex justify-content-between">
            <span>
            { country.name }
            <Badge bg="secondary" text="light" pill className="ml-2">
              { this.getMedalsTotal(country, medals) }
            </Badge>
            </span>
          </Card.Title>
        </Card.Body>
      </Card>
    );
  }
}

export default Country;
