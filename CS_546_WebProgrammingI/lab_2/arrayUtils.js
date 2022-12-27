module.exports = {
    description: 'arraryUtiles has four functions',
    average,
    modeSquared,
    medianElement,
    merge
}


function checkUndefined(input) {
    if (input == null) throw new Error("Undefined");
}

function checkArray(input) {
    if (!Array.isArray(input)) throw new Error("Not Array");
}

function checkArrayEmpty(input) {
    if (input.length == 0) throw new Error("Empty");
}

function checkNumber(input) {
    if (isNaN(input)) throw new Error("Not Number");
}

function average(input) {
    try {
        checkUndefined(input);
        checkArray(input);
        checkArrayEmpty(input);

        input.forEach(element => {
            checkArray(element);
            checkArrayEmpty(element);
            element.forEach(element => {
                checkNumber(element);
            });
        });

        let sum = 0;
        let count = 0;
        input.forEach(element => {
            element.forEach(element => {
                sum += element;
                count++;
            });
        });
        return Math.round(sum / count);
    } catch (error) {
        return error + "";
    }
}

function modeSquared(input) {
    try {
        checkUndefined(input);
        checkArray(input);
        checkArrayEmpty(input);

        input.forEach(element => {
            checkNumber(element);
        });

        let obj = new Object();
        let max = 0;
        input.forEach(element => {
            if (obj[element] == undefined) {
                obj[element] = 0;
            } else {
                obj[element]++;
                if (obj[element] > max) {
                    max = obj[element];
                }
            }
        });
        let sum = 0
        for (let key in obj) {
            if (obj[key] == max) {
                sum += key * key;
            }
        }
        return sum;
    } catch (error) {
        return error + "";
    }
}

function medianElement(input) {
    try {
        checkUndefined(input);
        checkArray(input);
        checkArrayEmpty(input);
        input.forEach(element => {
            checkNumber(element);
        });

        let median = 0;
        let index = 0;

        let arr = Array.from(input);
        arr.sort();

        if (input.length % 2 == 1) {
            median = arr[(arr.length - 1) / 2]
            index = input.indexOf(median);
        } else {
            median = (arr[arr.length / 2] + arr[arr.length / 2 - 1]) / 2;
            let obj = {};
            input.forEach((element, index) => {
                if (obj[element] == undefined) {
                    obj[element] = new Array();
                } else {
                    obj[element].push(index);
                }
            });
            index = obj[arr[arr.length / 2]].pop();
        }
        let obj = {}
        obj[median] = index;
        return obj;

    } catch (error) {
        return error + "";
    }

}

function checkNaNChar(input) {
    if (input == null) {
        throw new Error("Not a number or Not an char");
    }
    if(input == " "){
        throw new Error("Not a number or Not an char");
    }
    if(!isNaN(input)){
        return ;
    }
    if(typeof(input)== "string" && input.length==1){
        if((input<="z"&&input>="a")||(input<="Z"&&input>="A")){
            return ;
        }
    }
    throw new Error("Not a number or Not an char");

}

function merge(input, input2) {
    try {
        checkUndefined(input);
        checkArray(input);
        checkArrayEmpty(input);
        checkUndefined(input2);
        checkArray(input2);
        checkArrayEmpty(input2);
        input.forEach(element => {
            checkNaNChar(element);
        });
        input2.forEach(element => {
            checkNaNChar(element);
        });

        let lowchar=new Array();
        let upchar=new Array();
        let num=new Array();
        
        input.forEach(element => {
            if(!isNaN(element)){
                num.push(element);
            }
            if(element<="z"&&element>="a"){
                lowchar.push(element);
            }
            if(element<="Z"&&element>="A"){
                upchar.push(element);
            }
        });
        input2.forEach(element => {
            if(!isNaN(element)){
                num.push(element);
            }
            if(element<="z"&&element>="a"){
                lowchar.push(element);
            }
            if(element<="Z"&&element>="A"){
                upchar.push(element);
            }
        });
        lowchar.sort();
        upchar.sort();
        num.sort();
        let merge=new Array();
        lowchar.forEach(element => {
            merge.push(element);
        });
        upchar.forEach(element => {
            merge.push(element);
        });
        num.forEach(element => {
            merge.push(element);
        });
        return merge;
    } catch (error) {
        return error + "";
    }
}