import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import axios from 'axios';

import { Stack, Pagination } from '@mui/material';
import { Box, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import TrainersContext from './TrainersContext';

export default function PokemonList() {
  const navigate = useNavigate();

  const [pagenum, setPagenum] = useState(useParams().pagenum);
  const [pokeData, setPokeData] = useState();


  const [curTrain, setCurTrain, tras, setTras] = useContext(TrainersContext);

  useEffect(() => {

    async function fetchData() {
      try {
        setPagenum(check(pagenum,"pagenum"));
        setPokeData((await axios.get(`/api/pokemon/page/${pagenum}`)).data);
      } catch (e) {
        navigate("/error");
      }
    }

    fetchData();

  }, [pagenum]);

  const handlePageChange = (event, value) => {
    setPagenum(value);
    navigate(`/pokemon/page/${value}`);
  };

  function catchPoke(poke) {
    if (tras[curTrain].length == 6) {
      alert("One trainer only has 6 pokemon at most!");
      return;
    }
    setTras({ ...tras, [curTrain]: [...tras[curTrain], poke] });
  }

  function releasePoke(poke) {
    setTras({ ...tras, [curTrain]: [...tras[curTrain]].filter((ele) => { return ele.id != poke.id }) });
  }

  return (
    <div>
      <h1>PokemonList</h1>
      {!pokeData ? null :
        <div>
          <Grid>
            <Grid container justifyContent="center">
              <Stack>
                <Pagination count={Math.ceil(pokeData.count / 20)} page={pagenum} onChange={handlePageChange} color="primary" showFirstButton showLastButton />
              </Stack>
            </Grid>


            <Box sx={{ width: '100%', color: 'error.main' }} >
              <Grid container justifyContent="center" spacing={1}>
                {pokeData.results.map((ele) => {
                  return (
                    <Grid item xs={3} key={ele.id} >
                      <Card>
                        <Link to={`/pokemon/${ele.id}`}>
                          <CardMedia
                            component="img"
                            height="250"
                            image={ele.img ? ele.img : notFound}
                            alt={ele.name}
                          />
                          <CardContent>
                            <Typography variant="body2" color="text.secondary">
                              {ele.name}
                            </Typography>
                          </CardContent>
                        </Link>
                        <CardActions>
                          {
                            curTrain === "" ? "Please choose a trainer first" :
                              (
                                tras[curTrain].map(item => item.id).includes(ele.id) ?
                                  <Button size="standard" onClick={() => { releasePoke(ele) }}>Release</Button>
                                  :
                                  <Button size="standard" onClick={() => { catchPoke(ele) }}>Catch</Button>
                              )
                          }

                        </CardActions>
                      </Card>
                    </Grid >
                  )
                })}
              </Grid>
            </Box>

          </Grid>
        </div>
      }
    </div>
  )
}

function check(input, type) {
  switch (type) {
    case "pagenum":
      if (!input) throw type + " not valid";
      if (isNaN(input)) throw type + " not valid";
      input = parseInt(input);
      if (input <= 0) throw type + " not valid";
      return input;
    case "id":
      if (!input) throw type + " not valid";
      if (isNaN(input)) throw type + " not valid";
      input = parseInt(input);
      if (input <= 0) throw type + " not valid";
      return input;
    default:
      return false;
  }
}