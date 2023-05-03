const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function declaration () {
  const dirents = await fs.readdir(folderPath, { withFileTypes: true });
  for (let dirent of dirents) {
    if (dirent.isFile()) {
      const filePath = path.join(folderPath, dirent.name);
      const ext = path.extname(dirent.name);
      const name = path.parse(filePath).name;
      const stats = await   fs.stat(filePath);
      console.log(`${name} - ${ext.slice(1)} - ${stats.size}b`);
    }
  }
}

try {
  declaration();
} catch (err) {
  console.error(`Error reading folder: ${err}`);
}