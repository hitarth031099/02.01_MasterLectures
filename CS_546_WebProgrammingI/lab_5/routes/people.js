const express = require('express');
const router = express.Router();
const data = require('../data');
const peopleData = data.people;

router.get('/:id', async (req, res) => {
    try {
        const post = await peopleData.getPeopleById(req.params.id);
        res.json(post);
    } catch (e) {
        res.status(404).json({ message: 'People not found' });
    }
});

router.get('/', async (req, res) => {
    try {
        const postList = await peopleData.getAllPeople();
        res.json(postList);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
