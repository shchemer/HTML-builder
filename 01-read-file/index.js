const fs = require('fs');
const path = require('path');
const readableStream = fs.createReadStream(path.join(__dirname,'text.txt'), 'utf-8');
readableStream.on('data', buffer => console.log(buffer));