const dgram = require('dgram');
const { promisify } = require('util');

async function start(remote) {
    const PORT = process.env.PORT || 8081;
    const HOST = process.env.HOST || 'localhost';

    const socket = dgram.createSocket('udp4');

    const bind = promisify(socket.bind).bind(socket);
    const connect = promisify(socket.connect).bind(socket);
    const send = promisify(socket.send).bind(socket);

    socket.on('error', (err) => {
        console.error(err);
        socket.close();
    });

    socket.on('message', (msg, rinfo) => {
        const secToResp = 3;
        let curCount = secToResp;
        const respMsg = 'ping';

        console.log(`got message from ${rinfo.address}:${rinfo.port}: ${msg}`);
        console.log(`responding with '${respMsg}' in:`);

        const interval = setInterval(async () => {
            if (curCount > 0) {
                console.log(`${curCount}...`);
                curCount -= 1;
            } else {
                clearInterval(interval);
                await send(respMsg);
                console.log('response sent!');
            }
        }, 1000);
    });

    // bind socket
    await bind(PORT, HOST);
    console.log(`socket is bound to ${HOST}:${PORT}`);

    await connect(remote.port, remote.address);
    console.log(`connected to remote host: ${remote.address}:${remote.port}`);

    await send('ping');
    console.log('sent ping to remote host');
}

start({ port: 8080, address: 'localhost' }).catch(console.error);
