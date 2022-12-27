const bcrypt = require('bcryptjs');
const saltRound = 16;
const collection = require("../config/mongoCollections");
const { check } = require("../config/check");

module.exports = {
    createUser,
    checkUser
}

async function createUser(username, password) {

    if (arguments.length != 2) throw "User create arguments is not correct.";
    if (!(username = check(username, "username"))) throw "Username is not valid.";
    if (!(password = check(password, "password"))) throw "Password is not valid.";

    let user = {
        "username": username,
        "password": await bcrypt.hash(password, saltRound),
    }

    const col = await collection.getCollection('users');

    const all = await col.find({}).toArray();
    if (all.length == 0) {
        await col.createIndex({ "username": "text" })
    }

    const checkUsername = await col.findOne(
        {
            $text:
            {
                $search: username,
                $caseSensitive: false
            }
        }
    );

    if (checkUsername != null) {
        await collection.closeCollection();
        throw "there is already a user with that username";
    }

    const insertInfo = await col.insertOne(user);
    if (insertInfo.insertedCount === 0) {
        await collection.closeCollection();
        throw "Can't create user in mongodb, something went wrong, please try again!";
    }

    await collection.closeCollection();

    return { "userInserted": true };
}

async function checkUser(username, password) {

    if (arguments.length != 2) throw "User check arguments is not correct!";
    if (!(username = check(username, "username"))) throw "username is not valid!";
    if (!(password = check(password, "password"))) throw "Password is not valid!";

    const col = await collection.getCollection('users');

    const all = await col.find({}).toArray();
    if (all.length == 0) {
        await col.createIndex({ "username": "text" })
    }

    const checkUsername = await col.findOne(
        {
            $text:
            {
                $search: username,
                $caseSensitive: false
            }
        }
    );
    if (checkUsername == null) {
        await collection.closeCollection();
        throw "Either the username or password is invalid";
    }

    if (! await bcrypt.compare(password, checkUsername.password)) {
        await collection.closeCollection();
        throw "Either the username or password is invalid";
    }

    await collection.closeCollection();

    return { "authenticated": true };
}

