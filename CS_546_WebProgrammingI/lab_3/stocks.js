const axios = require("axios");
const PeoplePath = 'https://gist.githubusercontent.com/graffixnyc/a1196cbf008e85a8e808dc60d4db7261/raw/9fd0d1a4d7846b19e52ab3551339c5b0b37cac71/people.json'
const StocksPath = 'https://gist.githubusercontent.com/graffixnyc/8c363d85e61863ac044097c0d199dbcc/raw/7d79752a9342ac97e4953bce23db0388a39642bf/stocks.json'


module.exports = {
    description: "stocks.js",
    listShareholders,
    topShareholder,
    listStocks,
    getStockById
}

async function getPeople() {
    const { data } = await axios.get(PeoplePath);
    return data;
}

async function getStocks() {
    const { data } = await axios.get(StocksPath);
    return data;
}

async function listShareholders() {
    if (arguments.length != 0) {
        throw "no parameter";
    }

    let data = await getPeople();
    let data2 = await getStocks();

    let result = new Array();
    for (let i = 0; i < data2.length; i++) {
        let obj = new Object();
        obj["id"] = data2[i].id;
        obj["stock_name"] = data2[i].stock_name;
        let arr = new Array();
        for (let j = 0; j < data2[i].shareholders.length; j++) {
            for (let m = 0; m < data.length; m++) {
                if (data[m].id == data2[i].shareholders[j].userId) {
                    arr.push({
                        "first_name": data[m].first_name,
                        "last_name": data[m].last_name,
                        "number_of_shares": data2[i].shareholders[j].number_of_shares
                    });
                }
            }
        }
        obj["shareholders"] = arr;
        result.push(obj);
    }
    return result;
}

async function topShareholder(stockName) {
    checkInputString(stockName);

    stockName = stockName.trim();

    let data = await getPeople();
    let data2 = await getStocks();

    let arr = new Array();
    let flag = false;
    for (let i = 0; i < data2.length; i++) {
        if (data2[i].stock_name == stockName) {
            if (data2[i].shareholders.length > 0) {
                arr = data2[i].shareholders;
                flag = true;
            }
            else return `${stockName} has no shareholders.`;
        }
    };

    if (flag == false) {
        return "No stock with that name";
    }

    let most = 0;
    let id;
    arr.forEach(element => {
        if (element.number_of_shares > most) {
            most = element.number_of_shares;
            id = element.userId;
        }
    });
    let str;
    data.forEach(element => {
        if (element.id == id) {
            str = `With ${most} shares in ${stockName}, ${element.first_name} ${element.last_name} is the top share holder.`;
        }
    });
    return str;
}

async function listStocks(firstName, lastName) {
    checkInputString(firstName);
    checkInputString(lastName);

    firstName = firstName.trim();
    lastName = lastName.trim();
    firstName=firstName.toLowerCase();
    lastName=lastName.toLowerCase();

    let data = await getPeople();
    let data2 = await getStocks();

    let id;
    let flag = false;
    data.forEach(element => {
        if (element.first_name.toLowerCase() == firstName && element.last_name.toLowerCase() == lastName) {
            id = element.id;
            flag = true;
        }
    });
    if (flag == false) {
        throw `because ${firstName} ${lastName} is not in people.json`;
    }
    let arr = new Array();
    data2.forEach(element => {
        element.shareholders.forEach(element2 => {
            let obj = new Object();
            if (element2.userId == id) {
                obj["stock_name"] = element.stock_name;
                obj['number_of_shares'] = element2.number_of_shares;
                arr.push(obj);
            }

        });
    });
    if(arr.length==0){
        throw "people don't have at least one company";
    }
    return arr;
}

async function getStockById(id) {
    checkInputString(id);

    id = id.trim();

    let stocks = await getStocks();
    let result;

    stocks.forEach(element => {
        if (element.id == id) {
            result = element;
        }
    });
    if (result == undefined) {
        throw "stock not found";
    }
    return result;
}

function checkUndefined(input) {
    if (input == undefined) {
        throw "undefined";
    }
}

function checkString(input) {
    if (typeof (input) != "string") {
        throw "not a string";
    }
}

function checkStringEmpty(input) {
    if (input.length == 0) throw "Empty String";
}

function checkAllSpace(input) {
    let count = 0;
    for (let i = 0; i < input.length; i++) {
        if (input[i] == " ") {
            count++;
        }
    }
    if (count == input.length) {
        throw "String is All Space";
    }
    return;
}

function checkInputString(input) {
    checkUndefined(input);
    checkString(input);
    checkStringEmpty(input);
    checkAllSpace(input);
}