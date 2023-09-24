// Repository:  medals-b-react
// Author:      Jeff Grissom
// Version:     4.xx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Country from './components/Country';
import NewCountry from './components/NewCountry';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './App.css';

const App = () => {
  const apiEndpoint = "https://medals-api-6.azurewebsites.net/api/country";
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
      // we need to save the original medal count values in state
      let newCountries = [];
      fetchedCountries.forEach(country => {
        let newCountry = {
          id: country.id,
          name: country.name,
        };
        medals.current.forEach(medal => {
          const count = country[medal.name];
          // page_value is what is displayed on the web page
          // saved_value is what is saved to the database
          newCountry[medal.name] = { page_value: count, saved_value: count };
        });
        newCountries.push(newCountry);
      });
      setCountries(newCountries);
    }
    fetchCountries();
  }, []);

  const handleAdd = async (name) => {
    const { data: post } = await axios.post(apiEndpoint, { name: name });
    let newCountry = { 
      id: post.id, 
      name: post.name,
    };
    medals.current.forEach(medal => {
      const count = post[medal.name];
      // when a new country is added, we need to store page and saved values for
      // medal counts in state
      newCountry[medal.name] = { page_value: count, saved_value: count };
    });
    setCountries(countries.concat(newCountry));
  }
  const handleDelete = async (countryId) => {
    const originalCountries = countries;
    setCountries(countries.filter(c => c.id !== countryId));
    try {
      await axios.delete(`${apiEndpoint}/${countryId}`);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        // country already deleted
        console.log("The record does not exist - it may have already been deleted");
      } else { 
        alert('An error occurred while deleting');
        setCountries(originalCountries);
      }
    }
  }
  const handleIncrement = (countryId, medalName) => {
    // const idx = countries.findIndex(c => c.id === countryId);
    // const mutableCountries = [...countries ];
    // mutableCountries[idx][medalName] += 1;
    // setCountries(mutableCountries);
    console.log('+');
  }
  const handleDecrement = (countryId, medalName) => {
    // const idx = countries.findIndex(c => c.id === countryId);
    // const mutableCountries = [...countries ];
    // mutableCountries[idx][medalName] -= 1;
    // setCountries(mutableCountries);
    console.log('-');
  }
  const getAllMedalsTotal = () => {
    let sum = 0;
    // use medal count displayed in the web page for medal count totals
    medals.current.forEach(medal => { sum += countries.reduce((a, b) => a + b[medal.name].page_value, 0); });
    return sum;
  }
  return (
    <React.Fragment>
    <Navbar className="navbar-dark bg-dark">
        <Container fluid>
          <Navbar.Brand>
            Olympic Medals
            <Badge className="ml-2" bg="light" text="dark" pill>{ getAllMedalsTotal() }</Badge>
          </Navbar.Brand>
          <NewCountry onAdd={ handleAdd } />
        </Container>
    </Navbar>
    <Container fluid>
    <Row>
      { countries.map(country => 
        <Col className="mt-3" key={ country.id }>
          <Country  
            country={ country } 
            medals={ medals.current }
            onDelete={ handleDelete }
            onIncrement={ handleIncrement } 
            onDecrement={ handleDecrement } />
        </Col>
      )}
      </Row>
    </Container>
    </React.Fragment>
  );
}
 
export default App;
