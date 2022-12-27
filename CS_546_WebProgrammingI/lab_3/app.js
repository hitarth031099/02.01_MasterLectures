const people = require("./people");
const stocks = require("./stocks");

async function main() {
    try {
        console.log(await people.getPersonByld("f04311f1-07e0-484f-b500-9d8401f986ec"));
    } catch (error) {
        console.error(error);
    }

    try {
        console.dir(await people.sameStreet("  sUtherLand  ", "  poInt  "),{"depth":null});
    } catch (error) {
        console.error(error);
    }

    try {
        console.log(await people.manipulateSsn());
    } catch (error) {
        console.error(error);
    }

    try {
        console.log(await people.sameBirthday());
    } catch (error) {
        console.error(error);
    }

    try {
        console.dir(await stocks.listShareholders(), { depth: null });
    } catch (error) {
        console.error(error);
    }

    try {
        console.log(await stocks.topShareholder('   Nuveen Floating Rate Income Fund'));
    } catch (error) {
        console.error(error);
    }

    try {
        console.dir(await stocks.listStocks("Grenville", "Pawelke"), { 'depth': null });
    } catch (error) {
        console.error(error);
    }

    try {
        console.dir(await stocks.getStockById("f652f797-7ca0-4382-befb-2ab8be914ff0"), { 'depth': null });
    } catch (error) {
        console.error(error);
    }
}

main();