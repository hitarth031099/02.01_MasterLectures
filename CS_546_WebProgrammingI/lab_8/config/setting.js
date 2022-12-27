const md5 = require('blueimp-md5');

const publickey = 'cea299e10a69ea42e290a2f3b637a87b';
const privatekey = 'b51e2c3b8d4e98f96e5c91ee2db6f9d868f69ce8';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/';

module.exports = {
    getUrl
}

function getUrl(connection){
    const url = baseUrl + connection + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
    return url;
}