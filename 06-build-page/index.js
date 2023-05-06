const fs = require('fs').promises;
const path = require('path');


const buildFolder = 'project-dist';

// пути к исходным файлам
const templatePath = path.join(__dirname, 'template.html');
const stylesPath = path.join(__dirname, 'styles');
const componentsPath = path.join(__dirname, 'components');
const assetsPath = path.join(__dirname, 'assets');

// пути к файлам для сборки
const indexHtmlPath = path.join(__dirname, buildFolder, 'index.html');
const stylesBuilderPath = path.join(__dirname, buildFolder, 'style.css');
const assetsBuilderPath = path.join(__dirname, buildFolder, 'assets');

// функция для копирования директории
async function copyDir(source, target) {
  try {
    await fs.access(source);
    await fs.mkdir(target, { recursive: true });
    const files = await fs.readdir(source, { withFileTypes: true });
    for (const file of files) {
      const sourcePath = path.join(source, file.name);
      const targetPath = path.join(target, file.name);
      if (file.isDirectory()) {
        await copyDir(sourcePath, targetPath);
      } else {
        await fs.copyFile(sourcePath, targetPath);
      }
    }
  } catch (err) {
    console.error(`Error copying directory: ${err}`);
  }
}

// функция для замены шаблонных тегов в файле
async function replaceTemplateTags(filePath, components) {
  try {
    const template = await fs.readFile(filePath, 'utf-8');
    const sections = template.match(/{{\w+}}/g);
  
    let fileData = template;
    for (let section of sections) {
      const name = section.slice(2, -2);
      const componentFilePath = path.join(components, `${name}.html`);
      const componentHtml = await fs.readFile(componentFilePath, 'utf-8');
      fileData = fileData.replace(section, componentHtml);
    }
  


    return fileData;

  } catch (err) {
    console.error(`Error replacing template tags: ${err}`);
  }
}

// функция для сборки стилей
async function bundleStyles() {
  try {
    const dirents = await fs.readdir(stylesPath, { withFileTypes: true });
    const cssFiles = dirents.filter((dirent) => dirent.isFile() && path.extname(dirent.name) === '.css');
    let buffer = '';
    for (const dirent of cssFiles) {
      const filePath = path.join(stylesPath, dirent.name);
      const data = await fs.readFile(filePath, 'utf-8');
      buffer += data;
    }
    await fs.writeFile(stylesBuilderPath, buffer);
    console.log('Styles bundled successfully!');
  } catch (err) {
    console.error(`Error bundling styles: ${err}`);
  }
}

// функция для сборки проекта
async function buildProject() {
  try {
    // создание папки для сборки
    await fs.mkdir(buildFolder, { recursive: true });

    // копирование директории assets
    await copyDir(assetsPath, assetsBuilderPath);
    await bundleStyles();

    // чтение файла шаблона и замена тегов
    const indexHtmlData = await replaceTemplateTags(templatePath, componentsPath);

    // запись файла index.html
    await fs.writeFile(indexHtmlPath, indexHtmlData);

    console.log('Project built successfully!');
  } catch (err) {
    console.error(`Error building project: ${err}`);
  }
}

buildProject();
