import React from 'react';
import logo from './logo.svg';
import './App.css';
import WebSocketComponent from './WebSocketDemo';
import useOrderBookData from './data/useOrderBookWebSocket';
import Main from './app/Main';

function App() {
  return (
    <Main/>
  );
}

export default App;
