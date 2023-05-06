const fs = require('fs');
const path = require('path');
const source = path.join(__dirname, 'files');
const copy = path.join(__dirname, 'files-copy');

fs.mkdir(copy, {recursive: true}, error => {
  if (error) console.log(error);
});

fs.readdir(source, (error, files) => {
  files.forEach(item => {
    fs.copyFile(path.join(source, item), path.join(copy, item), error => {
      if (error) console.log(error);
    });
  });
});