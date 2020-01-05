function dollarTag(templateData) {
    let str = templateData[0];

    for (let i = 1; i < arguments.length; ++i) {
        const arg = arguments[i];

        str += '$' + String(arg) + '$';
        str += templateData[i];
    }

    return str;
}

const name = 'roi';

console.log(dollarTag`hello ${name}!`);