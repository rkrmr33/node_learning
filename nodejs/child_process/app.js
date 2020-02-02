const { spawn } = require('child_process');
const { PassThrough } = require('stream');

const pipe = new PassThrough();
const proc1 = spawn('ls', ['-la', '.'], {
    cwd: '/usr/bin',
    stdio: ['ignore', 'pipe', 'ignore'],
});

proc1.stdout.pipe(pipe);

const proc2 = spawn('cat', {
    stdio: ['pipe', 'inherit', 'pipe'],
});

pipe.pipe(proc2.stdin);
