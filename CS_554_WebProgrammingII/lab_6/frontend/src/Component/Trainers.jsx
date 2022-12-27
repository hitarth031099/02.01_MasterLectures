import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import TrainersContext from './TrainersContext';

export default function trainers() {
  const [curTrain, setCurTrain, tras, setTras] = useContext(TrainersContext);

  function creTra(e) {
    e.preventDefault();
    const value = document.getElementById('trainer').value.trim();
    if (value == "") {
      alert("input should not be empty!");
      return;
    }
    if (tras[value]) {
      alert(value + " has exist, please input another name!");
      document.getElementById('trainer').value = "";
    } else {
      setTras({ ...tras, [value]: [] });
    }
  }

  function releasePoke(trainer, id) {
    setTras({ ...tras, [trainer]: [...tras[trainer]].filter((ele) => {return ele.id != id }) });
  }

  return (
    <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center">
      <Box sx={{ width: 3 / 4 }} >
        <h1>Trainers</h1>
        <Grid container justifyContent="center" sx={{ m: 2 }} >
          <Box component="form" onSubmit={creTra}>
            <TextField id="trainer" label="trainer" variant="outlined" />
            <Button type="submit">Create</Button>
          </Box>
        </Grid>
        {
          Object.keys(tras).map(
            (key) => {
              return (
                <Grid container key={key} sx={{ border: 1 }}>
                  <Grid container alignItems="center">
                    <Grid item xs>
                      <Typography variable = "h3">{key}</Typography>
                    </Grid>
                    <Grid item xs>
                      {
                        curTrain != key ?
                          <Button onClick={() => { setCurTrain(key) }}>Choose</Button>
                          : <></>
                      }
                      <Button onClick={() => {
                        if (curTrain == key) {
                          setCurTrain("");
                        }
                        const temp = { ...tras };
                        delete temp[key];
                        setTras(temp);
                      }}>Delete</Button>
                    </Grid>
                  </Grid>



                  {tras[key].map(
                    (ele) => {
                      return (
                        <Grid item xs={2} key={ele.id} >
                          <Card>
                            <Link to={`/pokemon/${ele.id}`}>
                              <CardMedia
                                component="img"
                                height="250"
                                image={ele.img}
                                alt={ele.name}
                              />
                              <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                  {ele.name}

                                </Typography>
                              </CardContent>
                            </Link>
                            <CardActions>
                              <Button size="standard" onClick={() => { releasePoke(key, ele.id) }}>Release</Button>
                            </CardActions>
                          </Card>

                        </Grid >
                      );
                    }
                  )}
                </Grid>
              );
            }
          )
        }
      </Box>
    </Grid>

  )
}
