const readline = require('readline');
const fs = require('fs');
const path = require('path');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const filename = path.join(__dirname, 'input.txt');
const writeStream = fs.createWriteStream(filename, { flags: 'w' });


console.log('Welcome! Type anything you want, or type "exit" to quit.');

rl.on('line', (input) => {
  if (input === 'exit') {
    console.log('Goodbye!');
    process.exit();
  } else {
    writeStream.write(input + '\n');
  }
});

rl.on('SIGINT', () => {
  writeStream.close();
  console.log('Goodbye!');
  process.exit();
});