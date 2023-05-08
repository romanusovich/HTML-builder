const path = require('path');
const fs = require('fs');

let actPath = path.join(__dirname, 'files');
let copyPath = path.join(__dirname, 'files-copy');

function copyDir(source, target) {
    fs.access(target, (err) => {
        if (!err) {
            fs.rm(target, { recursive: true, force: true }, (err) => {
                if (err) throw err;
                copyDir(source, target);
            });
        }
        fs.mkdir(target, { recursive: true }, (err) => { if (err) throw err });
    });

    fs.readdir(source, (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            let fileSource = path.join(source, file);
            let fileTarget = path.join(target, file);
            fs.stat(fileSource, (err, stats) => {
                if (err) throw err;
                if (stats.isFile()) fs.copyFile(fileSource, fileTarget, (err) => { if (err) throw err });
                else copyDir(fileSource, fileTarget);
            });
        });
    });
}
copyDir(actPath, copyPath);