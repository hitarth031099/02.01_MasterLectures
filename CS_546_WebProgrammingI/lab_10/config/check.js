// export default{
//     check
// }

module.exports ={
    check
}

function check(input, dataType) {
    switch (dataType) {
        case "username":
            if (input == undefined) return false;
            if (typeof (input) != "string") return false;
            input = input.trim();
            if (input.length == 0) return false;
            if (! /^[a-zA-Z0-9]{4,}$/.test(input)) return false;
            return input;
        case "password":
            if (input == undefined) return false;
            if (typeof (input) != "string") return false;
            if (input.length < 6) return false;
            if (/[ ]{1,}/.test(input)) return false;
            return input;
        default:
            return false;
    }
}
