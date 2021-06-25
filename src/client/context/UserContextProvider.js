import React, { useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import AuthorizationService from '../service/AuthService';
import Loading from '../components/Misc/Loading';

export default function ContextProvider(props){
    const [sessionData, setSessionData] = useState({});
    const [playerData, setPlayerData] = useState({});
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async ()=>{
            try{
                const sessionDataX = await AuthorizationService.getSessionData();
                // IF they are logged in
                if(sessionDataX.loggedIn){
                    var playerDataX = await AuthorizationService.getLoggedInData();
                    // If they are logged in...but their player doesn't exist?
                    if(playerDataX.error){
                        // Unset player data.
                        setPlayerData({});
                    }
                    else{
                        setPlayerData(playerDataX);
                    }
                }
                // If they ARE logged in, and player doesn't exist.
                if(sessionDataX.loggedIn && playerDataX.error){
                    // Log them out :)
                    setSessionData(await AuthorizationService.logout());
                }
                else{
                    setSessionData(sessionDataX);
                }
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
