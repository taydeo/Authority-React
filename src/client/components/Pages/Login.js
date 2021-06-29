import React, { useState, useContext, useEffect } from "react";
import Body from "../Structure/Body";
import AuthorizationService from "../../service/AuthService";
import { UserContext } from "../../context/UserContext";
import { AlertContext } from "../../context/AlertContext";
import { withRouter } from "react-router";

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { sessionData, setSessionData, setPlayerData } =
    useContext(UserContext);
  const { setAlert, setAlertType } = useContext(AlertContext);

  useEffect(() => {
    if (sessionData.loggedIn) {
      props.history.push("/politician/" + sessionData.loggedInId);
    }
  });

  var login = async function () {
    var body = { username: username, password: password };
    const response = await AuthorizationService.login(body);
    if (response.data.loggedIn) {
      setSessionData(response.data);
      var loggedInData = await AuthorizationService.getLoggedInData();
      setPlayerData(loggedInData);

      props.history.push("/politician/" + loggedInData.id);

      setAlert("Successfully logged in!");
      setAlertType("success");
    } else {
      setAlert("Incorrect details uwu");
      setAlertType("error");
    }
  };

  return (
    <Body middleColWidth="4">
      <br />
      <h2>Login</h2>
      <hr />
      <div className="tableForm">
        <form onSubmit={(e) => e.preventDefault()}>
          <table className="table table-striped table-responsive">
            <tbody>
              <tr>
                <td>
                  <b>Username</b>
                </td>
                <td>
                  <input
                    onInput={(e) => setUsername(e.target.value)}
                    type="text"
                    name="username"
                    className="form-control"
                    placeholder="Enter Username Here"
                    required=""
                    pattern="[^()/><\][\\\x22,;|]+"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <b>Password</b>
                </td>
                <td>
                  <input
                    onInput={(e) => setPassword(e.target.value)}
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter Password Here"
                    required=""
                    pattern="[^()/><\][\\\x22,;|]+"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <label>
            <input
              className="btn btn-primary"
              type="submit"
              value="Login"
              name="signIn"
              onClick={login}
            />
          </label>
        </form>
      </div>
    </Body>
  );
}
export default withRouter(Login);
