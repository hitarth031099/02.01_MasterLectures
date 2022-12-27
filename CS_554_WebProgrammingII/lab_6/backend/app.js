const express = require('express');
const app = express();
const axios = require('axios');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(__dirname + '/public/'));

app.get("/pokemon/page/:pagenum", async (req, res) => {

    try {
        const pagenum = check(req.params.pagenum, 'pagenum');

        const data = await getByPagenum(pagenum);

        res.status(200).json(data);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }

});

app.get("/pokemon/:id", async (req, res) => {
    try {
        const id = check(req.params.id, 'id');

        const data = await getByID(id);

        res.status(200).json(data);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


app.use('*', (req, res) => {
    res.status(404).json({ error: 'Page Not found' });
});

app.listen(4000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:4000');
});

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

async function getByPagenum(pagenum) {
    const url = `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${20 * (pagenum - 1)}`;
    const { data } = await axios.get(url);
    if (data.results.length === 0) throw "pagenum is out range";
    const postData = data;
    postData.results = postData.results.map(ele => {
        ele.url = ele.url.slice(0, -1);
        const id = ele.url.slice(ele.url.lastIndexOf('/') + 1, ele.url.length);
        ele.img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
        return { id: id, ...ele };
    });

    return postData;
}

async function getByID(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const { data } = await axios.get(url);
    const postData = {
        "id": data.id,
        "name": data.name,
        "img": data.sprites.other["official-artwork"].front_default,
    }
    return postData;
}