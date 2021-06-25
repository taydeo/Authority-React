import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import AuthorizationService from '../service/AuthService';
import Loading from '../components/Misc/Loading';
import { AlertContext } from './AlertContext';

export default function ContextProvider(props){
    const [sessionData, setSessionData] = useState({});
    const [playerData, setPlayerData] = useState({});
    const [loading, setLoading] = useState(true);

    const { setAlert } = useContext(AlertContext);

    useEffect(() => {
        const fetchData = async ()=>{
            try{
                const sessionDataX = await AuthorizationService.getSessionData();
                var setSessionDataTo = {};
                if(sessionDataX.loggedIn){
                    // If logged in information is attached to the session, set player data to it to prevent having to hit API twice.
                    if(sessionDataX.hasOwnProperty('loggedInInfo')){
                        setPlayerData(sessionDataX.loggedInInfo);
                    }
                    else{
                        setPlayerData(await AuthorizationService.getLoggedInData());
                    }
                    if(playerData.hasOwnProperty("error")){
                        console.log(playerData);
                       // Error fetching player data, so lets invalidate the session.
                       setPlayerData({});
                       setAlert("There was an error fetching your account..please contact an administrator.");
                       setSessionDataTo = await AuthorizationService.logout();
                    }
                    else{
                        setSessionDataTo = sessionDataX;
                    }
                }
                else{
                    // If they are logged out but still somehow have player data, invalidate it.
                    if(playerData != {}){
                        setPlayerData({});
                    }
                    setSessionDataTo = sessionDataX;
                }
                setSessionData(setSessionDataTo)

                // Set loading to false to remove loading screen.
                if(loading){
                    setLoading(false);
                }
            }
            catch(error){
                console.log(error);
            }
        }
        // Fetch data first
        fetchData();
        // Then start an interval which happens every 10 seconds to refresh data.
        const id = setInterval(()=>{
            fetchData();
        },10000);
        // Cleanup function.
        return ()=>{
            clearInterval(id);
        }
    },[]);
    

    return(
        <>
        {(loading) ? (
        
        <Loading/>
        ) : (
        <UserContext.Provider value={
            { 
                sessionData,
                setSessionData,
                playerData,
                setPlayerData
            }}>
            {props.children}
        </UserContext.Provider>
        )
        }
        </>
    )
}
