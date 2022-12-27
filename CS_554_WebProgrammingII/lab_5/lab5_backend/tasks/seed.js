const { createClient } = require('redis');
const client = createClient();
const axios = require("axios");

const data = require('./data.json');

async function main() {
    const client = createClient();

    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();

    await client.FLUSHALL();
    
    for (let i = 0; i < data.length; i++) {
        let info = await client.HSET('posts', data[i].id, JSON.stringify(data[i]));
    }

    const data2 = await client.HGETALL("posts");
    // console.log(Object.values(data).filter(ele => ele.binned === false));
    console.log(Object.values(data2).map(ele => JSON.parse(ele)));

    // const data = await client.HGET("posts","123s");
    // console.log(data === null)

    await client.quit();

    return 0;
}

main();