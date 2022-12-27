import { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Routes, Route, NavLink, useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';

import Home from './components/Home';
import Mybin from './components/Mybin';
import Myposts from './components/Myposts';
import Newpost from './components/Newpost';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:10000'
  })
});

function App() {

  return (
    <ApolloProvider client={client}>
      <BrowserRouter forceRefresh>
        <AppBar position="static">
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={3} container direction="column" alignItems="center">
                <NavLink className='navlink' to='/'>
                  <Button color="warning">Home</Button>
                </NavLink>
              </Grid>
              <Grid item xs={3} container direction="column" alignItems="center">
                <NavLink className='navlink' to='/my-bin'>
                  <Button color="warning">My Bin</Button>
                </NavLink>
              </Grid>
              <Grid item xs={3} container direction="column" alignItems="center">
                <NavLink className='navlink' to='/my-posts'>
                  <Button color="warning">My Posts</Button>
                </NavLink>
              </Grid>
              <Grid item xs={3} container direction="column" alignItems="center">
                <NavLink className='navlink' to='/new-post'>
                  <Button color="warning">New Post</Button>
                </NavLink>
              </Grid>
            </Grid>
          </Box>
        </AppBar>

        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/my-bin' element={<Mybin />} />
          <Route path='/my-posts' element={<Myposts />} />
          <Route path='/new-post/' element={<Newpost />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App
