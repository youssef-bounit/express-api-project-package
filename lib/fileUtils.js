const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'templates');

const readTemplate = (filename) => {
  const filePath = path.join(templatesDir, filename);
  return fs.existsSync(filePath)
    ? fs.readFileSync(filePath, 'utf-8')
    : '';
};

const writeFile = (filePath, content) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
};

module.exports = { readTemplate, writeFile };
