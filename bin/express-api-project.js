#!/usr/bin/env node

const fs = require('fs')
const path = require('path');
const createStructure = require('../lib/createStructure');
const readline = require('readline');
const { exec } = require('child_process'); // To run shell commands

// Function to prompt for the project name
const promptForProjectName = () => {
    return new Promise(async (resolve) => {
        const { default: chalk } = await import('chalk'); // dynamic import for ES module

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question(chalk.green('Please Provide Project Name: '), (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
};

// Function to initialize a new npm project and install Express
const initializeProject = (projectDir, projectName) => {
    return new Promise((resolve, reject) => {
        // Step 1: Create package.json manually
        const packageJson = {
            name: projectName, // project name passed as an argument
            version: '1.0.0',
            description: '',
            main: 'index.js',
            scripts: {
                start: 'node index.js',
                dev: 'nodemon index.js',
                test: 'echo "Error: no test specified" && exit 1'
            },
            author: '',
            keywords: [],
            license: 'ISC'
        };

        // Write the package.json to the project directory
        const packageJsonPath = path.join(projectDir, 'package.json');
        fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                reject(`Error writing package.json: ${writeErr}`);
                return;
            }

            // Step 2: Install Express
            exec('npm install express nodemon dotenv mongodb', { cwd: projectDir }, (installErr, installOut, installStderr) => {
                if (installErr) {
                    reject(`Error installing Express: ${installStderr}`);
                } else {
                    resolve('Project initialized successfully with Express and custom scripts!');
                }
            });
        });
    });
};

// Main function to handle project creation
const main = async () => {
    const args = process.argv.slice(2);
    let targetDir = args[0];

    // If no target directory is provided, prompt the user
    if (!targetDir) {
        targetDir = await promptForProjectName();

        if (!targetDir) {
            console.error('Error: Project name is required!');
            process.exit(1); // Exit if no name is provided
        }
    }

    try {
        const absolutePath = path.resolve(targetDir);
        console.log(`Creating API structure in ${absolutePath}...`);

        createStructure(absolutePath);

        console.log('API structure created successfully!');

        // Initialize npm and install Express
        console.log('Initializing npm packages...');
        await initializeProject(absolutePath, targetDir);
        console.log('Packages installed successfully!');
    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Run the main function
main();
