const restaurants = require("./data/restaurants");

async function main() {
    try {
        console.log(await restaurants.create("The Saffron Lounge", "New York City, New York", "123-456-7890", "http://www.saffronlounge.com", "$$$$", ["Cuban", "Italian"], 3, { dineIn: true, takeOut: true, delivery: false }));
    } catch (error) {
        console.log(error);
    }

    try {
        await restaurants.create("Pizza Lounge", "New York City, New York", "999-999-9999", "http://www.pizzalounge.com", "$", ["Italian"], 5, { dineIn: false, takeOut: true, delivery: true });
    } catch (error) {
        console.log(error);
    }

    try {
        console.log(await restaurants.getAll());
    } catch (error) {
        console.log(error);
    }

    try {
        console.log(await restaurants.create("Taco Lounge", "New York City, New York", "333-333-3333", "http://www.tacolounge.com", "$$$", ["Mexico"], 5, { dineIn: false, takeOut: true, delivery: true }));
    } catch (error) {
        console.log(error);
    }

    try {
        let arr = await restaurants.getAll();
        let id = arr[0]._id;
        console.log(await restaurants.rename(id, "http://www.liaoyufu.com"));
    } catch (error) {
        console.log(error);
    }

    try {
        let arr = await restaurants.getAll();
        let id = arr[1]._id;
        console.log(await restaurants.remove(id));
    } catch (error) {
        console.log(error);
    }

    try {
        console.log(await restaurants.getAll());
    } catch (error) {
        console.log(error);
    }

    try {
        await restaurants.create();
    } catch (error) {
        console.log(error);
    }

    try {
        await restaurants.remove("61636b38232f04cd3623dc9a");
    } catch (error) {
        console.log(error);
    }

    try {
        await restaurants.rename("61636a7633589a4eb44d7bf0","http://www.liaoyufu.com");
    } catch (error) {
        console.log(error);
    }

    try {
        await restaurants.rename();
    } catch (error) {
        console.log(error);
    }

    try {
        await restaurants.get("61636a7933589a4eb44d7bf0");
    } catch (error) {
        console.log(error);
    }
}

main();