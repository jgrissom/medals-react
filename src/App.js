// Repository:  medals-b-react
// Author:      Jeff Grissom
// Version:     6.xx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Country from './components/Country';
import NewCountry from './components/NewCountry';
import './App.css';

const App = () => {
  const apiEndpoint = "https://localhost:5001/api/country";
  // const apiEndpoint = "https://medalsapi.azurewebsites.net/api/country";
  const [ countries, setCountries ] = useState([]);
  const medals = useRef([
    { id: 1, name: 'gold' },
    { id: 2, name: 'silver' },
    { id: 3, name: 'bronze' },
  ]);

  // this is the functional equivalent to componentDidMount
  useEffect(() => {
    // initial data loaded here
    async function fetchCountries() {
      const { data : fetchedCountries } = await axios.get(apiEndpoint);
      setCountries(fetchedCountries);
    }
    fetchCountries();
  }, []);

  const handleAdd = async (name) => {
    const { data: post } = await axios.post(apiEndpoint, { name: name });
    setCountries(countries.concat(post));
  }
  const handleDelete = (countryId) => {
    // setCountries([...countries].filter(c => c.id !== countryId));
  }
  const handleIncrement = (countryId, medalName) => {
    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [...countries ];
    mutableCountries[idx][medalName] += 1;
    setCountries(mutableCountries);
  }
  const handleDecrement = (countryId, medalName) => {
    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [...countries ];
    mutableCountries[idx][medalName] -= 1;
    setCountries(mutableCountries);
  }
  const getAllMedalsTotal = () => {
    let sum = 0;
    medals.current.forEach(medal => { sum += countries.reduce((a, b) => a + b[medal.name], 0); });
    return sum;
  }
  return (
    <React.Fragment>
      <div className='appHeading'>
        Olympic Medals
        <span className='badge'>
          { getAllMedalsTotal() }
        </span>
      </div>
      <div className='countries'>
          { countries.map(country => 
            <Country 
              key={ country.id } 
              country={ country } 
              medals={ medals.current }
              onDelete={ handleDelete }
              onIncrement={ handleIncrement } 
              onDecrement={ handleDecrement } />
          )}
      </div>
      <NewCountry onAdd={ handleAdd } />
    </React.Fragment>
  );
}
 
export default App;
