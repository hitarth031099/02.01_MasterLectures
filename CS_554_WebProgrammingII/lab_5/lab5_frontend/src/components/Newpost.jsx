import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import queries from './queries';

export default function Newpost() {

  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [posterName, setPosterName] = useState("");

  const [upload] = useMutation(queries['uploadImage']);

  const create = (e) => {
    e.preventDefault();

    const errors = [];
    if (check(url, "url") === false) errors.push("url is not vaild! please input https prefix");
    if (check(description, "description") === false) errors.push("description is not vaild!");
    if (check(posterName, "posterName") === false) errors.push("posterName is not vaild!");

    if (errors.length != 0) {
      alert(errors);
      return;
    }

    const args = {
      url: url,
      description: description,
      posterName: posterName
    }
    try {
      upload({ variables: args });
    } catch (error) {
      alert(error);
    }
    alert("create successfully! You can go to My posts page!");
  }

  return (
    <Box>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid container item xs={12} alignItems="center" justifyContent="center"><h1>New Post</h1></Grid>
        <Stack spacing={2} component="form" onSubmit={create}>
          <TextField id="url" label="url" variant="outlined" value={url} onChange={e => setUrl(e.target.value)} />
          <TextField id="description" label="description" variant="outlined" value={description} onChange={e => setDescription(e.target.value)} />
          <TextField id="posterName" label="posterName" variant="outlined" value={posterName} onChange={e => setPosterName(e.target.value)} />
          <Button type="submit">Create</Button>
        </Stack>
      </Grid>
    </Box>
  )
}

function check(input, type) {
  switch (type) {
    case "url":
      if (input == undefined) return false;
      if (typeof (input) !== "string") return false;
      input = input.trim();
      input = input.toLowerCase();
      if (input.length === 0) return false;
      if (!/^https/.test(input)) return false;
      return input;
    case "description":
      if (input == undefined) return false;
      if (typeof (input) !== "string") return false;
      input = input.trim();
      input = input.toLowerCase();
      if (input.length === 0) return false;
      return input;
    case 'posterName':
      if (input == undefined) return false;
      if (typeof (input) !== "string") return false;
      input = input.trim();
      input = input.toLowerCase();
      if (input.length === 0) return false;
      return input;
  }
}