module.exports = {
    description: 'stringUtils has three functions',
    sortString,
    replaceChar,
    mashUp
}

function checkUndefined(input) {
    if (input == null) throw new Error("Undefined");
}

function checkString(input) {
    if (typeof (input) != "string") throw new Error("Not String");
}

function checkStringEmpty(input) {
    if (input.length == 0) throw new Error("Empty String");
}

function checkStringAllSpace(input) {
    let count = 0;
    for (let i = 0; i < input.length; i++) {
        if (input[i] == " ") {
            count++;
        }
    }
    if (count == input.length) {
        throw new Error("String is All Space");
    }
    return;
}

function sortString(input) {
    try {
        checkUndefined(input);
        checkString(input);
        checkStringEmpty(input);
        checkStringAllSpace(input);

        let upchar = new Array();
        let lowchar = new Array();
        let num = new Array();
        let space = new Array();
        let other = new Array();

        for (let i = 0; i < input.length; i++) {
            if (input[i] >= "a" && input[i] <= "z") {
                lowchar.push(input[i]);
                continue;
            }
            if (input[i] >= "A" && input[i] <= "Z") {
                upchar.push(input[i]);
                continue;
            }
            if (input[i] >= "0" && input[i] <= "9") {
                num.push(input[i]);
                continue;
            }
            if (input[i] == " ") {
                space.push(input[i]);
                continue;
            }
            other.push(input[i]);
        }
        upchar.sort();
        lowchar.sort();
        num.sort();
        space.sort();
        other.sort();
        let sort = "";
        sort += upchar.join("");
        sort += lowchar.join("");
        sort += other.join("");
        sort += num.join("");
        sort += space.join("");
        return sort;
    } catch (error) {
        return error + ""
    }

}

function checkNumber(input) {
    if (typeof (input) != "number") throw new Error("Not number");
}

function checkPositive(input) {
    if (input < 0) throw new Error("Not > =0");
    if (isNaN(input)) throw new Error("NaN");
}

function replaceChar(input, input2) {
    try {
        checkUndefined(input);
        checkString(input);
        checkStringEmpty(input);
        checkStringAllSpace(input);

        checkUndefined(input2);
        checkNumber(input2);
        checkPositive(input2);

        if (input2 > (input.length - 2) || input2 == 0) {
            throw new Error("index is invaild");
        }

        let indexchar = input[input2];
        let char = new Array();
        char.push(input[input2 - 1]);
        char.push(input[input2 + 1]);
        let change = new Array();
        for (let i = 0; i < input.length; i++) {
            if (indexchar == input[i]) {
                if (i != input2) {
                    change.push(i);
                }
            }
        }
        change.forEach((element, index) => {
            input = input.substring(0, element) + char[index % 2] + input.substring(element + 1);
        });

        let str = new String();
        str = input;
        return str;
    } catch (error) {
        return error + ""
    }

}

function mashUp(input, input2, input3) {
    try {
        checkUndefined(input);
        checkString(input);
        checkStringEmpty(input);
        checkStringAllSpace(input);

        checkUndefined(input2);
        checkString(input2);
        checkStringEmpty(input2);
        checkStringAllSpace(input2);

        checkUndefined(input3);
        checkString(input3);
        checkStringEmpty(input3);
        checkStringAllSpace(input3);

        if (input3.length != 1) {
            throw new Error("not char");
        }

        let max = Math.max(input.length, input2.length);
        let min = Math.min(input.length, input2.length);

        let arr = new Array();
        for (let i = 0; i < min; i++) {
            arr.push(input[i]);
            arr.push(input2[i]);
        }
        if (max != min) {
            for (let i = min; i < max; i++) {
                arr.push(input.length == min ? input3 : input[i]);
                arr.push(input2.length == min ? input3 : input2[i]);
            }
        }

        return arr.join("");
    } catch (error) {
        return error + ""
    }

}