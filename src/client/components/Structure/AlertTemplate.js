import React, { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../context/AlertContext.js";
import "../../css/alert.css";

function AlertTemplate({ style, options, message, close }) {
  const { alertType } = useContext(AlertContext);

  var [alertTemplateType, setAlertTemplateType] = useState(null);

  useEffect(() => {
    setAlertTemplateType(alertType);
  }, []);

  return (
    <div className="alertContainer">
      {alertTemplateType == "success" ? (
        <div className="notice notice-success">
          <strong>Success</strong> | {message}
        </div>
      ) : (
        <></>
      )}
      {alertTemplateType == "error" ? (
        <div className="notice notice-danger">
          <strong>Error</strong> | {message}
        </div>
      ) : (
        <></>
      )}
      {alertTemplateType == "info" ? (
        <div className="notice notice-info">
          <strong>Info</strong> | {message}
        </div>
      ) : (
        <></>
      )}
      {alertTemplateType == "warning" ? (
        <div className="notice notice-danger">
          <strong>Warning</strong> | {message}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default React.memo(AlertTemplate);
