import React, { Component, Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';

/** 
 * Import all page components here.
 */
const Index = lazy(() => import('../Index/Index'));
const Register = lazy(() => import('../Pages/Register'));
const Login = lazy(() => import('../Pages/Login'));
const EditProfile = lazy(() => import('../Pages/EditProfile'));
import Loading from '../Misc/Loading';
import Politician from '../Pages/Politician';

class Routes extends Component{
    render(){
        return(
            <>
            <Suspense fallback={<Loading/>}>
                <Route exact path="/">
                    <Index/>
                </Route>
                <Route exact path="/register">
                    <Register/>
                </Route>
                <Route exact path="/login">
                    <Login/>
                </Route>
                <Route path="/editprofile">
                    <EditProfile/>
                </Route>
            </Suspense>
            <Route exact path="/politician">
                    <Politician noRequestId={true}/>
            </Route>
            <Route path="/politician/:userId">
                <Politician/>
            </Route>
            </>
        );
    }
}

export default Routes;