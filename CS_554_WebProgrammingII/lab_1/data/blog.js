const { check } = require('../public/js/check');
const collection = require("../config/mongoCollections");

const mongo = require("mongodb");

module.exports = {
    create,
    getOne,
    getAll,
    update
}

async function create(user_id, title, body) {
    let errors = [];
    if (arguments.length != 3) errors.push("arguments");
    if (!(user_id = check(user_id, "id"))) errors.push("user_id");
    if (!(title = check(title, "title"))) errors.push("title");
    if (!(body = check(body, "body"))) errors.push("body");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');

    const checkUser = await userCol.findOne({ "_id": mongo.ObjectId(user_id) });
    if (checkUser == null) {
        await collection.closeCollection();
        errors.push("user not exist");
        return { "hasErrors": true, "errors": errors };
    }

    const blog = {
        "title": title,
        "body": body,
        "userThatPosted": { "_id": checkUser._id, "username": checkUser.username },
        "comments": []
    }

    const blogCol = await collection.getCollection('blog');

    const insertInfo = await blogCol.insertOne(blog);
    if (insertInfo.insertedCount === 0) {
        await collection.closeCollection();
        throw "Can't create blog in mongodb, something went wrong, please try again!";
    }

    const insertedBlog = await blogCol.findOne({ _id: insertInfo.insertedId });
    if (insertedBlog === null) {
        await collection.closeCollection();
        throw "Can't find created blog in mongodb, something went wrong! Please try again!";
    }
    await collection.closeCollection();

    insertedBlog._id = insertedBlog._id.toString();
    return { "hasErrors": false, "blog": insertedBlog };

}

async function getOne(blog_id) {
    let errors = [];
    if (arguments.length != 1) errors.push("arguments");
    if (!(blog_id = check(blog_id, "id"))) errors.push("blog_id");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const blogCol = await collection.getCollection('blog');

    const checkBlog = await blogCol.findOne({ "_id": mongo.ObjectId(blog_id) });
    if (checkBlog == null) {
        await collection.closeCollection();
        errors.push("blog not exist");
        return { "hasErrors": true, "errors": errors };
    }

    await collection.closeCollection();

    checkBlog._id = checkBlog._id.toString();
    for (let i = 0; i < checkBlog.comments; i++) {
        checkBlog.comments[i]._id = checkBlog.comments[i]._id.toString();
    }
    return { "hasErrors": false, "blog": checkBlog };
}

async function getAll(take, skip) {
    let errors = [];
    if (arguments.length != 2) errors.push("arguments");
    if (!(take = check(take, "take"))) errors.push("take");
    skip = check(skip, "skip");
    if (skip < 0) errors.push("skip");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const blogCol = await collection.getCollection('blog');

    const blogs = await blogCol.find().skip(skip).limit(take).toArray();

    await collection.closeCollection();

    blogs.forEach(element => {
        element._id = element._id.toString();
        element.comments.forEach(element2 => {
            element2._id = element2._id.toString();
        });
    });
    return { "hasErrors": false, "blogs": blogs };
}

async function update(blog_id, user_id, title, body) {
    let errors = [];
    if (arguments.length != 4) errors.push("arguments");
    if (!(blog_id = check(blog_id, "id"))) errors.push("blog_id");
    if (!(user_id = check(user_id, "id"))) errors.push("user_id");
    if (!(title = check(title, "title"))) errors.push("title");
    if (!(body = check(body, "body"))) errors.push("body");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');

    const checkUser = await userCol.findOne({ "_id": mongo.ObjectId(user_id) });
    if (checkUser == null) {
        await collection.closeCollection();
        errors.push("user not exist");
        return { "hasErrors": true, "errors": errors };
    }

    const blogCol = await collection.getCollection('blog');

    const checkBlog = await blogCol.findOne({ "_id": mongo.ObjectId(blog_id) });
    if (checkBlog == null) {
        await collection.closeCollection();
        errors.push("blog not exist");
        return { "hasErrors": true, "errors": errors };
    }
    if (checkBlog.userThatPosted._id == mongo.ObjectId(user_id)) {
        await collection.closeCollection();
        errors.push("user not owner");
        return { "hasErrors": true, "errors": errors };
    }

    if (checkBlog.title == title && checkBlog.body == body) {
        await collection.closeCollection();
        errors.push("blog not change");
        return { "hasErrors": true, "errors": errors };
    }

    const updatedInfo = await blogCol.updateOne(
        { "_id": mongo.ObjectId(blog_id) },
        { $set: { "title": title, "body": body } }
    );
    if (updatedInfo.modifiedCount === 0) {
        await collection.closeCollection();
        throw "Can't update blog information in mongodb, something went wrong, please try again!";
    }

    const updatedBlog = await blogCol.findOne({ "_id": mongo.ObjectId(blog_id) });
    if (updatedBlog === null) {
        await collection.closeCollection();
        throw "Can't find updated blog in mongodb, something went wrong, Please try again!";
    }
    await collection.closeCollection();

    updatedBlog._id = updatedBlog._id.toString();
    return { "hasErrors": false, "blog": updatedBlog };
}