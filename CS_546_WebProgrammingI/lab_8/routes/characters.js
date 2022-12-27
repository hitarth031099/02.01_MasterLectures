const express = require('express');
const router = express.Router();

const connection = require("../config/connection");

router.get('/:id', async (req, res) => {

    const id = req.params.id;

    try {
        const data = await connection.getData("id", id);

        const posts = data.data.results[0];
        res.render("search/details", {
            "title": posts.name,
            "image": posts.thumbnail.path + '.' + posts.thumbnail.extension,
            "desciption": posts.desciption,
            "comics": posts.comics.items
        });
    } catch (error) {
        res.render("search/details", { "haserror": true, "error": "no character has this id" });
        res.status(404);
    }

});


module.exports = router;
