const fs = require('fs').promises;
const path = require('path');
const source = path.join(__dirname, 'files');
const copy = path.join(__dirname, 'files-copy');

fs.stat(copy)
  .then(() => {
    freshFiles();
  })
  .catch(() => {
    fs.mkdir(copy);
    freshFiles();
  });

async function freshFiles() {
  await fs.readdir(copy)
    .then(async files => {
      if (files.length) {
        for (let file of files) {
          await fs.rm(path.join(copy, file), {force:true, recursive: true});
        }
      }
    });
  function addFiles(source, copy) {
    fs.readdir(source, {withFileTypes:true}).then(files => {
      files.forEach( file => {
        if (file.isDirectory()) {
          fs.mkdir(path.join(copy, file.name));
          addFiles(path.join(source, file.name), path.join(copy, file.name));
          return true;
        }
        fs.copyFile(path.join(source, file.name), path.join(copy, file.name));
      });
    });
  }
  addFiles(source, copy);
}