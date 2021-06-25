import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import AuthorizationService from '../../service/AuthService'
import Body from '../Structure/Body'
import NumberFormat from 'react-number-format'
import { withRouter } from 'react-router'
import { timeAgoString } from '../../../server/classes/User/Method'
import '../../css/profile.css';
import ClipLoader from "react-spinners/ClipLoader";
import { LinkContainer } from 'react-router-bootstrap'
import { AlertContext } from '../../context/AlertContext';
import { UserContext } from '../../context/UserContext'
import { getPositionName, selectColor } from '../../../server/classes/Misc/Methods'
import renderHTML from 'react-render-html';
import MarkdownPreview from '@uiw/react-markdown-preview';

function Politician(props){
    var { sessionData } = useContext(UserContext);
    var [politicianInfo, setPoliticianInfo] = useState({});
    var [loggedInUserIsUser, setLoggedInUserIsUser] = useState(false);
    var [loading, setLoading] = useState(true);
    var { userId } = useParams();

    var { setAlert } = useContext(AlertContext);
    

    useEffect(()=>{
        async function fetchData(){
            var requestedUserInfo = {};
            var userExists = false;
            var sessionData = await AuthorizationService.getSessionData();
            // If the URL has no politician ID 
            if(props.noRequestId){
                // If they're logged in, then just send them their own page.
                if(sessionData.loggedIn){
                    requestedUserInfo = await AuthorizationService.getUserData(sessionData.loggedInId,true,true);
                    // User exists if requested data exists.
                    userExists = !(requestedUserInfo == undefined)
                }
                // If they're not, don't worry. There's a check later on.
            }
            else{      
                // If they requested a specific ID, then get that politician.     (true, true requests additional state/party info.)      
                requestedUserInfo = await AuthorizationService.getUserData(userId,true,true);
                // User exists if requested data exists.
                userExists = !(requestedUserInfo == undefined || requestedUserInfo == "404")
            }
            // If user doesn't exist
            if(!userExists){
                // If they are logged in, send them to their own page.
                if(sessionData.loggedIn){ 
                    props.history.push(`/politician`); 
                    setAlert("Politician not found.");
                }
                // If they aren't, then send them to the index and spit out an alert.
                else{ 
                    props.history.push(`/`) 
                    setAlert("Politician not found.");
                };
            }
            // If they do, then update the state and title. Remove loading screen.
            else{
                setPoliticianInfo(requestedUserInfo);
                if(sessionData.loggedInId == requestedUserInfo.id){ setLoggedInUserIsUser(true); }
                setLoading(false);
                document.title = requestedUserInfo.politicianName + " | AUTHORITY"
            }
        }
        fetchData();
        // Update if ID changes, or if current user logs out.
    },[props.match.params.userId, sessionData.loggedIn])
    return(
        <Body middleColWidth='7'>
            {(!loading) ? (
            <>
            <br/>
            <h2>{politicianInfo.politicianName}</h2>
            <div className="mainProfileContainer">

                <img className="profilePicture" src={politicianInfo.profilePic} alt="Profile Picture"/>

                {
                (!loggedInUserIsUser) ? (
                <div className='lastOnline'>
                    {timeAgoString(politicianInfo.lastOnline)}
                </div>) : (<></>)
                }

                <hr/>
                <h4>Biography and Details</h4>
                <pre className="bioBox" style={{padding:'10px',maxHeight:"25vh",overflow:"auto",backgroundColor:'rgba(240,240,240,0.77)'}}>
                    <MarkdownPreview
                    style={{margin:'3px',fontFamily:"Bahnschrift"}}
                    source={politicianInfo.bio}/>
                </pre>
                <hr/>
            </div>
            <table className="table table-striped table-bordered" id='statsTable'>
                <tbody>
                    <tr>
                        <td>Authority</td>
                        <td>{politicianInfo.authority}</td>
                    </tr>
                    <tr>
                        <td>Campaign Funding</td>
                        <td>
                            $<span className='greenFont'><NumberFormat thousandSeparator={true} displayType={'text'} value={politicianInfo.campaignFinance}/></span>
                        </td>
                    </tr>
                    <tr>
                        <td>State Influence</td>
                        <td>{politicianInfo.hsi}%</td>
                    </tr>
                    {(politicianInfo.party != 0) ? (
                    <tr>
                        <td>Political Party</td>
                        <td>
                            <LinkContainer to={`/party/${politicianInfo.partyInfo.id}`}>
                                <a href='#'>{politicianInfo.partyInfo.name}</a>
                            </LinkContainer>
                        </td>
                    </tr>
                    ):(<></>)}
                    <tr>
                        <td>Region</td>    
                        <td>
                            <LinkContainer to={`/state/${politicianInfo.stateInfo.name}`}>
                                <a href='#'>
                                    <img className='profileStateFlag' src={politicianInfo.stateInfo.flag}/>
                                    {politicianInfo.stateInfo.name}
                                </a>
                            </LinkContainer>
                        </td>
                    </tr>  
                    <tr>
                        <td>Economic Positions</td>
                        <td>
                        <span style={{color:selectColor(['blue','#101010','red'], politicianInfo.ecoPos)}}>
                            {renderHTML(getPositionName("economic",politicianInfo.ecoPos))} ({politicianInfo.ecoPos})
                        </span>
                        </td>
                    </tr>
                    <tr>
                        <td>Social Positions</td>
                        <td>
                        <span style={{color:selectColor(['blue','#101010','red'], politicianInfo.socPos)}}>
                            {renderHTML(getPositionName("social",politicianInfo.socPos))} ({politicianInfo.socPos})
                        </span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br/>
            </>
            ) : (<><br/><ClipLoader/></>)}
        </Body>
    )
}

export default withRouter(Politician);