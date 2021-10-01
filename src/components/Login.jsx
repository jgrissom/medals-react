import React, {useState}  from 'react';
import { useHistory } from "react-router-dom";

function Login(props) {
  const { onLogin } = props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit');
    onLogin(username, password);
    history.push("/");
  }
  const handleCancel = () => {
    history.push("/");
  }

  return (
    <form className='loginForm' onSubmit={(e) => handleSubmit(e)}>
      <p>
        <label htmlFor="username">Username: </label>
        <input onChange={ (e) => setUsername(e.target.value) } value={username} autoFocus type="text" name="username" id="username" placeholder="Username" />
      </p>
      <p>
        <label htmlFor="password">Password: </label>
        <input onChange={ (e) => setPassword(e.target.value) } value={password} type="password" name="password" id="password" placeholder="Password" />
      </p>
      <p>
        <button disabled={username.length === 0 || password.length === 0} type="submit">Submit</button> <button onClick={handleCancel} type="button">Cancel</button>
      </p>
    </form>
  );
}

export default Login;
