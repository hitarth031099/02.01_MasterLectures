const express = require('express');
const router = express.Router();
const data = require('../data');
const restaurantsData = data.restaurants;
const reviewsData = data.reviews;

router.get('/:id', async (req, res) => {
    const restaurantid = req.params.id;

    try {
        const post = await reviewsData.getAll(restaurantid);
        if (post.length == 0) throw "restaurant don't have review";
        res.json(post);
    } catch (error) {
        res.status(404).json({ "error": error });
    }
});

router.post('/:id', async (req, res) => {
    const restaurantid = req.params.id;

    try {
        await restaurantsData.get(restaurantid);
    } catch (error) {
        res.status(400).json({ error: 'restaurant not found' });
        return;
    }

    const postData = req.body;

    let title, reviewer, rating, dateOfReview, review

    try {
        if (Object.prototype.toString.call(postData) != "[object Object]") throw "Post Not Object";
        if (Object.keys(postData).length != 5) throw "number of keys not right";

        title = postData.title;
        reviewer = postData.reviewer;
        rating = postData.rating;
        dateOfReview = postData.dateOfReview;
        review = postData.review;

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

    } catch (error) {
        res.status(400).json({ error: error });
        return;
    };

    try {
        const post = await reviewsData.create(restaurantid, title, reviewer, rating, dateOfReview, review);
        res.json(post);
    } catch (error) {
        res.status(404).json({ "error": error });
    }
});

router.get('/review/:id', async (req, res) => {
    const reviewId = req.params.id;

    try {
        const post = await reviewsData.get(reviewId);
        res.json(post);
    } catch (error) {
        res.status(404).json({ error: error });
    }

});

router.delete('/review/:id', async (req, res) => {
    const reviewId = req.params.id;

    try {
        await reviewsData.remove(reviewId)
        res.json({ "restaurantId": reviewId, "deleted": true });
    } catch (error) {
        res.status(404).json({ error: error });
    }

});

module.exports = router;




function checkUndefined(input) {
    if (input == null) throw new "Undefined";
}

function checkStringEmpty(input) {
    if (input.length == 0) throw new "Empty String";
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