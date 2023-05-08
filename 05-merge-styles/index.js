const path = require('path');
const fs = require('fs');

let source = path.join(__dirname, 'styles');
let target = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(source, (err, files) => {
    if (err) throw err;
    fs.writeFile(
        target,
        '',
        (err) => { if (err) throw err; }
    );
    files.forEach(file => {
        let filePath = path.join(source, file);
        fs.stat(filePath, (err, stats) => {
            if (err) throw err;
            if (stats.isFile() && path.extname(file) === '.css') {
                fs.readFile(filePath, (err, data) => {
                    if (err) throw err;
                    fs.appendFile(
                        target,
                        data,
                        (err) => { if (err) throw err; }
                    );
                });
            }
        });
    });
});