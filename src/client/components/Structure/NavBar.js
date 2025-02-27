import React, { useContext } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { userHasPerm } from "../../../server/classes/Party/Methods";
import AuthorizationService from "../../service/AuthService";
import { LinkContainer } from "react-router-bootstrap";
import { UserContext } from "../../context/UserContext.js";

function NavBar(props) {
  const { sessionData, setSessionData, playerData } = useContext(UserContext);

  const logout = function () {
    var newSessionData = AuthorizationService.logout();
    setSessionData(newSessionData);
    props.history.push("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a href="/" className="navbar-brand" style={{ marginLeft: "15px" }}>
          <b>
            AUTHORITY<small>It's Not POWER, I Swear!</small>
          </b>
        </a>
        <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#myNavbar" aria-expanded="true">
          <span className="sr-only"></span>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="myNavbar">
            <ul className="nav navbar-nav navbar-right">
              {sessionData.loggedIn ? (
                <>
                  <li className="dropdown">
                    <a className="nav-link dropdown-toggle" id="navBarDrop" role="button" data-toggle="dropdown" aria-expanded="false">
                      <i className="fas fa-user" aria-hidden="true"></i> {playerData.politicianName}
                    </a>
                    <ul className="dropdown-menu">
                      <LinkContainer to="/politician">
                        <a className="dropdown-item" href="#">
                          Profile
                        </a>
                      </LinkContainer>
                      <LinkContainer to={"/editprofile"}>
                        <a className="dropdown-item" href="#">
                          Edit Profile
                        </a>
                      </LinkContainer>
                      <a className="dropdown-item" href="#" onClick={logout}>
                        Logout
                      </a>
                    </ul>
                  </li>
                  <li className="dropdown">
                    <a className="nav-link dropdown-toggle" id="navBarDrop" role="button" data-toggle="dropdown" aria-expanded="false">
                      <i className="fas fa-flag" aria-hidden="true"></i> {playerData.nation}
                    </a>
                    <ul className="dropdown-menu">
                      <a className="dropdown-item" href={"/politicalparties/" + playerData.nation}>
                        Political Parties
                      </a>
                    </ul>
                  </li>
                  {playerData?.partyInfo ? (
                    <li className="dropdown">
                      <a className="nav-link dropdown-toggle" id="navBarDrop" role="button" data-toggle="dropdown" aria-expanded="false">
                        <i className="fas fa-handshake" aria-hidden="true"></i> {playerData.partyInfo.name}
                      </a>
                      <ul className="dropdown-menu">
                        <LinkContainer to={`/party/${playerData.party}/overview`}>
                          <a className="dropdown-item">Overview</a>
                        </LinkContainer>
                        <LinkContainer to={`/party/${playerData.party}/members`}>
                          <a className="dropdown-item">Members</a>
                        </LinkContainer>
                        {userHasPerm(playerData.id, playerData.partyInfo, "sendFunds") || userHasPerm(playerData.id, playerData.partyInfo, "fundingReq") ? (
                          <a className="dropdown-item" href={"party/" + playerData.partyInfo.id + "/partyTreasury"}>
                            Party Treasury
                          </a>
                        ) : null}
                        {userHasPerm(playerData.id, playerData.partyInfo, "leader") ? (
                          <a className="dropdown-item" href={"party/" + playerData.partyInfo.id + "/partyControls"}>
                            Party Management
                          </a>
                        ) : null}
                      </ul>
                    </li>
                  ) : null}
                </>
              ) : (
                <Link to="/login" className="nav-link">
                  LOGIN
                </Link>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
export default withRouter(NavBar);
