const express = require('express');
const router = express.Router();
const data = require('../data');
const restaurantsData = data.restaurants;

router.get('/', async (req, res) => {
    try {
        const postList = await restaurantsData.getAll();
        res.json(postList);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.post('/', async (req, res) => {
    const postData = req.body;

    let name, location, phoneNumber, website, priceRange, cuisines, serviceOptions;

    try {
        if (Object.prototype.toString.call(postData) != "[object Object]") throw "Post Not Object";
        if (Object.keys(postData).length != 7) throw "number of keys not right";

        name = postData.name;
        location = postData.location;
        phoneNumber = postData.phoneNumber;
        website = postData.website;
        priceRange = postData.priceRange;
        cuisines = postData.cuisines;
        serviceOptions = postData.serviceOptions;

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

    } catch (error) {
        res.status(400).json({ error: error });
        return;
    }

    try {
        const newRestaurant = await restaurantsData.create(name, location, phoneNumber, website, priceRange, cuisines, serviceOptions);
        res.json(newRestaurant);
    } catch (error) {
        res.status(200).json({ error: error });
    }

});

router.get('/:id', async (req, res) => {
    const restaurantid = req.params.id;

    try {
        const post = await restaurantsData.get(restaurantid);
        res.json(post);
    } catch (error) {
        res.status(404).json({ error: error });
    }
});

router.put('/:id', async (req, res) => {
    const restaurantid = req.params.id;

    try {
        await restaurantsData.get(restaurantid);
    } catch (error) {
        res.status(404).json({ error: 'restaurants not found' });
        return;
    }

    const postData = req.body;

    let name, location, phoneNumber, website, priceRange, cuisines, serviceOptions;

    try {
        if (Object.prototype.toString.call(postData) != "[object Object]") throw "Post Not Object";
        if (Object.keys(postData).length != 7) throw "number of keys not right";

        name = postData.name;
        location = postData.location;
        phoneNumber = postData.phoneNumber;
        website = postData.website;
        priceRange = postData.priceRange;
        cuisines = postData.cuisines;
        serviceOptions = postData.serviceOptions;

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

    } catch (error) {
        res.status(400).json({ error: error });
        return;
    }

    try {
        const newRestaurant = await restaurantsData.update(restaurantid,name, location, phoneNumber, website, priceRange, cuisines, serviceOptions);
        res.json(newRestaurant);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});


router.delete('/:id', async (req, res) => {
    const restaurantid = req.params.id;

    try {
        await restaurantsData.get(restaurantid);
    } catch (error) {
        res.status(404).json({ error: 'restaurants not found' });
        return;
    }

    try {
        await restaurantsData.remove(restaurantid)
        res.json({ "restaurantId": restaurantid, "deleted": true });
    } catch (error) {
        res.status(500).json({ error: error });
    }

});

module.exports = router;

function checkUndefined(input) {
    if (input == null) throw new "Undefined";
}

function checkStringEmpty(input) {
    if (input.length == 0) throw "Empty String";
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