// rename-images.js

const fs = require('fs');
const path = require('path');

// Customize these to your needs:
const inputDir = 'C:\\Users\\beaut\\Downloads\\original_images\\original_images';    // Folder containing images
const outputDir = inputDir + '\\output';   // Folder to write renamed images

// Make sure output directory exists; if not, create it
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

/**
 * Helper to generate a random 4-digit number as a string
 * Example result: '0723', '9999', '0123'
 */
function getRandomFourDigits() {
    // Generate a number [0..9999], pad with leading zeros to ensure 4 digits
    return String(Math.floor(Math.random() * 10000)).padStart(4, '0');
}

// Read input folder
fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        console.log(`Processing: ${file}`);
        const ext = path.extname(file).toLowerCase();

        // Adjust this list of extensions if you want more/less image types
        const validExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
        if (!validExtensions.includes(ext)) {
            return; // Skip non-image files
        }

        const randomFourDigits = getRandomFourDigits();
        // Construct new filename: avatar_####.ext
        const newFileName = `avatar_${randomFourDigits}${ext}`;

        // Build full paths
        const oldFilePath = path.join(inputDir, file);
        const newFilePath = path.join(outputDir, newFileName);

        // Copy file (use fs.rename for move instead of copy)
        fs.copyFile(oldFilePath, newFilePath, copyErr => {
            if (copyErr) {
                console.error(`Error copying file ${file} -> ${newFileName}:`, copyErr);
            } else {
                console.log(`Copied: ${file} -> ${newFileName}`);
            }
        });
    });
});
