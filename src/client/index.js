import axios from 'axios';
import React, { Provider } from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { UserContext } from './context/UserContext.js';
import UserContextProvider from './context/UserContextProvider';

import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from './components/Structure/AlertTemplate';

const options = {
    // you can also just use 'bottom center'
    position: positions.TOP_RIGHT,
    timeout: 5000,
    offset: '10px',
    // you can also just use 'scale'
    transition: transitions.FADE
  }
  

ReactDOM.render(
    <AlertProvider template={AlertTemplate} {...options}>
        <UserContextProvider>
            <App />
        </UserContextProvider>
    </AlertProvider>, 
document.getElementById('root'));
