const lab1 = require("./lab1");

console.log(lab1.questionOne([5, 3, 10]));
//returns and outputs: {'18': false, '2': true, '93': false}
console.log(lab1.questionOne([2]));
// returns and outputs: {'3': true} 
console.log(lab1.questionOne([]));
// returns and outputs: {}
console.log(lab1.questionOne());
// returns and outputs: {}
console.log(lab1.questionOne([5]));
// returns and outputs: {'18': false}


console.log(lab1.questionTwo([1, 1, 1, 1, 1, 1]));
//returns and outputs: [1]
console.log(lab1.questionTwo([1, '1', 1, '1', 2]));
//returns and outputs: [1, '1', 2] 
console.log(lab1.questionTwo([3, 'a', 'b', 3, '1']));
//returns and outputs: [3, 'a', 'b', '1']
console.log(lab1.questionTwo([]));
//returns and outputs: []

console.log(lab1.questionTwo([3, 3]));
//returns and outputs: [ 3 ]
console.log(lab1.questionThree(["cat", "act", "foo", "bar"]));
//returns and outputs: { act: ["cat", "act"] }
console.log(lab1.questionThree(["race", "care", "foo", "foo", "foo"]));
//returns and outputs: { acer: ["race", "care"] } 
console.log(lab1.questionThree(["foo", "bar", "test", "Patrick", "Hill"]));
// returns and outputs: {}
console.log(lab1.questionThree(["abc","acb","bca"]));
// returns and outputs: { abc: [ 'abc', 'acb', 'bca' ] }
console.log(lab1.questionThree(["race", "care", "foo", "foo", "foo", "cat", "act", "foo", "bar"]));
// returns and outputs: { acer: [ 'race', 'care' ], act: [ 'cat', 'act' ] }


console.log(lab1.questionFour(1, 3, 2)); 
//returns and outputs: 4
console.log(lab1.questionFour(4, 5, 6)); 
//returns and outputs: 172 
console.log(lab1.questionFour(7, 8, 9)); 
//returns and outputs: 51030 
console.log(lab1.questionFour(10, 2, 1)); 
//returns and outputs: 837416 
console.log(lab1.questionFour(6, 1, 2)); 
//returns and outputs: 241 
