const questionOne = function questionOne(arr) {
    // Implement question 1 here
    if (arr != null) {
        if (arr.length != 0) {
            let str = new String();
            str += '{';
            for (let i = 0; i < arr.length; i++) {
                let j = Math.abs(arr[i] * arr[i] - 7);
                let flag = true;
                for (let x = 2; x <= Math.sqrt(j); x++) {
                    if (j % x == 0) {
                        flag = false;
                        break;
                    }
                }
                str = str + '\'' + j + '\'' + ': ' + flag;
                if (i != arr.length - 1)
                    str = str + ', ';
            }
            str += '}';
            return str;
        } else return new Object();
    }
    else return new Object()
}

const questionTwo = function questionTwo(arr) {
    // Implement question 2 here
    let arr2 = new Array();

    if (arr.length != 0) {
        for (var i = 0; i < arr.length; i++) {
            if (arr2.indexOf(arr[i]) == -1) {
                arr2.push(arr[i]);
            }
        }
        return arr2;
    } else return arr2;


}

const questionThree = function questionThree(arr) {
    // Implement question 3 here
    if (arr.length == 0) return new Object();

    //console.log(arr);
    
    //delete duplicate string
    let arr2 = new Array();
    for (let i = 0; i < arr.length; i++) {
        if (arr2.indexOf(arr[i]) == -1) {
            arr2.push(arr[i]);
        }
    }
    //console.log(arr2);

    //sort each characters in a string, and delete duplicate characters
    let arr3 = new Array();
    for (let i = 0; i < arr2.length; i++) {
        let temp = new Set(Array.from(arr2[i]).sort());

        arr3.push(Array.from(temp).join(''));
    }
    //console.log(arr3);

    //find same string in arr3, and store in arr4
    let arr4 = new Array();
    for (let i = 0; i < arr3.length; i++) {
        if (arr3[i] == arr3[i + 1] && arr4.indexOf(arr[i]) == -1) {
            arr4.push(arr3[i]);
            i++;
        }
    }
    //console.log(arr4);
    
    let obj = new Object();
    arr4.forEach(element => {
        obj[element] = new Array();
        for (let i = 0; i < arr3.length; i++){
        if (arr3[i] == element) {
            obj[element].push(arr2[i]);
        }
    }
});

return obj;
}

const factorial = function factorial(num) {
    if (num <= 0) return 1;
    return factorial(num - 1) * num;
}

const questionFour = function questionFour(num1, num2, num3) {
    // Implement question 4 here
    let sum = factorial(num1) + factorial(num2) + factorial(num3);
    sum = sum * 3 / (num1 + num2 + num3);
    return parseInt(sum);
}

module.exports = {
    firstName: "YuFu",
    lastName: "Liao",
    studentId: "10478967",
    questionOne,
    questionTwo,
    questionThree,
    questionFour
};