import React from 'react';
import logo from './logo.svg';
import './App.css';
import WebSocketComponent from './WebSocketDemo';
import useOrderBookData from './connection/useOrderBookData';

function App() {
  const orderBookData = useOrderBookData();
  return (
    <div className="App">
      Hello World!
      <span>Last message: {orderBookData.lastMessage}</span>
      <span>Ready state: {orderBookData.connectionStatus}</span>
      {/* <WebSocketComponent /> */}
    </div>
  );
}

export default App;
