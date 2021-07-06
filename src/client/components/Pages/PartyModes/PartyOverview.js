import React, { useState, useEffect } from 'react';
import { getLeaderInfo, generateRoleList } from '../../../../server/classes/Party/Methods';
import { LinkContainer } from 'react-router-bootstrap';
import AuthorizationService from '../../../service/AuthService';
import { SyncLoader } from 'react-spinners';
import forEach from 'async-foreach';
import PartyInfoService from '../../../service/PartyService';

const PartyOverview = React.memo(props=>{
    let [partyInfo, setPartyInfo] = useState(props.partyInfo);
    let [leader, setLeader] = useState({});
    let [partyRoles, setPartyRoles] = useState();
    let [loading, setLoading] = useState({});


    useEffect(()=>{
        setPartyInfo(props.partyInfo);
        async function fetchData(){
            var leaderJSON = {
                title:null,
                id:null,
                name:null,
                picture:null
            }
            // Leader //
            leaderJSON.title = getLeaderInfo(partyInfo,"title");
            leaderJSON.id = getLeaderInfo(partyInfo,"id");
            var leaderinfo = await AuthorizationService.getUserData(leaderJSON.id);
            leaderJSON.name = leaderinfo.politicianName;
            leaderJSON.picture = leaderinfo.profilePic
            setLeader(leaderJSON);  
    
            // Roles // 
            var reqPartyRoles = await PartyInfoService.fetchRoleList(partyInfo.id);
            setPartyRoles(reqPartyRoles);
            setLoading(false);
        }
        fetchData();
        return function cleanup(){
            setLoading(true);
        }
    },[props])
    
    if(loading){
        return(<><SyncLoader/></>)
    }

    return (
        <>
            <h3>
                {leader.title}
            </h3>
            <LinkContainer to={'/politician/'+leader.id}>
                <a>
                    <img style={{maxWidth:'120px', maxHeight:'120px', border:'4px ridge yellow'}} src={leader.picture}/>
                    <br/>
                    {leader.name}
                </a>
            </LinkContainer>
            <hr/>
            <div className="row justify-content-center">
            {
                partyRoles && partyRoles.map((role,i)=>
                    <div key={i} className="col-sm-3" style={{marginTop:"8px"}}>
                        <span>{role.roleName}</span>
                        <br/>
                        <LinkContainer to={"/politician/" + role.occupant}>
                            <a>
                                <img style={{maxWidth:"80px",height:"75px",border:"5px ridge darkgrey"}} src={role.occupantPicture}/>
                                <p>{role.occupantName}</p>
                            </a>
                        </LinkContainer>
                    </div>
                )

            }
            </div>
        </>

    )
});

export default PartyOverview;