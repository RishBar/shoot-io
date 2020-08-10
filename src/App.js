import React from 'react';
import { useState, useEffect, Fragment } from "react";
import './App.css';
import Registration from "./Registration";
import Login from "./Login";



function App() {
  return (
    < Fragment >
      <div class="header">
        <h1>Shoot.io</h1>
        <p>Shoot the other guys!</p>
      </div>
      < Registration />
      < Login />
      <a href="/index">Go to the game!</a>
    </ Fragment >
  );
}

export default App;


