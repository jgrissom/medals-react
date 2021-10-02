// Repository:  medals-b-react
// Author:      Jeff Grissom
// Version:     9.xx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import jwtDecode from 'jwt-decode';
import Login from './components/Login';
import Country from './components/Country';
import NewCountry from './components/NewCountry';
import './App.css';

const App = () => {
  // const apiEndpoint = "https://localhost:5001/jwt/api/country";
  // const hubEndpoint = "https://localhost:5001/medalsHub"
  // const usersEndpoint = "https://localhost:5001/api/users/login";
  const apiEndpoint = "https://medalsapi.azurewebsites.net/jwt/api/country";
  const hubEndpoint = "https://medalsapi.azurewebsites.net/medalsHub"
  const usersEndpoint = "https://medalsapi.azurewebsites.net/api/users/login";
  const [ countries, setCountries ] = useState([]);
  const [ connection, setConnection] = useState(null);
  const medals = useRef([
    { id: 1, name: 'gold' },
    { id: 2, name: 'silver' },
    { id: 3, name: 'bronze' },
  ]);
  const [ user, setUser ] = useState(
    {
      name: null,
      canPost: false,
      canPatch: false,
      canDelete: false
    }
  );
  const latestCountries = useRef(null);
  // latestCountries.current is a ref variable to countries
  // this is needed to access state variable in useEffect w/o dependency
  latestCountries.current = countries;

  // this is the functional equivalent to componentDidMount
  useEffect(() => {
    // initial data loaded here
    async function fetchCountries() {
      const { data : fetchedCountries } = await axios.get(apiEndpoint);
      let newCountries = [];
      fetchedCountries.forEach(country => {
        let newCountry = {
          id: country.id,
          name: country.name,
        };
        medals.current.forEach(medal => {
          const count = country[medal.name];
          newCountry[medal.name] = { page_value: count, saved_value: count };
        });
        newCountries.push(newCountry);
      });
      setCountries(newCountries);
    }
    fetchCountries();

    const encodedJwt = localStorage.getItem("token");
    // check for existing token
    if (encodedJwt) {
      setUser(getUser(encodedJwt));
    }

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

          let newCountry = { 
            id: country.id, 
            name: country.name,
          };
          medals.current.forEach(medal => {
            const count = country[medal.name];
            newCountry[medal.name] = { page_value: count, saved_value: count };
          });
          let mutableCountries = [...latestCountries.current];
          mutableCountries = mutableCountries.concat(newCountry);
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
          let updatedCountry = {
            id: country.id,
            name: country.name,
          }
          medals.current.forEach(medal => {
            const count = country[medal.name];
            updatedCountry[medal.name] = { page_value: count, saved_value: count };
          });
          let mutableCountries = [...latestCountries.current];
          const idx = mutableCountries.findIndex(c => c.id === country.id);
          mutableCountries[idx] = updatedCountry;

          setCountries(mutableCountries);
        });
      })
      .catch(e => console.log('Connection failed: ', e));
    }
  // useEffect is dependent on changes connection
  }, [connection]);

  const handleAdd = async (name) => {
    // check for valid token
    if (isValidToken())
    {
      try {
        await axios.post(apiEndpoint, {
          name: name
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch (ex) {
        if (ex.response && ex.response.status === 401) {
          alert("You are not authorized to complete this request");
        } else if (ex.response) {
          console.log(ex.response);
        } else {
          console.log("Request failed");
        }
      }
    } else {
      alert('Your token has expired');
    }
  }
  const handleDelete = async (countryId) => {
    // check for valid token
    if (isValidToken())
    {
      const originalCountries = countries;
      setCountries(countries.filter(c => c.id !== countryId));
      try {
        await axios.delete(`${apiEndpoint}/${countryId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch (ex) {
        if (ex.response && ex.response.status === 404) {
          // country already deleted
          console.log("The record does not exist - it may have already been deleted");
        } else { 
          setCountries(originalCountries);
          if (ex.response && ex.response.status === 401) {
            alert("You are not authorized to complete this request");
          } else if (ex.response) {
            console.log(ex.response);
          } else {
            console.log("Request failed");
          }
        }
      }
    } else {
      alert('Your token has expired');
    }
  }
  const handleSave = async (countryId) => {
    const originalCounts = {};

    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [ ...countries ];
    const country = mutableCountries[idx];
    let jsonPatch = [];
    medals.current.forEach(medal => {
      originalCounts[medal.name] = country[medal.name].saved_value;
      if (country[medal.name].page_value !== country[medal.name].saved_value) {
        jsonPatch.push({ op: "replace", path: medal.name, value: country[medal.name].page_value });
        country[medal.name].saved_value = country[medal.name].page_value;
      }
    });
    console.log(`json patch for id: ${countryId}: ${JSON.stringify(jsonPatch)}`);
    // check for valid token
    if (isValidToken())
    {
      try {
        await axios.patch(`${apiEndpoint}/${countryId}`, jsonPatch, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch (ex) {
        medals.current.forEach(medal => {
          country[medal.name].page_value = originalCounts[medal.name];
          country[medal.name].saved_value = originalCounts[medal.name];
        });     
        if (ex.response && ex.response.status === 404) {
          // country does not exist
          console.log("The record does not exist - it may have been deleted");
        } else if (ex.response && ex.response.status === 401) { 
          alert('You are not authorized to complete this request');
        } else if (ex.response) {
          console.log(ex.response);
        } else {
          console.log("Request failed");
        }
      }
    } else {
      medals.current.forEach(medal => {
        country[medal.name].page_value = originalCounts[medal.name];
        country[medal.name].saved_value = originalCounts[medal.name];
      });  
      alert('Your token has expired');
    }
    setCountries(mutableCountries);
  }
  const handleReset = (countryId) => {
    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [ ...countries ];
    const country = mutableCountries[idx];
    medals.current.forEach(medal => {
      country[medal.name].page_value = country[medal.name].saved_value;
    });
    setCountries(mutableCountries);
  }
  const handleIncrement = (countryId, medalName) => handleUpdate(countryId, medalName, 1);
  const handleDecrement = (countryId, medalName) => handleUpdate(countryId, medalName, -1);
  const handleUpdate = (countryId, medalName, factor) => {
    const idx = countries.findIndex(c => c.id === countryId);
    const mutableCountries = [...countries ];
    mutableCountries[idx][medalName].page_value += (1 * factor);
    setCountries(mutableCountries);
  }
  const handleLogin = async (username, password) => {
    try {
      const resp = await axios.post(usersEndpoint, { username: username, password: password });
      const encodedJwt = resp.data.token;
      localStorage.setItem('token', encodedJwt);
      setUser(getUser(encodedJwt));
    } catch (ex) {
      if (ex.response && (ex.response.status === 401 || ex.response.status === 400 )) {
        alert("Login failed");
      } else if (ex.response) {
        console.log(ex.response);
      } else {
        console.log("Request failed");
      }
    }
  }
  const handleLogout = (e) => {
    e && e.preventDefault();
    console.log('logout');
    localStorage.removeItem('token');
    setUser({
      name: null,
      canPost: false,
      canPatch: false,
      canDelete: false
    });
    return false;
  }
  const getUser = (encodedJwt) => {
    const decodedJwt = jwtDecode(encodedJwt);
    const diff = Date.now() - (decodedJwt['exp'] * 1000);
    if (diff < 0) {
      // token not expired
      console.log(`token expires in ${parseInt((diff * -1) / 60000)} minutes`);
      return {
        name: decodedJwt['username'],
        canPost: decodedJwt['roles'].indexOf('medals-post') === -1 ? false : true,
        canPatch: decodedJwt['roles'].indexOf('medals-patch') === -1 ? false : true,
        canDelete: decodedJwt['roles'].indexOf('medals-delete') === -1 ? false : true,
      };
    }
    // token expired
    console.log(`token expired ${parseInt(diff / 60000)} minutes ago`);
    localStorage.removeItem('token');
    return {
      name: null,
      canPost: false,
      canPatch: false,
      canDelete: false,
    }
  }
  const isValidToken = () => {
    const encodedJwt = localStorage.getItem("token");
    // check for existing token
    if (encodedJwt) {
      const decodedJwt = jwtDecode(encodedJwt);
      const diff = Date.now() - (decodedJwt['exp'] * 1000);
      if (diff < 0) {
        console.log(`token expires in ${parseInt((diff * -1) / 60000)} minutes`);
        return true;
      } else {
        console.log(`token expired ${parseInt(diff / 60000)} minutes ago`);
        handleLogout();
      }
    }
    return false;
  }
  const getAllMedalsTotal = () => {
    let sum = 0;
    medals.current.forEach(medal => { sum += countries.reduce((a, b) => a + b[medal.name].page_value, 0); });
    return sum;
  }
  return (
    <Router>
      <div className='appHeading'>
        Olympic Medals
        <span className='badge'>
          { getAllMedalsTotal() }
        </span>
        {user.name ? 
          <span className='logout'><a href="/" onClick={handleLogout} className='logoutLink'>Logout</a> [{user.name}]</span>
          :
          <Link to="/login" className='loginLink'>Login</Link>
        }
      </div>
      <Route exact path="/login">
        <Login onLogin={handleLogin} />
      </Route>
      <div className='countries'>
          { countries.map(country => 
            <Country 
              key={ country.id } 
              country={ country } 
              medals={ medals.current }
              canDelete={ user.canDelete }
              canPatch={ user.canPatch }
              onDelete={ handleDelete }
              onSave={ handleSave }
              onReset={ handleReset }
              onIncrement={ handleIncrement } 
              onDecrement={ handleDecrement } />
          )}
      </div>
      { user.canPost && <NewCountry onAdd={ handleAdd } /> }
    </Router>
  );
}
 
export default App;
