import React from 'react';
import './App.css';

function Child(props) {
  return (
    <div>
      <p>{props.greeting} TEST</p>
    </div>
  );
}

export default Child;
