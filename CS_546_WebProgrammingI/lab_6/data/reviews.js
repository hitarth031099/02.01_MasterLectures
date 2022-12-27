const mongo = require("mongodb");
const { ObjectId } = require("bson");
const collection = require("../config/mongoCollections");

module.exports = {
    create,
    getAll,
    get,
    remove
}

async function create(restaurantId, title, reviewer, rating, dateOfReview, review) {
    if (arguments.length != 6) throw "get arguments not right";

    checkString(restaurantId);
    restaurantId = restaurantId.trim();
    if (!mongo.ObjectId.isValid(restaurantId)) throw "not valid id";
    restaurantId = ObjectId(restaurantId);

    checkString(title);
    checkString(reviewer);
    checkString(dateOfReview);
    checkString(review);

    title = title.trim();
    reviewer = reviewer.trim();
    dateOfReview = dateOfReview.trim();
    review = review.trim();

    checkRating(rating);
    checkDateOfReview(dateOfReview);

    const col = await collection.getCollection('restaurants');

    const restaurant = await col.findOne({ "_id": restaurantId });
    if (restaurant == null) {
        await collection.closeCollection();
        throw "no restaurant with that id";
    }

    restaurant.overallRating = 0;
    restaurant.reviews.forEach(element => {
        restaurant.overallRating += element.rating;
    });
    restaurant.overallRating = (restaurant.overallRating + rating) / (restaurant.reviews.length + 1);
    restaurant.overallRating = restaurant.overallRating.toFixed(2);
    restaurant.overallRating = parseFloat(restaurant.overallRating);
    let updatedInfo = await col.updateOne({ "_id": restaurantId }, { $set: { 'overallRating': restaurant.overallRating } });
    if (updatedInfo.modifiedCount === 0) {
        await collection.closeCollection();
        throw 'could not update restaurant overAllRating successfully';
    }

    let obj = {
        _id: ObjectId(),
        title: title,
        reviewer: reviewer,
        rating: rating,
        dateOfReview: dateOfReview,
        review: review
    }
    updatedInfo = await col.updateOne({ _id: restaurantId }, { $push: { reviews: obj } });
    if (updatedInfo.modifiedCount === 0) {
        await collection.closeCollection();
        throw 'could not update restaurant reviews with new review successfully';
    }

    const updated = await col.findOne({ _id: restaurantId });
    await collection.closeCollection();

    updated._id = updated._id.toString();
    updated.reviews.forEach(element => {
        element._id = element._id.toString();
    });
    return updated;
}

async function getAll(restaurantId) {
    if (arguments.length != 1) throw "get arguments not right";

    checkString(restaurantId);
    restaurantId = restaurantId.trim();
    if (!mongo.ObjectId.isValid(restaurantId)) throw "not valid id";
    restaurantId = ObjectId(restaurantId);

    const col = await collection.getCollection('restaurants');

    const restaurant = await col.findOne({ _id: restaurantId });
    if (restaurant == null) {
        await collection.closeCollection();
        throw "no restaurant with that id";
    }

    await collection.closeCollection();

    restaurant._id = restaurant._id.toString();
    restaurant.reviews.forEach(element => {
        element._id = element._id.toString();
    });
    return restaurant.reviews;
}

async function get(reviewId) {
    if (arguments.length != 1) throw "get arguments not right";

    checkString(reviewId);
    reviewId = reviewId.trim();
    if (!mongo.ObjectId.isValid(reviewId)) throw "not valid id";
    reviewId = ObjectId(reviewId);

    const col = await collection.getCollection('restaurants');

    const review = (await col.find(
        { "reviews._id": reviewId },
        {
            projection: {
                "reviews": {
                    $elemMatch: {
                        "_id": reviewId
                    }
                }
            }
        }
    ).toArray())[0];
    if (review == null) {
        await collection.closeCollection();
        throw "no review with that id";
    }

    await collection.closeCollection();

    review._id = review._id.toString();
    review.reviews[0]._id = review.reviews[0]._id.toString();
    return review.reviews[0];
}

async function remove(reviewId) {
    if (arguments.length != 1) throw "get arguments not right";

    checkString(reviewId);
    reviewId = reviewId.trim();
    if (!mongo.ObjectId.isValid(reviewId)) throw "not valid id";
    reviewId = ObjectId(reviewId);

    const col = await collection.getCollection('restaurants');

    const review = (await col.find(
        { "reviews._id": reviewId },
        {
            projection: {
                "reviews": {
                    $elemMatch: {
                        "_id": reviewId
                    }
                }
            }
        }
    ).toArray())[0];
    if (review == null) {
        await collection.closeCollection();
        throw "no review with that id";
    }
    let updatedInfo = await col.updateOne({}, { $pull: { "reviews": { _id: { $eq: reviewId } } } });
    if (updatedInfo.modifiedCount === 0) {
        await collection.closeCollection();
        throw 'could not remove restaurant review';
    }

    const restaurant = await col.findOne({ _id: review._id });
    restaurant.overallRating = 0;
    restaurant.reviews.forEach(element => {
        restaurant.overallRating += element.rating;
    });
    restaurant.overallRating /= restaurant.reviews.length;
    restaurant.overallRating = restaurant.overallRating.toFixed(2);
    restaurant.overallRating = parseFloat(restaurant.overallRating);
    updatedInfo = await col.updateOne({ _id: restaurant._id }, { $set: { 'overallRating': restaurant.overallRating } });
    if (updatedInfo.modifiedCount === 0) {
        await collection.closeCollection();
        throw 'could not update restaurant overallRating';
    }

    await collection.closeCollection();

    return reviewId;
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
    if (typeof (input) != "string") throw "Not String";
    checkStringEmpty(input);
    checkAllSpace(input);
}

function checkRating(input) {
    checkUndefined(input);
    if (typeof (input) != "number" || isNaN(input))
        throw "Not number";
    if (input > 5 || input < 1) throw "not 1-5";
}

function checkDateOfReview(input) {
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    if (today != input) throw "review time not correct";
}