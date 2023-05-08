const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const stream = new fs.WriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Write something:\n');

stdin.on('data', data => {
    let msg = data.toString();
    if (msg.replaceAll('\r\n', '') === "exit") process.exit();
    else stream.write(msg);
});

process.on('exit', () => {
    stdout.write('\nGood luck!\n');
    stream.close();
});

stream.on('error', (err) => { throw err.message; })

process.on('SIGINT', () => {
    process.exit();
});