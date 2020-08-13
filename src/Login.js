import React from 'react';
import './Login.css';
import { useState, useEffect } from "react";
import axios from "axios";

function Login() {
  const [state, setState] = useState({username: "", password: "", error: ""})
  const setPassword = password => setState((prevState) => ({ ...prevState, password }));
  const setUserName = username => setState((prevState) => ({ ...prevState, username }));

  function handleSubmit(event) {
    event.preventDefault();
	const loggedIn = false;
    const { username, password } = state
      axios.post('/login', {
        username,
        password
      })
      .then((response) => {
        const message = response.data
        setState((prevState) => ({...prevState, error: message, username: "", password: ""}))
      }, (error) => {
        console.log(error);
      });
  };
  
    return (
      <div className="flex">
        <h1>LOGIN</h1>
        <form className="form-flex" onSubmit={(event) => handleSubmit(event)}>
          <input
            className="input-field"
            type="username"
            name="username"
            placeholder="Username"
            value={state.username}
            onChange={(event) => setUserName(event.target.value)}
            required
          />

          <input
            className="input-field"
            type="password"
            name="password"
            placeholder="Password"
            value={state.password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>
        <p className="error">{state.error}</p>
      </div>
    );
}

export default Login;