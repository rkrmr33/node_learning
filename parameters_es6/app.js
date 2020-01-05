function myConcat(str1, str2 = str1) {
    return str1 + str2;
}

console.log(myConcat('roi')); // roiroi
console.log(myConcat('hello ', 'roi')); // hello roi
console.log(myConcat('roi', undefined)); // roiroi
