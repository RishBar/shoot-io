import React from 'react';
import { useState, useEffect, Fragment } from "react";
import './App.css';
import logo from './logo.png'
import wasd from './WASD.png'
import mouse from './mouse.png'
import playButton from './playButton.png'
import Registration from "./Registration";
import Login from "./Login";



function App() {
  return (
    < div className = "body">
      <div className = "header">
        <h1><img src={logo} alt='shoot.io' width='500' height='100'/></h1>
        <h2>Controls:</h2> 
        <div className = "controls">
        <div className = "control-image"><img src={wasd} alt='WASD' width='154' height='100'/><p> - Movement</p></div>
        <div className = "control-image"><img src={mouse} alt='MOUSE' width='140' height='140'/><p> - Directional Movement and Shooting</p></div>
        </div>
        <p>Objective: Shoot Anything That Moves</p>
      </div>
      <div className = "register">
        < Registration />
        < Login />
      </div>
      {/* <button type="button"><a href="/index">Go to the game!</a></button> */}
      <form action="/index" className = "play">
        <input type="image"  className = "playButton" src={playButton} width='90' height='90' onClick="submit" />
      </form>
      <br/>
      <br/>
      <br/>
    </ div >
  );
}

export default App;


