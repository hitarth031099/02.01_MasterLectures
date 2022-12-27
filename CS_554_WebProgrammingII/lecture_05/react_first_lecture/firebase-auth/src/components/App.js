import React from 'react';
import '../App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Account from './Account';
import ChangePassword from './ChangePassword';
import ForgotPassword from './ForgotPassword';
import Home from './Home';
import Landing from './Landing';
import Navigation from './Navigation';
import SignIn from './SignIn';
import SignUp from './SignUp';

function App() {
  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <Navigation />
        </header>
      </div>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='home' element={<Home />} />
        <Route path='account' element={<Account />} />
        <Route path='signin' element={<SignIn />} />
        <Route path='signup' element={<SignUp />} />
        <Route path='changepassword' element={<ChangePassword />} />
        <Route path='forgotpassword' element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
