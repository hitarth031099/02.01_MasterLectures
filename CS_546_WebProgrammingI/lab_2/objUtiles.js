module.exports = {
    description: 'objUtiles has three functions',
    computeObjects,
    commonKeys,
    flipObject
}

function checkUndefined(input) {
    if (input == null)
        throw new Error("Undefined");
}

function checkArray(input) {
    if (!Array.isArray(input))
        throw new Error("Not Array");
}

function checkArrayEmpty(input) {
    if (input.length == 0) throw new Error("Empty");
}

function checkObject(input) {
    if (Object.prototype.toString.call(input) != "[object Object]")
        throw new Error("Not Object");
}

function checkObjectEmpty(input) {
    if (JSON.stringify(input) == "{}")
        throw new Error("Object Empty");
}

function checkNumber(input) {
    if (isNaN(input)) throw new Error("Not number");
    if (typeof (input) != "number") throw new Error("Not number");
}

function checkFunction(input) {
    if (Object.prototype.toString.call(input) != "[object Function]")
        throw new Error("Not Function");
}

function computeObjects(input, input2) {
    try {
        checkUndefined(input);
        checkArray(input);
        checkArrayEmpty(input);

        input.forEach(element => {
            checkObject(element);
            checkObjectEmpty(element);
            let values = Object.values(element);
            values.forEach(element => {
                checkNumber(element);
            });
        });

        checkUndefined(input2);
        checkFunction(input2);

        let obj = new Object();
        input.forEach(element => {
            for (let key in element) {
                if (obj[key] == undefined) {
                    obj[key] = 0;
                }
                obj[key] += input2(element[key]);
            }
        });
        return obj;
    } catch (error) {
        return error + "";
    }
}

function checkKey(input) {
    if (input == undefined) throw new Error("key undefined");
    if (typeof (input) == "number") {
        if (isNaN(input)) {
            throw new Error("key NaN")
        }
    }
}

function checkValues(input) {
    if (input == undefined) throw new Error("value undefined");
    if (typeof (input) == "number") {
        if (isNaN(input)) {
            throw new Error("value NaN")
        }
    }

}

function commonKeys(input, input2) {
    try {
        checkUndefined(input);
        checkObject(input);
        let arr = Object.keys(input)
        let arr2 = Object.values(input);
        arr.forEach(element => {
            checkKey(element);
        });
        arr2.forEach(element => {
            checkValues(element);
        });

        checkUndefined(input2);
        checkObject(input2);
        arr = Object.keys(input2)
        arr2 = Object.values(input2);
        arr.forEach(element => {
            checkKey(element);
        });
        arr2.forEach(element => {
            checkValues(element);
        });

        let obj = new Object();

        for (let key in input) {
            if (input2[key] != undefined) {
                if (typeof (input[key]) == "object" && typeof (input2[key]) == "object") {
                    let a = input[key];
                    let b = input2[key]
                    for(let key2 in a){
                        if (a[key2] == b[key2]) {
                            if(obj[key]==undefined){
                                obj[key]=new Object();
                            }
                            let obj2=new Object();
                            obj2[key2]=a[key2];
                            obj[key]=obj2;
                        }
                    }
                }
                if (input[key] == input2[key]) {
                    obj[key]=input[key];
                }
            }
        }

        return obj
    } catch (error) {
        return error + "";
    }
}

function filp(input){
    let obj =new Object();
    for(let key in input){
        if(Array.isArray(input[key])){
            input[key].forEach(element => {
                obj[element]=key;
            });
            continue;
        }
        if(Object.prototype.toString.call(input[key]) == "[object Object]"){
            obj[key]=filp(input[key]);
            continue;
        }
        obj[input[key]]=key;
        
    }
    return obj;
}

function flipObject(input) {
    try {
        checkUndefined(input);
        checkObject(input);
        checkObjectEmpty(input);
        let arr = Object.keys(input)
        let arr2 = Object.values(input);
        arr.forEach(element => {
            checkKey(element);
        });
        arr2.forEach(element => {
            checkValues(element);
        });

        let obj =filp(input);

        return obj;
    } catch (error) {
        return error + "";
    }
}