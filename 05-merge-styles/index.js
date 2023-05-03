const fs = require('fs/promises');
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const bundleFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function bundleStyles() {
  const dirents = await fs.readdir(stylesFolderPath, { withFileTypes: true });

  const cssFiles = dirents.filter((dirent) => path.extname(dirent.name) === '.css');

  let buffer = '';
  for (let dirent of cssFiles) {
    const filePath = path.join(stylesFolderPath, dirent.name);
    const data = await fs.readFile(filePath, 'utf-8');
    buffer += data;
  }

  await fs.writeFile(bundleFilePath, buffer);

  console.log('Styles bundled successfully!');
}

try {
  bundleStyles();
} catch (err) {
  console.error(`Error bundling styles: ${err}`);
}