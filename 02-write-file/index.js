const fs = require('fs');
const readline = require('readline');
const path = require('path');
const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const helloPhrase = 'Привет, введи текст';
const goodByePhrase = 'Пока-пока';
console.log(helloPhrase);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', data => {
  if (data === 'exit') { process.exit(); }
  writeStream.write(`${data} \n`);
});

process.on('exit', () => {
  console.log(goodByePhrase);
});