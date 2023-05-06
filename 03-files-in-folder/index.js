const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'secret-folder');

fs.readdir(filePath, {withFileTypes: true}, (error, list) => {
  list.forEach(item => {
    if (!item.isDirectory()) {
      fs.stat(path.join(filePath, item.name), (error, stats) => {
        const fileName = item.name.slice(0, item.name.lastIndexOf('.'));
        const fileExt = path.extname(path.join(filePath, item.name)).replace('.', '');
        const fileSize = Math.ceil(stats.size / 1024);
        console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
      });
    }
  });
});