const arrayUtils = require('./arrayUtils');
const stringUtils = require('./stringUtils');
const objUtiles = require('./objUtiles');

console.log(arrayUtils.average());
console.log(arrayUtils.average([[1, 3], [2, 4, 5]]));


console.log(arrayUtils.modeSquared());
console.log(arrayUtils.modeSquared([1, 1, 2, 2, 3, 3, 4]));


console.log(arrayUtils.medianElement());
console.log(arrayUtils.medianElement([2, 1, 1, 2])); //{1.5:3}


console.log(arrayUtils.merge());
console.log(arrayUtils.merge([1, 2, 3, 'g'], ['d', 'a', 's']));


console.log(stringUtils.sortString());
console.log(stringUtils.sortString('123 FOOdfasdfasd*@&*($&@$()) BAR!'));


console.log(stringUtils.replaceChar());
console.log(stringUtils.replaceChar("111111013111111", 7));


console.log(stringUtils.mashUp());
console.log(stringUtils.mashUp("Patrick", "Hill", "$"));


console.log(objUtiles.computeObjects());
console.log(objUtiles.computeObjects([{ 1: 1 }, { 2: 2 }], x => x * 2));


const third = { a: 2, b: { x: 7 } };
const fourth = { a: 3, b: { x: 7, y: 10 } };
console.log(objUtiles.commonKeys()); // {} 
console.log(objUtiles.commonKeys(third, fourth)); // {b: { x: 7}}


console.log(objUtiles.flipObject({}));
console.log(objUtiles.flipObject({ a: "2", b: 7, c: { x: 1 } }));
