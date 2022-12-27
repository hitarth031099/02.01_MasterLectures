const md5 = require('blueimp-md5');
const axios = require('axios');

async function data(target) {

    const publickey = '2894fe785d8352a8acc7028cdbca38fc';
    const privatekey = '3ed76c9a079cdcc8ac494359d5a23f0256eb2b55';
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    const baseUrl = 'https://gateway.marvel.com:443/v1/public/' + target;
    const url = baseUrl + 'ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

    const { data } = await axios.get(url);
    // console.log(url);
    return data;

}

module.exports = {
    data
}