import React, { Component } from 'react';
import Medal from './Medal';
import Card from 'react-bootstrap/Card';

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
          <Card.Title>{ country.name }</Card.Title>
        </Card.Body>
      </Card>
    );
  }
}

export default Country;
