const hack = '\`; console.log("hacked!!!"); \`';
const str = `hello,
my name is roi,
${hack}
nice to meet you!`;

console.log(str);