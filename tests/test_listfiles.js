const fs = require('fs');
const path = require('path');

function listFiles(dir, relativePath = '') {
    try {
        const files = fs.readdirSync(dir);
        const fileList = [];

        files.forEach(file => {
            const fullPath = path.join(dir, file);
            const relativeFilePath = path.join(relativePath, file);
            const stats = fs.statSync(fullPath);

            if (stats.isDirectory()) {
                // Recursively list files in subdirectories
                fileList.push(...listFiles(fullPath, relativeFilePath));
            } else if (stats.isFile()) {
                fileList.push('/images/avatar/' + relativeFilePath);
            }
        });

        return fileList;
    } catch (err) {
        console.error(`Error reading directory: ${dir}`, err);
        return []; // Return empty array in case of error
    }
}

function getFileListAsJSON(directory) {
    const files = listFiles(directory);
    return JSON.stringify(files, null, 2); // Use stringify with indentation for better readability
}


// Get the directory from command line arguments or use the current directory as default
const directory = "C:\\Users\\beaut\\Downloads\\original_images\\original_images\\output";//process.argv[2] || '.';

const jsonOutput = getFileListAsJSON(directory);

if (jsonOutput) {
    console.log(jsonOutput);
} else {
    console.error("Could not generate file list.");
}


// Example usage (if you want to write to a file):
/*
const outputFilename = 'file_list.json';
fs.writeFileSync(outputFilename, jsonOutput);
console.log(`File list written to ${outputFilename}`);
*/
