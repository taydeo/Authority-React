import React, { useState, useEffect, useContext } from "react";
import { useParams, withRouter } from "react-router";
import { AlertContext } from "../../context/AlertContext";
import PartyInfoService from "../../service/PartyService";
import Body from "../Structure/Body";
import ClipLoader from "react-spinners/ClipLoader";
import { UserContext } from "../../context/UserContext";

function Party(props) {
  var [partyID, setPartyID] = useState(null);
  var [partyInfo, setPartyInfo] = useState({});
  var [partyLoading, setLoading] = useState(true);
  var [partyMode, setPartyMode] = useState("overview");
  var { partyId: requestedPartyId, mode } = useParams();
  const { setAlert } = useContext(AlertContext);
  const { sessionData, playerData } = useContext(UserContext);

  useEffect(() => {
    async function fetchData() {
      console.log(requestedPartyId);
      if (requestedPartyId === undefined) {
        setAlert("Party ID not provided.");
        props.history.push("/");
      } else {
        setPartyID(requestedPartyId);
        var info = await PartyInfoService.fetchPartyById(requestedPartyId);
        if (info.hasOwnProperty("error")) {
          setAlert("Party not found.");
          props.history.push("/");
        } else {
          setPartyInfo(info);
          console.log(info);
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [requestedPartyId]);

  return (
    <Body middleColWidth="11">
      {!partyLoading ? (
        <>
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
              <button className='btn btn-primary partyButton'>Members</button>
              
              <button className='btn btn-primary partyButton'>Overview</button>
              
              <button className='btn btn-primary partyButton'>Party Committee</button>
            </div>
          </div>

        </>
      ) : (
        <>
          <br />
          <ClipLoader />
        </>
      )}
    </Body>
  );
}
export default withRouter(Party);
