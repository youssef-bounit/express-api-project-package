const fs = require('fs');
const path = require('path');
const { readTemplate, writeFile } = require('./fileUtils');

// Define the structure once
const structure = {
    src: {
        controllers: {
            'welcome.controller.js': '// Welcome controller logic here',
        },
        routes: {
            'router.js': '// Main router file',
            'welcome.routes.js': '// Welcome routes logic here',
        },
        models: {
            'welcome.model.js': '// Welcome model logic here',
        },
        middlewares: {
            'welcome.middleware.js': '// Welcome middleware logic here',
        },
        config: {
            'db.js': '// DB configuration here'
        },
        services: {
            'welcome.service.js': '// Welcome service logic here',
        }
    },
    'index.js': '// Entry point of the application',
    '.env': '',
};

// Function to create directory structure and files
const createStructure = (dir, structureObj) => {
    for (const [key, value] of Object.entries(structureObj)) {
        const target = path.join(dir, key);

        if (typeof value === 'object' && value !== null) {
            // Create a directory
            if (!fs.existsSync(target)) {
                fs.mkdirSync(target, { recursive: true });
            }
            // Recursively create the directory structure
            createStructure(target, value);
        } else {
            // Handle files and write content to files
            let content;

            if (key === 'index.js') {
                content = readTemplate('index.template');
            } else if (key === '.env') {
                content = readTemplate('env.template');
            } else if (key === 'welcome.controller.js') {
                content = readTemplate('controller.template');
            } else if (key === 'router.js') {
                content = readTemplate('router.template');
            } else if (key === 'welcome.routes.js') {
                content = readTemplate('routes.template');
            } else if (key === 'db.js') {
                content = readTemplate("db.template");
            } else {
                content = value; // Use the provided content
            }

            writeFile(target, content);
        }
    }
};
// Entry point for creating the structure
const initStructure = (targetDir) => {
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    createStructure(targetDir, structure);
};

module.exports = initStructure;
