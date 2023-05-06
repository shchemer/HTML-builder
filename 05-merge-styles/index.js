const fs = require('fs');
const path = require('path');
const bundle = path.join(__dirname, 'project-dist/bundle.css');
const stylesPath = path.join(__dirname, 'styles');
const writeStream = fs.createWriteStream(bundle);

fs.readdir(stylesPath, {withFileTypes: true}, (error, files) => {
  files.forEach(file => {
    if (!file.isDirectory() && path.extname(path.join(stylesPath, file.name)).replace('.', '') === 'css') {
      const readStream = fs.createReadStream(path.join(stylesPath, file.name), 'utf-8');
      readStream.on('data', data => {
        writeStream.write(`${data}\n`);
      });
    }
  });
});