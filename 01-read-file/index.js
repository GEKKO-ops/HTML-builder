const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(filePath, 'utf8');


let data = '';

stream.on('data', chunk => console.log(data += chunk));

stream.on('error', error => console.log('Error', error.message));