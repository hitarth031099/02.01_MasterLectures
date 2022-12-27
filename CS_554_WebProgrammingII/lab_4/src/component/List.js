import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom';

import { Stack, Grid, Pagination } from '@mui/material';
import { Box, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';

const { data } = require('../utils/data');


export default function Characters() {
  const navigate = useNavigate();

  const category = useParams().category;
  const [page, setPage] = useState(parseInt(useParams().page));
  const [dataR, setDataR] = useState();
  const limit = 20;

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await data(`${category}?offset=${page * limit}&`);

        if (res.code === 200 && res.data.count !== 0) {
          setDataR(res.data);
        }
        else {
          navigate("/error", { state: { description: "Page is out range!" }, replace: true });
        }
      } catch (e) {
        navigate("/error", { state: { description: e }, replace: true });
      }
    }

    fetchData();

  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value - 1);
    navigate(`/${category}/page/${value - 1}`);
  };

  return (
    <div>

      <Grid item xs={2}>
        <Link to="/">Home</Link>
      </Grid>

      {!dataR ? null :
        <div>
          <h1>{category} List</h1>
          <Grid>
            <Grid container justifyContent="center">
              <Stack>
                <Pagination count={Math.ceil(dataR.total / dataR.limit)} page={page + 1} onChange={handlePageChange} color="primary" showFirstButton showLastButton />
              </Stack>

            </Grid>
            <Grid container justifyContent="center">
              <Box sx={{ width: '100%', maxWidth: 400, color: 'error.main', border: 1 }} >
                <nav aria-label="secondary mailbox folders">
                  <List>
                    {dataR.results.map((ele) => {
                      return (
                        <div key={ele.id}>
                          <ListItem disablePadding>
                            <ListItemButton component="a" href={`/${category}/` + ele.id}>
                              <ListItemText primary={ele.name || ele.title} />
                            </ListItemButton>
                          </ListItem>
                          <Divider />
                        </div>
                      )
                    })}
                  </List>
                </nav>
              </Box>
            </Grid>
          </Grid>

        </div>
      }

    </div>

  )
}
