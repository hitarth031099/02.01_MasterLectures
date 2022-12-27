const express = require('express');
const router = express.Router();
const data = require('../data');
const stocksData = data.stocks;

router.get('/:id', async (req, res) => {
    try {
        const post = await stocksData.getStocksById(req.params.id);
        res.json(post);
    } catch (e) {
        res.status(404).json({ message: 'Stock not found' });
    }
});

router.get('/', async (req, res) => {
    try {
        const postList = await stocksData.getAllStocks();
        res.json(postList);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
