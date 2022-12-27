const axios = require("axios");
const path = 'https://gist.githubusercontent.com/graffixnyc/a1196cbf008e85a8e808dc60d4db7261/raw/9fd0d1a4d7846b19e52ab3551339c5b0b37cac71/people.json'

module.exports = {
    description: "people.js",
    getPersonByld,  
    sameStreet,
    manipulateSsn,
    sameBirthday
}

async function getPeople() {
    const { data } = await axios.get(path);
    return data;
}

async function getPersonByld(id) {
    if (arguments.length != 1) {
        throw "parameter error";
    }

    checkInputString(id);
    
    id = id.trim();

    let data = await getPeople();

    for (let i = 0; i < data.length; i++) {
        if (data[i].id == id) {
            return data[i];
        }
    }
    throw "Person not found Error";
}

function findSame(temp, input) {
    if (temp.street_name == undefined || temp.street_suffix == undefined)
        return false;
    if (temp.street_name.toLowerCase() == input[0] && temp.street_suffix.toLowerCase() == input[1]) {
        return true;
    }
    return false;
}

async function sameStreet(streetName, streetSuffix) {
    if (arguments.length != 2) {
        throw "parameter error";
    }
    checkInputString(streetName);
    checkInputString(streetSuffix);

    streetName = streetName.trim();
    streetSuffix = streetSuffix.trim();

    let data = await getPeople();

    let result = new Array();
    let count = 0;
    let input = [streetName.toLowerCase(), streetSuffix.toLowerCase()];
    for (let i = 0; i < data.length; i++) {
        let temp = data[i].address.home;
        if (findSame(temp, input)) {
            result.push(data[i]);
            count++;
        } else {
            temp = data[i].address.work;
            if (findSame(temp, input)) {
                result.push(data[i]);
                count++;
            }
        }
    }
    if (count < 2) {
        throw "not at least two people"
    }
    return result;
}

async function manipulateSsn() {
    if (arguments.length != 0) {
        throw "parameter error";
    }
    let data = await getPeople();

    let low = 999999999, high = 0, average = 0;
    let obj = new Object();
    data.forEach(element => {
        let ssn = element.ssn;
        let temp = ssn.substring(0, 3) + ssn.substring(4, 6) + ssn.substring(7);
        temp=temp.split('').sort().join('')
        temp=parseFloat(temp);
        if (temp < low) {
            low = temp;
            obj["lowest"] = { "firstName": element.first_name, "lastName": element.last_name };
        }
        if (temp > high) {
            high = temp;
            obj["highest"] = { "firstName": element.first_name, "lastName": element.last_name };
        }
        average += temp;
    });
    average = Math.round(average / data.length);
    obj["average"] = average;
    return obj;
}

async function sameBirthday(month, day) {
    checkUndefined(month);
    checkUndefined(day);

    checkStringNumber(month);
    checkStringNumber(day);

    let year = [
        { 'Jan': 31 },
        { 'Feb': 28 },
        { 'Mar': 31 },
        { 'Apr': 30 },
        { 'May': 31 },
        { 'Jun': 30 },
        { 'Jul': 31 },
        { 'Aug': 31 },
        { 'Sep': 30 },
        { 'Oct': 31 },
        { 'Nov': 30 },
        { 'Dec': 31 }
    ];

    if (typeof (month) == "string") {
        month = month.trim();
        month = parseInt(month);
    }
    if (typeof (day) == "string") {
        day = day.trim();
        day = parseInt(day);
    }

    if (year[month - 1] == undefined) {
        throw "Month > 12";
    } else {
        if (day > Object.values(year[month - 1])[0]) {
            throw `There are not ${day} days in ${Object.keys(year[month - 1])[0]}`
        }
    }

    let data = await getPeople();
    let result = new Array();
    for (let i = 0; i < data.length; i++) {
        let birth = data[i].date_of_birth;
        birth = birth.substring();
        let temp = parseInt(birth.substring(0, 3));
        let temp2 = parseInt(birth.substring(3))

        if (month == temp && day == temp2) {
            result.push(data[i].first_name + ' ' + data[i].last_name);
        }
    }
    if (result.length == 0) {
        throw "no person has the birthday";
    }
    return result;
}

function checkStringNumber(input) {
    if (typeof (input) == 'number') {
        if (isNaN(input)) {
            throw 'NaN';
        }
        return;
    }
    if (typeof (input) == "string") {
        checkStringEmpty(input);
        checkAllSpace(input);
        input = input.trim();
        if (isNaN(parseInt(input)))
            throw "string can't convert to number";
        return;
    }
    throw "not string and number";
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