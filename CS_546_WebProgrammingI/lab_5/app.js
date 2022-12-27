const express = require('express');
const app = express();
const configRoutes = require('./routes');

const router = express.Router();

// router.get('/123', async (req, res) => {
//     res.status(200).json({"message":"123"})
// });

// router.get('/456', async (req, res) => {
//     res.status(200).json({"message":"456"})
// });

// app.use('/any', router);

app.get("/any/123",async (req, res) => {
    res.status(200).json({"message":"bbb"})
});

app.get("/any/:num",async (req, res) => {
    res.status(200).json({"message":"aaa"})
});



configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
