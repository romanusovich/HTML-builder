const fs = require('fs');
const path = require('path');

const stream = new fs.ReadStream(path.join(__dirname, 'text.txt'));

stream.on('readable', () => {
    let data = stream.read();
    if (data !== null) console.log(data.toString());
});

stream.on('end', () => {
    stream.close();
});

stream.on('error', (err) => {
    if (err) throw err.message;
})