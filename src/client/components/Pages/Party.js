import React, { useState, useEffect, useContext } from "react";
import { useParams, withRouter } from "react-router";
import { AlertContext } from "../../context/AlertContext";
import PartyInfoService from "../../service/PartyService";
import Body from "../Structure/Body";
import ClipLoader from "react-spinners/ClipLoader";
import { UserContext } from "../../context/UserContext";
import PartyOverview from "./PartyModes/PartyOverview";

function Party(props) {
  var [partyID, setPartyID] = useState(null);
  var [partyInfo, setPartyInfo] = useState({});
  var [partyLoading, setLoading] = useState(true);
  var [partyMode, setPartyMode] = useState("overview");
  var { partyId: requestedPartyId, mode } = useParams();
  const { setAlert } = useContext(AlertContext);
  const { sessionData, playerData } = useContext(UserContext);

  useEffect(() => {
    console.debug(requestedPartyId,mode);
    async function fetchData() {
      if(mode != "overview" && mode != "treasury" && mode != "management" && mode != "committee" && mode != "members"){
        setPartyMode("overview")
      }
      else{
        setPartyMode(mode);
      }

      // For some reason, they don't provide a party ID.
      if (requestedPartyId === undefined) {
        setAlert("Party ID not provided.");
        props.history.push("/");
      } else {
        setPartyID(requestedPartyId);
        var info = await PartyInfoService.fetchPartyById(requestedPartyId);
        // Fetching party returns error
        if (info.hasOwnProperty("error")) {
          setAlert("Party not found.");
          // Redirect to index. Because I'm lazy.
          props.history.push("/");
        } else {
          setPartyInfo(info);
        }
      }
      // Set loading to false to remove loading screen.
      setLoading(false);
    }
    fetchData();

    return function cleanup(){
      setLoading(true);
    }

  }, [requestedPartyId, mode]);

  if(partyLoading){
    return(<Body middleColWidth='11'><ClipLoader/></Body>)
  }
  else{
    return (
      <Body middleColWidth="11">
        <br />
        <h2>{partyInfo.name}</h2>

        <img
          style={{ maxWidth: "150px", maxHeight: "150px" }}
          src={"https://www.europeanperil.com/authority/"+partyInfo.partyPic}
        />
        <br/>

        {/* If they are logged in and are in the same party. */}
        {sessionData.loggedIn && playerData.party == partyInfo.id ? (
          <>
            <div style={{marginTop:"8px"}} className="row justify-content-center">
              <div className="col-md-4">
                <button className="btn btn-danger">
                  Leave Party (Lose 50% HSI)
                </button>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
        <hr/>
        {/* Party Modes */}
        <div className='row justify-content-center'>
          <div className='col'>
            <button className={'btn btn-primary partyButton' + ((partyMode=="members") ? " active" : "")} onClick={()=>{setPartyMode('members')}}>Members</button>
            
            <button className={'btn btn-primary partyButton' + ((partyMode=="overview") ? " active" : "")} onClick={()=>{setPartyMode('overview')}}>Overview</button>
            
            <button className={'btn btn-primary partyButton' + ((partyMode=="partyCommittee") ? " active" : "")} onClick={()=>{setPartyMode('partyCommittee')}}>Party Committee</button>
          </div>
        </div>
        <hr/>

        {/*Roles*/}
        {(partyMode == "overview") && <PartyOverview partyInfo={partyInfo}/>}
        
      </Body>
    );
  }
}
export default withRouter(Party);
