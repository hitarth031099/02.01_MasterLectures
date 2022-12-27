const axios = require('axios');
const setting = require('./setting');

module.exports = {
    getData
}

async function getData(parameter, value) {
    const url = setting.getUrl("characters");

    const path = url + (parameter ? (value ? "&" + parameter + "=" + value : "") : "");

    const {data} = await axios.get(path);
    return data;
}