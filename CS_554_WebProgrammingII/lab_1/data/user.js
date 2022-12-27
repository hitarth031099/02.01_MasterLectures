const { check } = require('../public/js/check');
const collection = require("../config/mongoCollections");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

module.exports = {
    signup,
    login
}

async function signup(name, username, password) {
    let errors = [];
    if (arguments.length != 3) errors.push("arguments");
    if (!(name = check(name, "name"))) errors.push("name");
    if (!(username = check(username, "username"))) errors.push("username");
    if (!(password = check(password, "password"))) errors.push("password");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    let user = {
        "name": name,
        "username": username,
        "password": await bcrypt.hash(password, saltRounds)
    }

    const userCol = await collection.getCollection('user');

    const checkUser = await userCol.findOne({ "username": username });
    if (checkUser != null) {
        await collection.closeCollection();
        errors.push("username exist");
        return { "hasErrors": true, "errors": errors };
    }

    const insertInfo = await userCol.insertOne(user);
    if (insertInfo.insertedCount === 0) {
        await collection.closeCollection();
        throw "Can't create user in mongodb, something went wrong, please try again!";
    }

    const insertedUser = await userCol.findOne({ _id: insertInfo.insertedId }, { projection: { "password": 0 } });
    if (insertedUser === null) {
        await collection.closeCollection();
        throw "Can't find created user in mongodb, something went wrong! Please try again!";
    }
    await collection.closeCollection();

    insertedUser._id = insertedUser._id.toString();
    return { "hasErrors": false, "user": insertedUser };
}

async function login(username, password) {
    let errors = [];
    if (arguments.length != 2) errors.push("arguments");
    if (!(username = check(username, "username"))) errors.push("username");
    if (!(password = check(password, "password"))) errors.push("password");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');

    const checkUser = await userCol.findOne({ "username": username });
    if (checkUser == null) {
        await collection.closeCollection();
        errors.push("username not exist");
        return { "hasErrors": true, "errors": errors };
    }

    if (! await bcrypt.compare(password, checkUser.password)) {
        await collection.closeCollection();
        errors.push("password not correct");
        return { "hasErrors": true, "errors": errors };
    }

    await collection.closeCollection();

    checkUser._id = checkUser._id.toString();
    delete checkUser["password"];
    return { "hasErrors": false, "user": checkUser };
}