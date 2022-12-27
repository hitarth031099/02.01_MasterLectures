const data = require('./data.json');

module.exports = {
    getById
}

async function getById(id) {

    if (id == undefined) throw "id not valid";
    if (typeof (id) == "string") {
        id = id.trim();
        if (id.length == 0) throw "id not valid";
        if (! /^[0-9]+$/.test(id)) throw "id not valid";
        id = Number.parseInt(id);
    }

    return new Promise((resolve, reject) => {
        setTimeout(() => {

            const user = data[id-1];
            if (user) {
                resolve(user);
            } else {
                reject(new Error("something went wrong"));
            }
        }, 5000);
    });
}