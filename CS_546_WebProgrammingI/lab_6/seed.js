const restaurants = require("./data/restaurants");
const reviews = require("./data/reviews");

async function main() {
    try {
        console.log(await restaurants.create("The Saffron Lounge", "New York City, New York", "111-456-7890", "http://www.saffronlounge.com", "$$$$", ["Cuban", "Italian"], { dineIn: true, takeOut: true, delivery: false }));
    } catch (error) {
        console.log(error);
    }

    try {
        console.log(await restaurants.create("Mexican", "New York City, New York", "222-456-7890", "http://www.mexican.com", "$$$$", ["Cuban", "Italian"], { dineIn: true, takeOut: true, delivery: false }));
    } catch (error) {
        console.log(error);
    }

    try {
        console.log(await restaurants.create("Chinese", "New York City, New York", "333-456-7890", "http://www.mexican.com", "$$$$", ["Cuban", "Italian"], { dineIn: true, takeOut: true, delivery: false }));
    } catch (error) {
        console.log(error);
    }

    try {
        console.log(await reviews.create((await restaurants.getAll())[0]._id, "review", "liaoyufu", 1, "10/27/2021", "try"));
    } catch (error) {
        console.log(error);
    }
    
    try {
        console.log(await reviews.create((await restaurants.getAll())[0]._id, "review", "xia", 2, "10/27/2021", "try"));
    } catch (error) {
        console.log(error);
    }

    try {
        console.log(await reviews.create((await restaurants.getAll())[0]._id, "review", "jiyuan", 3, "10/27/2021", "try"));
    } catch (error) {
        console.log(error);
    }

    // try {
    //     console.log(await restaurants.get("6178462771f97e78d1c5d7a2"));
    // } catch (error) {
    //     console.log(error);
    // }

    // try {
    //     console.log(await reviews.get("6178466c49aeae54a6f5e880"));
    // } catch (error) {
    //     console.log(error);
    // }

    // try {
    //     console.log(await reviews.remove("6178465a9d461dc73daa2687"));
    // } catch (error) {
    //     console.log(error);
    // }

    //ObjectId("6178235df4df4dd531db98aa")

    // {
    //     "name": "sichuan",
    //     "location": "china",
    //     "phoneNumber": "543-456-7890",
    //     "website": "http://www.sichuan.com",
    //     "priceRange": "$$$$",
    //     "cuisines": ["Cuban", "Italian" ],
    //     "serviceOptions": {"dineIn": true, "takeOut": true, "delivery": false} 
    // }

    // { 
    //     "title": "This place was great!",
    //     "reviewer": "scaredycat",
    //     "rating": 5,
    //     "dateOfReview": "10/27/2021",
    //     "review": "This place was great! the staff is top notch and the food was delicious!  They really know how to treat their customers"
    //  }
}

main();