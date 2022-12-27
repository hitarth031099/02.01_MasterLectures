import React, { useState } from 'react'
import './App.css'

import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';

import Home from './Component/Home';
import PokemonList from './Component/PokemonList';
import Detail from './Component/Detail';
import Trainers from './Component/Trainers';
import Error from './Component/Error';

import TrainersContext from './Component/TrainersContext';

function App() {

  const [curTrain, setCurTrain] = useState("");
  const [tras, setTras] = useState({});

  return (
    <div className="App">
      <TrainersContext.Provider value={[curTrain, setCurTrain, tras, setTras]}>
        <BrowserRouter>
          <AppBar position="static">
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={4} container direction="column" alignItems="center">
                  <NavLink className='navlink' to='/'>
                    <Button color="warning">Home</Button>
                  </NavLink>
                </Grid>
                <Grid item xs={4} container direction="column" alignItems="center">
                  <NavLink className='navlink' to='/pokemon/page/1'>
                    <Button color="warning">Pokemon List</Button>
                  </NavLink>
                </Grid>
                <Grid item xs={4} container direction="column" alignItems="center">
                  <NavLink className='navlink' to='/trainers'>
                    <Button color="warning">Trainers</Button>
                  </NavLink>
                </Grid>
              </Grid>
            </Box>
          </AppBar>

          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route path='/pokemon/page/:pagenum' element={<PokemonList />} />
            <Route path='/pokemon/:id' element={<Detail />} />
            <Route path='/trainers' element={<Trainers />} />
            <Route path='/error' element={<Error />} />
          </Routes>
        </BrowserRouter>
      </TrainersContext.Provider>

    </div>
  )
}

export default App
