import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import pjson from '../package.json';
import App from './App/App';
import './index.css';

const title = 'Kazou - Massembre bar';
const adminPincode = '123456';
const { version } = pjson;

const appProps = {
  title,
  adminPincode,
  version,
};

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <App {...appProps} />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
