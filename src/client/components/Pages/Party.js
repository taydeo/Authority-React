import React, { useState, useEffect } from "react";
import { useParams, withRouter } from "react-router";
import Body from "../Structure/Body";

function Party() {
  var [partyID, setPartyID] = useState(null);
  var { partyId: requestedPartyId } = useParams();

  useEffect(() => {
    console.log(requestedPartyId);
    if (requestedPartyId === undefined) {
      setPartyID("help");
    }
  }, [requestedPartyId]);

  return (
    <>
      <Body>{partyID}</Body>
    </>
  );
}
export default withRouter(Party);
