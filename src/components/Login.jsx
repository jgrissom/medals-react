import React from 'react';

function Login() {
  return (
    <form className='loginForm'>
      <p>
        <label htmlFor="username">Username: </label>
        <input type="text" name="username" id="username" placeholder="Username" />
      </p>
      <p>
        <label htmlFor="password">Password: </label>
        <input type="password" name="password" id="password" placeholder="Password" />
      </p>
      <p>
        <button type="submit">Submit</button> <button type="button">Cancel</button>
      </p>
    </form>
  );
}

export default Login;
