import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import CartaProvider from './context/CartaProvider';

ReactDOM.render(
  <CartaProvider>
    <App />
  </CartaProvider>
  ,
  document.getElementById('root')
);

