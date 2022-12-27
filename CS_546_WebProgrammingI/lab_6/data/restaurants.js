const mongo = require("mongodb");
const { ObjectId } = require("bson");
const collection = require("../config/mongoCollections");

module.exports = {
    create,
    getAll,
    get,
    remove,
    update
}

async function create(name, location, phoneNumber, website, priceRange, cuisines, serviceOptions) {
    if (arguments.length != 7) throw "create arguments of a restaurant not right"
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

    website = website.toLowerCase();
    if (! /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(phoneNumber)) throw "phoneNumber not correct";
    if (! /^http:\/\/www\.[a-zA-Z0-9]{5,}\.com$/.test(website)) throw "website not correct";
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
        overallRating: 0,
        serviceOptions: serviceOptions,
        reviews: []
    }

    const col = await collection.getCollection('restaurants');

    const insertinfo = await col.insertOne(obj);
    if (insertinfo.insertedCount === 0) {
        await collection.closeCollection();
        throw 'Mongodb could not add a restaurant, something goes wrong';
    }

    const newId = insertinfo.insertedId;
    const newItem = await col.findOne({ _id: newId });

    await collection.closeCollection();

    newItem._id = newItem._id.toString();
    newItem.reviews.forEach(element => {
        element._id = element._id.toString();
    });
    return newItem;
}

async function getAll() {
    if (arguments.length != 0) throw "arguments of restaurant getAll is not right"

    const col = await collection.getCollection('restaurants');

    const list = await col.find({},{projection: {"_id":1,"name":1}}).toArray();

    await collection.closeCollection();

    list.forEach(element => {
        element._id = element._id.toString();
    });
    return list;
}

async function get(id) {
    if (arguments.length != 1) throw "arguments of restaurant getAll not right";

    checkString(id);
    id = id.trim();
    if (!mongo.ObjectId.isValid(id)) throw "not valid id";
    id = ObjectId(id);

    const col = await collection.getCollection('restaurants');

    const restaurant = await col.findOne({ _id: id });

    await collection.closeCollection();

    if (restaurant == null) throw "no restaurant with that id";

    restaurant._id = restaurant._id.toString();
    restaurant.reviews.forEach(element => {
        element._id = element._id.toString();
    });

    return restaurant;
}

async function remove(id) {
    if (arguments.length != 1) throw "arguments of restaurants remove is not right";

    checkString(id);
    id = id.trim();
    if (!mongo.ObjectId.isValid(id)) throw "not valid id";
    id = ObjectId(id);

    const col = await collection.getCollection('restaurants');

    const restaurant = await col.findOne({ _id: id });
    if (restaurant == null) {
        await collection.closeCollection();
        throw "remove not find id";
    }

    const deletionInfo = await col.deleteOne({ _id: id });
    if (deletionInfo.deletedCount === 0) {
        await collection.closeCollection();
        throw `Could not remove restaurant with id of ${id}, something went wrong on mongodb`;
    }

    await collection.closeCollection();

    restaurant._id = restaurant._id.toString()

    return restaurant;
}

async function update(id, name, location, phoneNumber, website, priceRange, cuisines, serviceOptions) {
    if (arguments.length != 8) throw "arguments of restaurant update not right"

    checkString(id);
    id = id.trim();
    if (!mongo.ObjectId.isValid(id)) throw "not valid id";
    id = ObjectId(id);

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

    website = website.toLowerCase();
    if (! /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(phoneNumber)) throw "phoneNumber not correct";
    if (! /^http:\/\/www.[a-zA-Z0-9]{5,}.com$/.test(website)) throw "website not correct";
    if (! /^[$]{1,4}$/.test(priceRange)) throw "priceRange not correct";

    checkCuisines(cuisines);
    checkServiceOptions(serviceOptions);

    const col = await collection.getCollection('restaurants');

    const restaurant = await col.findOne({ _id: id });
    if (restaurant == null) {
        await collection.closeCollection();
        throw `restaurant with ${id} don't exist`;
    }

    if (name == restaurant.name &&
        location == restaurant.location &&
        phoneNumber == restaurant.phoneNumber &&
        website == restaurant.website &&
        priceRange == restaurant.priceRange &&
        checkCuisinesSame(cuisines, restaurant.cuisines) &&
        checkServiceOptionsSame(serviceOptions, restaurant.serviceOptions)
    ) {
        await collection.closeCollection();
        throw "no values update";
    }

    let newRestaurant = {
        name: name,
        location: location,
        phoneNumber: phoneNumber,
        website: website,
        priceRange: priceRange,
        cuisines: cuisines,
        overallRating: restaurant.overallRating,
        serviceOptions: serviceOptions,
        reviews: restaurant.reviews
    }
    const updatedInfo = await col.updateOne(
        { _id: id },
        { $set: newRestaurant }
    );
    if (updatedInfo.modifiedCount === 0) {
        await collection.closeCollection();
        throw 'could not update restaurant successfully';
    }

    const updated = await col.findOne({ _id: id });

    await collection.closeCollection();

    updated._id = updated._id.toString();
    updated.reviews.forEach(element => {
        element._id = element._id.toString();
    });

    return updated;
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
    if (Object.keys(input).length != 3) throw "not three key";
    if (typeof (input.dineIn) != "boolean" || typeof (input.takeOut) != "boolean" || typeof (input.delivery) != "boolean")
        throw "not all boolean";
}

function checkCuisinesSame(newCuisines, cuisines) {
    if (newCuisines.length != cuisines.length) return false;
    newCuisines = newCuisines.sort();
    cuisines = cuisines.sort();
    for (let i = 0; i < newCuisines.length; i++) {
        if (cuisines[i] != newCuisines[i])
            return false;
    }
    return true;
}

function checkServiceOptionsSame(newServiceOptions, serviceOptions) {
    if (
        newServiceOptions.dineIn == serviceOptions.dineIn &&
        newServiceOptions.takeOut == serviceOptions.takeOut &&
        newServiceOptions.delivery == serviceOptions.delivery
    ) {
        return true;
    }
    return false;
}