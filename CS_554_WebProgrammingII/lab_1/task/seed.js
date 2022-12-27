const { user } = require("../data/index");
const { blog } = require("../data/index");
const { comment } = require("../data/index");

main();

async function main() {

    // await userSeed();
    // await blogSeed();
    // await commentSeed();

    // await checkBlog();
    // await checkComment();
}

async function userSeed() {

    console.log(await user.signup(
        "yufusd liao",
        "ledso",
        "Lunatic3548!"
    ));

    console.log(await user.signup(
        "yufusddfasdf liao",
        "leasdfasddso",
        "Lunatic3548!"
    ));

    console.log(await user.signup(
        "yufussdd liao",
        "ledsdsafo",
        "Lunatic3548!"
    ));


    console.log(await user.login(
        "ledso",
        "Lunatic3548!"
    ));
}

async function blogSeed() {
    for (let i = 0; i < 100; i++) {
        console.log(await blog.create("61f1cb5fbd0f81f60ecfe442", "title " + i, "body" + i));
    }
}

async function commentSeed() {
    const users = ["61f1cb5fbd0f81f60ecfe442", "61f1cb5fbd0f81f60ecfe443", "61f1cb5fbd0f81f60ecfe444"];
    const blogs = ["61f1cb80b83eb0991f9474a2", "61f1cb80b83eb0991f9474a3", "61f1cb80b83eb0991f9474a4"];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            console.log(await comment.create(blogs[i], users[j], blogs[i] + "  " + users[j]));
        }
    }
}

async function checkBlog() {
    // console.log(await blog.getOne("61f1c79630fa766801859908"));
    // console.log(await blog.getAll(0,0));
    console.log(await blog.update("61f1cb80b83eb0991f9474a2", "61f1cb5fbd0f81f60ecfe442", "sadfaaa", "dsaas"));
}

async function checkComment() {
    console.log(await comment.dele("61f1cb80b83eb0991f9474a2", "61f1cb5fbd0f81f60ecfe442", "61f1fafb8129a7ceb70740cd"));
}