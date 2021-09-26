// Repository:  medals-b-react
// Author:      Jeff Grissom
// Version:     9.xx-01
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { HubConnectionBuilder } from '@microsoft/signalr';
import Country from './components/Country';
import NewCountry from './components/NewCountry';
import './App.css';

const App = () => {
  // const apiEndpoint = "https://localhost:5001/api/country";
  // const jwtApiEndPoint = "https://localhost:5001/jwtapi/country";
  // const hubEndpoint = "https://localhost:5001/medalsHub"
  // const apiEndpoint = "https://medalsapi.azurewebsites.net/api/country";
  const jwtApiEndPoint = "https://medalsapi.azurewebsites.net/jwtapi/country";
  const hubEndpoint = "https://medalsapi.azurewebsites.net/medalsHub"
  const [ countries, setCountries ] = useState([]);
  const [ connection, setConnection] = useState(null);
  const medals = useRef([
    { id: 1, name: 'gold' },
    { id: 2, name: 'silver' },
    { id: 3, name: 'bronze' },
  ]);
  const latestCountries = useRef(null);
  // latestCountries.current is a ref variable to countries
  // this is needed to access state variable in useEffect w/o dependency
  latestCountries.current = countries;

  // this is the functional equivalent to componentDidMount
  useEffect(() => {
    // initial data loaded here
    async function fetchCountries() {
      const { data : fetchedCountries } = await axios.get(jwtApiEndPoint);
      setCountries(fetchedCountries);
    }
    fetchCountries();

    // signalR
    const newConnection = new HubConnectionBuilder()
      .withUrl(hubEndpoint)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);
  // componentDidUpdate (changes to connection)
  useEffect(() => {
    if (connection) {
      connection.start()
      .then(() => {
        console.log('Connected!')

        connection.on('ReceiveAddMessage', country => {
          console.log(`Add: ${country.name}`);
          let mutableCountries = [...latestCountries.current];
          mutableCountries = mutableCountries.concat(country);

          setCountries(mutableCountries);
        });

        connection.on('ReceiveDeleteMessage', id => {
          console.log(`Delete id: ${id}`);
          let mutableCountries = [...latestCountries.current];
          mutableCountries = mutableCountries.filter(c => c.id !== id);

          setCountries(mutableCountries);
        });

        connection.on('ReceivePatchMessage', country => {
          console.log(`Patch: ${country.name}`);
          let mutableCountries = [...latestCountries.current];
          const idx = mutableCountries.findIndex(c => c.id === country.id);
          mutableCountries[idx] = country;

          setCountries(mutableCountries);
        });
      })
      .catch(e => console.log('Connection failed: ', e));
    }
  // useEffect is dependent on changes connection
  }, [connection]);

  const handleAdd = async (name) => {
    try {
      await axios.post(jwtApiEndPoint, { name: name });
    } catch (ex) {
      if (ex.response && ex.response.status === 401) {
        alert("You are not authorized to complete this request");
      } else if (ex.response) {
        console.log(ex.response);
      } else {
        console.log("Request failed");
      }
    }
  }
  const handleDelete = async (countryId) => {
    const originalCountries = countries;
    setCountries(countries.filter(c => c.id !== countryId));
    try {
      await axios.delete(`${jwtApiEndPoint}/${countryId}`);
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
  const handleIncrement = (countryId, medalName) => handleUpdate(countryId, medalName, 1);
  const handleDecrement = (countryId, medalName) =>  handleUpdate(countryId, medalName, -1)
  const handleUpdate = async (countryId, medalName, factor) => {
    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [...countries ];
    const originalCount = mutableCountries[idx][medalName];
    mutableCountries[idx][medalName] += (1 * factor);
    setCountries(mutableCountries);
    const jsonPatch = [{ op: "replace", path: medalName, value: mutableCountries[idx][medalName] }];
    console.log(`json patch for id: ${countryId}: ${JSON.stringify(jsonPatch)}`);

    try {
      await axios.patch(`${jwtApiEndPoint}/${countryId}`, jsonPatch);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        // country does not exist
        console.log("The record does not exist - it may have been deleted");
      } else if (ex.response && ex.response.status === 401) { 
        alert('You are not authorized to complete this request');
        const revertCountries = [...countries];
        revertCountries[idx][medalName] = originalCount;
        setCountries(revertCountries);
      } else if (ex.response) {
        console.log(ex.response);
      } else {
        console.log("Request failed");
      }
    }
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
