const express = require('express');
const app = express();
const redis = require("redis");

const { getById } = require('./data/index');

const client = redis.createClient();

app.get('/api/people/history', async function (req, res) {
    await client.connect();
    let history = JSON.parse(await client.get("history"));
    res.status(200).json(history);
    await client.disconnect();
});

app.get('/api/people/:id', async function (req, res) {
    let id = req.params.id;
    if (id === undefined) throw "id not valid";

    if (typeof (id) == "string") {
        id = id.trim();
        if (id.length == 0) throw "id not valid";

        if (! /^[0-9]+$/.test(id)) throw "id not valid";
        id = Number.parseInt(id);
    }

    await client.connect();
    let user = JSON.parse(await client.get(id));
    if (!user) {
        user = await getById(id);
        await client.set(id,JSON.stringify(user));
    }

    let history = JSON.parse(await client.get("history"));
    if (history == null) {
        history = [];
    }
    history.unshift(user);
    history.length = Math.min(history.length, 20);
    await client.set("history", JSON.stringify(history))
    res.status(200).json(user);
    await client.disconnect();
});

app.use('*', (req, res) => {
    res.status(404).json({ error: 'Page Not found' });
});

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
