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
import { UserContext } from '../../context/UserContext'
import { getPositionName, selectColor } from '../../../server/classes/Misc/Methods'

function Politician(props){
    var [politicianInfo, setPoliticianInfo] = useState({});
    var [loggedInUserIsUser, setLoggedInUserIsUser] = useState(false);
    var [loading, setLoading] = useState(true);
    var { userId } = useParams();
    var { setAlert } = useContext(UserContext);
    

    useEffect(()=>{
        async function fetchData(){
            var requestedUserInfo = {};
            var userExists = false;
            var sessionData = await AuthorizationService.getSessionData();
            if(props.noRequestId){
                if(sessionData.loggedIn){
                    requestedUserInfo = await AuthorizationService.getUserData(sessionData.loggedInId,true,true);
                    userExists = !(requestedUserInfo == undefined)
                }
            }
            else{            
                requestedUserInfo = await AuthorizationService.getUserData(userId,true,true);
                userExists = !(requestedUserInfo == undefined || requestedUserInfo == "404")
            }
            if(!userExists){
                if(sessionData.loggedIn){ 
                    props.history.push(`/politician`); 
                    setAlert("Politician not found.");
                }
                else{ 
                    props.history.push(`/`) 
                    setAlert("Politician not found.");
                };
            }
            else{
                setPoliticianInfo(requestedUserInfo);
                if(sessionData.loggedInId == requestedUserInfo.id){ setLoggedInUserIsUser(true); }
                setLoading(false);
                document.title = requestedUserInfo.politicianName + " | AUTHORITY"
            }
        }
        fetchData();
    },[])

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

                <pre className="bioBox">
                    {politicianInfo.bio}
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
                                <a href='#'>{politicianInfo.stateInfo.name}</a>
                            </LinkContainer>
                        </td>
                    </tr>  
                    <tr>
                        <td>Economic Positions</td>
                        <td>
                        <span style={{color:selectColor(['blue','#101010','red'], politicianInfo.ecoPos)}}>
                            {getPositionName("economic",politicianInfo.ecoPos)} ({politicianInfo.ecoPos})
                        </span>
                        </td>
                    </tr>
                    <tr>
                        <td>Social Positions</td>
                        <td>
                        <span style={{color:selectColor(['blue','#101010','red'], politicianInfo.socPos)}}>
                            {getPositionName("social",politicianInfo.socPos)} ({politicianInfo.socPos})
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