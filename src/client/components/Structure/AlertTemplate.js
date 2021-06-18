import React from 'react';

export default function AlertTemplate({ style, options, message, close }){
    return (
    <div className="alert alert-danger" style={style}>
      <b>{message}</b>
    </div>
    )
}
  