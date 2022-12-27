const express = require('express');
const app = express();
const http = require('http');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/front/chat.html');
});

server.listen(4000, () => {
  console.log('listening on *:4000');
});