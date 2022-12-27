import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Grid } from '@mui/material';

const { data } = require('../utils/data');

export default function Character() {
  const navigate = useNavigate();

  const id = useParams().id;
  const category = useParams().category;
  const [details, setDetails] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await data(`${category}/${id}?`);

        if (res.code === 200) {
          setDetails(res.data.results[0]);
        }
      } catch (e) {
        navigate("/error", { state: { description: category + " not found!" }, replace: true });
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <Grid item xs={2}>
        <Link to="/">Home</Link>
      </Grid>

      <h1>{category} Details</h1>
      <div>{category} ID:{id}</div>
      <div>{!details ? null : (details.name ? category + " Name: " + details.name : category + " Title: " + details.title)}</div>
    </div>
  )
}
