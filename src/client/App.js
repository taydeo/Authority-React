import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';

import Routes from './components/routes/routes.js';
import { UserContext } from './context/UserContext.js';
import { useAlert } from 'react-alert';


export default function App(props){
  const { alert, setAlert } = useContext(UserContext);

  const alertDialog = useAlert()

  useEffect(()=>{
    if(alert != null){
      alertDialog.show(alert);
      setAlert(null);
    }

    axios.get("/api/init").then(function(response){
      if(response.status != 200){
        console.log("Error intializing session vars.")
      }
    })
  });

  return (
    <Router>
      <Switch>
        <Routes/>
      </Switch>
    </Router>
  );
}
