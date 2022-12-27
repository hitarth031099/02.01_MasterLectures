const express = require('express');
const router = express.Router();

const connection = require("../config/connection");

router.post("/", async (req, res) => {
    let searchTerm = req.body.searchTerm;

    try {
        if (!searchTerm) throw "please input";
        searchTerm = searchTerm.trim();
        if (!searchTerm) throw "please not input all space";
    } catch (error) {
        res.render("search/found", { "haserror": true, "error": error });
        res.status(400);
        return;
    }

    try {
        const data = await connection.getData("nameStartsWith", searchTerm);

        const posts = data.data.results.slice(0, 20);

        if (posts.length == 0) throw "character name not find.";

        res.render("search/found", { "title": "Characters Found", "searchTerm": searchTerm, "posts": posts });
    } catch (error) {
        res.render("search/found", { "haserror": true, "error": error });
        res.status(404);
    }

});

module.exports = router;

// the label should properly reference the same id as the input.