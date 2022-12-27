const express = require('express');
const app = express();

app.use(express.static(__dirname + '/static/'));

app.get('*', function (req, res) {
    res.sendFile(__dirname+'/static');
})

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
