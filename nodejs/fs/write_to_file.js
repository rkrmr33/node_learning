const fs = require('fs');

const writable = fs.createWriteStream('./somefile.txt');

writable.once('open', () => {
    console.log('the file is ready to write to...');
});

writable.once('close', () => {
    console.log('the file stream has closed');
});

const status = writable.write('try to write this...');
console.log(`file writing succeeded? ${status}`);
