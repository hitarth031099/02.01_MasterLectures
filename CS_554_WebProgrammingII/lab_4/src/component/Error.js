import React from 'react';
import { useLocation, Link } from 'react-router-dom';;


export default function Error() {
  const location = useLocation();

  return (
    <div>
      <Link to="/">Home</Link>
      <h1>404 Error</h1>
      <div>{location.state.description}</div>
    </div>
    
  )
}
