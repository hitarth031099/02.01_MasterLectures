const { check } = require('../public/js/check');
const collection = require("../config/mongoCollections");

const mongo = require("mongodb");

module.exports = {
    create,
    dele
}

async function create(blog_id, user_id, comment) {
    let errors = [];
    if (arguments.length != 3) errors.push("arguments");
    if (!(blog_id = check(blog_id, "id"))) errors.push("blog_id");
    if (!(user_id = check(user_id, "id"))) errors.push("user_id");
    if (!(comment = check(comment, "comment"))) errors.push("comment");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');

    const checkUser = await userCol.findOne({ "_id": mongo.ObjectId(user_id) });
    if (checkUser == null) {
        await collection.closeCollection();
        errors.push("user not exist");
        return { "hasErrors": true, "errors": errors };
    }

    const obj = {
        "_id": mongo.ObjectId(),
        "userThatPostedComment": { "_id": checkUser._id, "username": checkUser.username },
        "comment": comment
    }

    const blogCol = await collection.getCollection('blog');

    const checkBlog = await blogCol.findOne({ "_id": mongo.ObjectId(blog_id) });
    if (checkBlog == null) {
        await collection.closeCollection();
        errors.push("blog not exist");
        return { "hasErrors": true, "errors": errors };
    }

    const updatedInfo = await blogCol.updateOne({ "_id": mongo.ObjectId(blog_id) }, { $push: { "comments": obj } });
    if (updatedInfo.modifiedCount === 0) {
        await collection.closeCollection();
        throw 'could not create comment in mongodb, something went wrong, please try again!';
    }

    const updatedBlog = await blogCol.findOne({ "_id": mongo.ObjectId(blog_id) });
    if (updatedBlog.modifiedCount === 0) {
        await collection.closeCollection();
        throw 'could not find updated blog in mongodb, something went wrong, please try again!';
    }

    await collection.closeCollection();

    updatedBlog._id = updatedBlog._id.toString();
    return { "hasErrors": false, "blog": updatedBlog };
}

async function dele(blog_id, user_id, comment_id) {
    let errors = [];
    if (arguments.length != 3) errors.push("arguments");
    if (!(blog_id = check(blog_id, "id"))) errors.push("blog_id");
    if (!(user_id = check(user_id, "id"))) errors.push("user_id");
    if (!(comment_id = check(comment_id, "id"))) errors.push("comment_id");

    if (errors.length > 0) return { "hasErrors": true, "errors": errors };

    const userCol = await collection.getCollection('user');

    const checkUser = await userCol.findOne({ "_id": mongo.ObjectId(user_id) });
    if (checkUser == null) {
        await collection.closeCollection();
        errors.push("user not exist");
        return { "hasErrors": true, "errors": errors };
    }

    const blogCol = await collection.getCollection('blog');

    const checkBlog = await blogCol.find({
        "_id": mongo.ObjectId(blog_id),
        "comments": {
            $elemMatch: {
                "_id": mongo.ObjectId(comment_id),
                "userThatPostedComment._id": mongo.ObjectId(user_id)
            }
        }
    }).toArray();
    if (checkBlog.length == 0) {
        await collection.closeCollection();
        errors.push("comment not exist");
        return { "hasErrors": true, "errors": errors };
    }

    const updatedInfo = await blogCol.updateOne({ "_id": mongo.ObjectId(blog_id) }, { $pull: { "comments": { "_id": { $eq: mongo.ObjectId(comment_id) } } } });
    if (updatedInfo.modifiedCount === 0) {
        await collection.closeCollection();
        throw 'could not delete comment in mongodb, something went wrong, please try again!';
    }

    const updatedBlog = await blogCol.findOne({ "_id": mongo.ObjectId(blog_id) });
    if (updatedBlog.modifiedCount === 0) {
        await collection.closeCollection();
        throw 'could not find updated blog in mongodb, something went wrong, please try again!';
    }

    await collection.closeCollection();

    updatedBlog._id = updatedBlog._id.toString();
    return { "hasErrors": false, "blog": updatedBlog };
}