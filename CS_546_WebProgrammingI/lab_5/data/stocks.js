const axios = require("axios");
const path = 'https://gist.githubusercontent.com/graffixnyc/8c363d85e61863ac044097c0d199dbcc/raw/7d79752a9342ac97e4953bce23db0388a39642bf/stocks.json'


module.exports = {
    getStocksById,
    getAllStocks
}

async function getStocksData() {
    const { data } = await axios.get(path);
    return data;
}

async function getStocksById(id) {

    let stocksData = await getStocksData();

    for (let i = 0; i < stocksData.length; i++) {
        if (stocksData[i].id == id) {
            return stocksData[i];
        }
    }
    throw "Stock not found Error";
}

async function getAllStocks() {
    return await getStocksData();
}