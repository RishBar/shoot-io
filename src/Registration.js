import React from 'react';
import './Registration.css';
import { useState, useEffect } from "react";
import axios from "axios";

function Registration() {
  const [state, setState] = useState({username: "", password: "", passwordConf: "", error: ""})
  const setUserName = username => setState({ ...state, username });
  const setPassword = password => setState({ ...state, password });
  const setPasswordConf = passwordConf => setState({ ...state, passwordConf });

  function handleSubmit(event) {
    event.preventDefault();
    const { username, password, passwordConf } = state
    if (password === passwordConf) {
      axios.post('/users', {
        username,
        password
      })
      .then((response) => {
        const message = response.data
        setState((prevState) => ({...prevState, error: message, username: "", password: "", passwordConf: ""}))
      }, (error) => {
        console.log(error);
      });
    }
  };
  return (
    <div className="flex">
      <h1>REGISTER</h1>
      <form className="form-flex" onSubmit={(event) => handleSubmit(event)}>
        <input
          type="username"
          name="username"
          placeholder="Username"
          value={state.username}
          onChange={(event) => setUserName(event.target.value)}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <input
          type="password"
          name="password_confirmation"
          placeholder="Password confirmation"
          value={state.passwordConf}
          onChange={(event) => setPasswordConf(event.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>
      <p className="error">{state.error}</p>
    </div>
  );
}

export default Registration;