const path = require('path');
const fs = require('fs');

let assetsPath = path.join(__dirname, 'assets');
let componentsPath = path.join(__dirname, 'components');
let stylesPath = path.join(__dirname, 'styles');
let targetPath = path.join(__dirname, 'project-dist');

fs.access(targetPath, (err) => {
    // Create index.html file
    if (err) fs.mkdir(targetPath, (err) => { if (err) throw err; });
    fs.readFile(path.join(__dirname, 'template.html'), (err, index) => {
        if (err) throw err;
        let indexString = index.toString();
        fs.readdir(componentsPath, (err, files) => {
            if (err) throw err;
            files.forEach(file => {
                let indexTemplate = file.slice(0, -path.extname(file).length);
                let input = fs.createReadStream(path.join(componentsPath, file));
                let output = fs.createWriteStream(path.join(targetPath, 'index.html'));
                input.on('data', (data) => {
                    indexString = indexString.replace(`{{${indexTemplate}}}`, data.toString());
                    output.write(indexString);
                });
            });
        });
    });

    // Create style.css file
    fs.readdir(stylesPath, (err, files) => {
        if (err) throw err;
        fs.writeFile(
            path.join(targetPath, 'style.css'),
            '',
            (err) => { if (err) throw err; }
        );
        files.forEach(file => {
            let filePath = path.join(stylesPath, file);
            fs.stat(filePath, (err, stats) => {
                if (err) throw err;
                if (stats.isFile() && path.extname(file) === '.css') {
                    fs.readFile(filePath, (err, data) => {
                        if (err) throw err;
                        fs.appendFile(
                            path.join(targetPath, 'style.css'),
                            data,
                            (err) => { if (err) throw err; }
                        );
                    });
                }
            });
        });
    });

    // Copy assets directory
    copyDir(assetsPath, path.join(targetPath, 'assets'));
    function copyDir(source, target) {
        fs.access(target, (err) => {
            if (err) fs.mkdir(target, { recursive: true }, (err) => { if (err) throw err; });
            fs.readdir(source, (err, files) => {
                if (err) throw err;
                files.forEach(file => {
                    let sourceFile = path.join(source, file);
                    let targetFile = path.join(target, file);
                    fs.stat(sourceFile, (err, stats) => {
                        if (err) throw err;
                        if (stats.isFile())
                            fs.copyFile(
                                sourceFile,
                                targetFile,
                                (err) => { 
                                    if (err) throw err; 
                                });
                        else copyDir(sourceFile, targetFile);
                    });
                });
            });
        });
    }
});