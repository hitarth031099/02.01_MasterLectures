const mongo = require("mongodb");
const { ObjectId } = require("bson");
const collection = require("../config/mongoCollections");

module.exports = {
    create,
    getAll,
    get,
    remove,
    rename
}

async function create(name, location, phoneNumber, website, priceRange, cuisines, overallRating, serviceOptions) {
    if (arguments.length != 8) throw "create arguments not right"
    checkString(name);
    checkString(location);
    checkString(phoneNumber);
    checkString(website);
    checkString(priceRange);

    name = name.trim();
    location = location.trim();
    phoneNumber = phoneNumber.trim();
    website = website.trim();
    priceRange = priceRange.trim();

    checkOverallRating(overallRating);
    website = website.toLowerCase();
    if (! /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(phoneNumber)) throw "phoneNumber not correct";
    if (! /^http:\/\/www.[a-zA-Z0-9]{5,}.com$/.test(website)) throw "website not correct";
    if (! /^[$]{1,4}$/.test(priceRange)) throw "priceRange not correct";

    checkCuisines(cuisines);
    checkServiceOptions(serviceOptions);

    let obj = {
        name: name,
        location: location,
        phoneNumber: phoneNumber,
        website: website,
        priceRange: priceRange,
        cuisines: cuisines,
        overallRating: overallRating,
        serviceOptions: serviceOptions
    }

    const col = await collection.getCollection('restaurants');

    const arr = await col.find({}).toArray();
    let flag=false;
    arr.forEach(element => {
        if(element.phoneNumber==phoneNumber){
            flag=true;
        }
    });

    if(flag){
        await collection.closeCollection();
        throw "already exist";
    }

    const insertinfo = await col.insertOne(obj);
    const newId = insertinfo.insertedId;
    const newItem = await col.findOne({ _id: newId });
    await collection.closeCollection();

    if (insertinfo.insertedCount === 0) throw 'Could not add restaurants';
    newItem._id = newItem._id.toString();
    return newItem;
}

async function getAll() {
    if (arguments.length != 0) throw "getAll arguments not right"
    const col = await collection.getCollection('restaurants');
    const list = await col.find({}).toArray();
    await collection.closeCollection();
    list.forEach(element => {
        element._id = element._id.toString()
    });
    return list;
}

async function get(id) {
    if (arguments.length != 1) throw "get arguments not right";
    checkString(id);
    id = id.trim();

    if(! mongo.ObjectId.isValid(id)) throw "not valid id";

    id = ObjectId(id);

    const col = await collection.getCollection('restaurants');
    const restaurant = await col.findOne({ _id: id });
    await collection.closeCollection();
    if (restaurant == null) throw "no restaurant with that id";
    restaurant._id = restaurant._id.toString();
    return restaurant;
}

async function remove(id) {
    if (arguments.length != 1) throw "get arguments not right";
    checkString(id);
    id = id.trim();

    if(! mongo.ObjectId.isValid(id)) throw "not valid id";

    id = ObjectId(id);

    const col = await collection.getCollection('restaurants');
    let name = await col.findOne({ _id: id });
    if(name==null){
        await collection.closeCollection();
        throw "remove not find id";
    }
    name = name.name;
    const deletionInfo = await col.deleteOne({ _id: id });
    await collection.closeCollection();

    if (deletionInfo.deletedCount === 0) throw `Could not delete dog with id of ${id}`;

    return name + " has been successfully deleted!";
}

async function rename(id, newWebsite) {
    if (arguments.length != 2) throw "rename arguments not right";

    checkString(id);
    id = id.trim();
    if(! mongo.ObjectId.isValid(id)) throw "not valid id";
    id = ObjectId(id);

    checkString(newWebsite);
    newWebsite = newWebsite.trim();
    newWebsite = newWebsite.toLowerCase();
    if (! /^http:\/\/www.[a-zA-Z0-9]{5,}.com$/.test(newWebsite)) throw "newWebsite not correct";

    const col = await collection.getCollection('restaurants');
    let item = await col.findOne({ _id: id });
    if (item == null) {
        await collection.closeCollection();
        throw "don't exist";
    }
    if (item.website == newWebsite) {
        await collection.closeCollection();
        throw "website is same";
    }

    item={
        name: item.name,
        location: item.location,
        phoneNumber: item.phoneNumber,
        website: newWebsite,
        priceRange: item.priceRange,
        cuisines: item.cuisines,
        overallRating: item.overallRating,
        serviceOptions: item.serviceOptions
    }
    const updatedInfo = await col.updateOne(
        { _id: id },
        { $set: item }
    );
    
    await collection.closeCollection();

    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update dog successfully';
    }

    item={
        _id:id.toString(),
        name: item.name,
        location: item.location,
        phoneNumber: item.phoneNumber,
        website: newWebsite,
        priceRange: item.priceRange,
        cuisines: item.cuisines,
        overallRating: item.overallRating,
        serviceOptions: item.serviceOptions
    }
    return item;
}

function checkUndefined(input) {
    if (input == null) throw new Error("Undefined");
}

function checkStringEmpty(input) {
    if (input.length == 0) throw new Error("Empty String");
}

function checkAllSpace(input) {
    if (input.trim().length == 0) throw "String is All Space";
}

function checkString(input) {
    checkUndefined(input);
    if (typeof (input) != "string") throw new Error("Not String");
    checkStringEmpty(input);
    checkAllSpace(input);
}

function checkCuisines(input) {
    checkUndefined(input);
    if (!Array.isArray(input)) throw new Error("Not Array");
    if (input.length == 0) throw "empty array";
    input.forEach(element => {
        checkString(element);
    });
}

function checkServiceOptions(input) {
    checkUndefined(input);
    if (Object.prototype.toString.call(input) != "[object Object]") throw "not object";
    if (Object.keys(input).length!=3) throw "not three key";
    if (typeof (input.dineIn) != "boolean" || typeof (input.takeOut) != "boolean" || typeof (input.delivery) != "boolean")
        throw "not all boolean";
}

function checkOverallRating(input) {
    checkUndefined(input);
    if (typeof (input) == "number" && !isNaN(input)) {
        if (input <= 5 && input >= 0) {
            return;
        } else "not from 0 to 5";
    } else throw "not number";
}
