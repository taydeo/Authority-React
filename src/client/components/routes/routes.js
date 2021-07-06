import React, { Component, Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";

/**
 * Import all page components here.
 */
const Index = lazy(() => import("../Index/Index"));
const Register = lazy(() => import("../Pages/Register"));
const Login = lazy(() => import("../Pages/Login"));
const EditProfile = lazy(() => import("../Pages/EditProfile"));
import Party from "../Pages/Party";
import NoMatch from "../Pages/NoMatch";
import Loading from "../Misc/Loading";
import Politician from "../Pages/Politician/Politician";

class Routes extends Component {
  render() {
    return (
      <Switch>
        {/*Home Page*/}
        <Route exact path="/">
          <Suspense fallback={<Loading />}>
            <Index />
          </Suspense>
        </Route>

        {/*Register Page*/}
        <Route path="/register">
          <Suspense fallback={<Loading />}>
            <Register />
          </Suspense>
        </Route>

        {/*Login Page*/}
        <Route path="/login">
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        </Route>

        {/*Edit Profile Page*/}
        <Route path="/editprofile">
          <Suspense fallback={<Loading />}>
            <EditProfile />
          </Suspense>
        </Route>

        {/*Politician Pages*/}
        <Route exact path="/politician">
          <Politician noRequestId={true} />
        </Route>
        <Route path="/politician/:userId">
          <Politician />
        </Route>
        <Route path={["/party/:partyId/:mode?", "/party"]}>
          <Party />
        </Route>

        {/*Not Found Route*/}
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    );
  }
}

export default Routes;
