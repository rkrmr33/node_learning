function buzz() {
	return new Promise((res, rej) => {
		setTimeout(() => {
			rej('success');
		}, 2000);
	});
}

async function foo() {
    try {
        const res = await buzz();   
    } catch (e) {
        console.error(`error: ${e}`);
    }
}

function fooPromise() {
    buzz()
        .then(res => {
            console.log(res);
        })
        .catch(e => {
            console.error(`error ${e}`);
        });
}

fooPromise()