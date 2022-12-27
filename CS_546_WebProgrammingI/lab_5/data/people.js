const axios = require("axios");
const path = 'https://gist.githubusercontent.com/graffixnyc/a1196cbf008e85a8e808dc60d4db7261/raw/9fd0d1a4d7846b19e52ab3551339c5b0b37cac71/people.json';

module.exports = {
    getPeopleById,
    getAllPeople
}

async function getPeopleData() {
    const { data } = await axios.get(path);
    return data;
}

async function getPeopleById(id) {
    
    let PeopleData = await getPeopleData();

    for (let i = 0; i < PeopleData.length; i++) {
        if (PeopleData[i].id == id) {
            return PeopleData[i];
        }
    }
    throw "Person not found Error";
}

async function getAllPeople() {
    let PeopleData = await getPeopleData();
    return await PeopleData;
}