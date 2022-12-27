import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import ImaList from "./ImaList";
import queries from './queries';

export default function Mybin() {
  const [postData, setPostData] = useState({});

  const { data, error, fetchMore } = useQuery(queries["mybin"], {
  });

  useEffect(() => {
    if (data) {

      const temp = {};
      data.binnedImages.map(ele => {
        temp[ele.id] = ele;
      });
      setPostData(temp);
    }
  }, [data]);

  return (
    <Box>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid container item xs={12} alignItems="center" justifyContent="center"><h1>My Bin</h1></Grid>
        {postData != {} ?
          <ImaList postData={postData} />:
          <h1>loading</h1>
        }
      </Grid>
    </Box>
  );
}
