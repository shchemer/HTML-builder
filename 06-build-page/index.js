const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const dist = path.join(__dirname, 'project-dist');
const mainPage = 'template.html';
const mainStyle = 'style.css';
const componentsPath = 'components';
const stylesPath = 'styles';
const assetsPath = 'assets';

fsPromises.stat(dist)
  .then(() => {
    configureDist();
  })
  .catch(() => {
    fsPromises.mkdir(dist);
    configureDist();
  });

function configureDist() {
  fsPromises.copyFile(path.join(__dirname, mainPage), path.join(dist, mainPage));
  changeTags();
  configureStyle();
  copyAssets();
}

function changeTags() {
  fs.createReadStream(path.join(dist, mainPage), 'utf-8').on('data', template => {
    fsPromises.readdir(path.join(__dirname, componentsPath), {withFileTypes: true}).then(files => {
      files.forEach(file => {
        const templateWrite = fs.createWriteStream(path.join(dist, mainPage));
        if (!file.isDirectory() && path.extname(path.join(__dirname, componentsPath, file.name)).replace('.', '') === 'html') {
          fs.createReadStream(path.join(__dirname, componentsPath, file.name), 'utf-8').on('data', component => {
            const fileName = file.name.slice(0, file.name.lastIndexOf('.'));
            template = template.replace(`{{${fileName}}}`, component);
            templateWrite.write(template);
          });
        }
      });
    });
  });
}

function configureStyle() {
  const mainStyleWrite = fs.createWriteStream(path.join(dist, mainStyle));
  fsPromises.readdir(path.join(__dirname, stylesPath), {withFileTypes: true}).then(files => {
    files.forEach(file => {
      if (!file.isDirectory() && path.extname(path.join(__dirname, stylesPath, file.name)).replace('.', '') === 'css') {
        const style = fs.createReadStream(path.join(__dirname, stylesPath, file.name), 'utf-8');
        style.on('data', data => {
          mainStyleWrite.write(`${data}`);
        });
      }
    });
  });
}

function copyAssets() {
  const source = path.join(__dirname, assetsPath);
  const copy = path.join(dist, assetsPath);

  fsPromises.stat(copy)
    .then(() => {
      freshFiles();
    })
    .catch(() => {
      fsPromises.mkdir(copy);
      freshFiles();
    });

  async function freshFiles() {
    await fsPromises.readdir(copy)
      .then(async files => {
        if (files.length) {
          for (let file of files) {
            await fsPromises.rm(path.join(copy, file), {force:true, recursive: true});
          }
        }
      });
    function addFiles(source, copy) {
      fsPromises.readdir(source, {withFileTypes:true}).then(files => {
        files.forEach( file => {
          if (file.isDirectory()) {
            fsPromises.mkdir(path.join(copy, file.name));
            addFiles(path.join(source, file.name), path.join(copy, file.name));
            return true;
          }
          fsPromises.copyFile(path.join(source, file.name), path.join(copy, file.name));
        });
      });
    }
    addFiles(source, copy);
  }
}
