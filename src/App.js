// Repository:  medals-b-react
// Author:      Jeff Grissom
// Version:     5.xx
import React, { Component } from 'react';
import Country from './components/Country';
import NewCountry from './components/NewCountry';
import './App.css';

class App extends Component {
  state = {
    countries: [
      { id: 1, name: 'United States', gold: 2, silver: 2, bronze: 3 },
      { id: 2, name: 'China', gold: 3, silver: 1, bronze: 0 },
      { id: 3, name: 'Germany', gold: 0, silver: 2, bronze: 2 },
    ],
    medals: [
      { id: 1, name: 'gold' },
      { id: 2, name: 'silver' },
      { id: 3, name: 'bronze' },
    ]
  }
  handleAdd = (name) => {
    const { countries } = this.state;
    const id = countries.length === 0 ? 1 : Math.max(...countries.map(country => country.id)) + 1;
    const mutableCountries = [...countries].concat({ id: id, name: name, gold: 0, silver: 0, bronze: 0 });
    this.setState({ countries: mutableCountries });
  }
  handleDelete = (countryId) => {
    const { countries } = this.state;
    const mutableCountries = [...countries].filter(c => c.id !== countryId);
    this.setState({ countries: mutableCountries });
  }
  handleIncrement = (countryId, medalName) => {
    const countries = [ ...this.state.countries ];
    const idx = countries.findIndex(c => c.id === countryId);
    countries[idx][medalName] += 1;
    this.setState({ countries: countries });
  }
  handleDecrement = (countryId, medalName) => {
    const countries = [ ...this.state.countries ];
    const idx = countries.findIndex(c => c.id === countryId);
    countries[idx][medalName] -= 1;
    this.setState({ countries: countries });
  }
  getAllMedalsTotal() {
    let sum = 0;
    this.state.medals.forEach(medal => { sum += this.state.countries.reduce((a, b) => a + b[medal.name], 0); });
    return sum;
  }
  render() { 
    return (
      <React.Fragment>
        <div className='appHeading'>
          Olympic Medals
          <span className='badge'>
            { this.getAllMedalsTotal() }
          </span>
        </div>
        <div className='countries'>
            { this.state.countries.map(country => 
              <Country 
                key={ country.id } 
                country={ country } 
                medals={ this.state.medals }
                onDelete={ this.handleDelete }
                onIncrement={ this.handleIncrement } 
                onDecrement={ this.handleDecrement } />
            )}
        </div>
        <NewCountry onAdd={ this.handleAdd } />
      </React.Fragment>
    );
  }
}
 
export default App;
