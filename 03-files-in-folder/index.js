const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'secret-folder');

fs.readdir(filePath, {withFileTypes: true}, (error, list) => {
  list.forEach(item => {
    if (!item.isDirectory()) {
      fs.stat(path.join(filePath, item.name), (error, stats) => {
        const fileInfo = path.parse(path.join(filePath, item.name));
        const fileSize = Math.ceil(stats.size / 1024);
        console.log(`${fileInfo.name} - ${fileInfo.ext.slice(1)} - ${fileSize}kb`);
      });
    }
  });
});