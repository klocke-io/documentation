

// Directories to ignore
import { promises as fs } from "fs";
import path from "path";

const ignoreDirs = ['node_modules', '.git', 'dist', 'build'];

// Function to recursively search directories
async function findFiles(directory) {
    let foundFiles = [];

    try {
        const regex = /^[A-Z].*\.(png|jpg|svg)$/;
        const files = await fs.readdir(directory);

        for (const file of files) {
            const fullPath = path.join(directory, file);

            try {
                const stats = await fs.stat(fullPath);

                if (stats.isDirectory()) {
                    // Skip ignored directories
                    if (ignoreDirs.includes(file)) {
                        continue;
                    }
                    // Recursively search subdirectories
                    const nestedFiles = await findFiles(fullPath);
                    foundFiles = foundFiles.concat(nestedFiles);
                } else if (stats.isFile()) {
                    // Check if the filename matches our pattern
                    if (regex.test(file)) {
                        foundFiles.push(fullPath);
                    }
                }
            } catch (err) {
                console.error(`Error accessing ${fullPath}: ${err.message}`);
            }
        }
    } catch (err) {
        console.error(`Error reading directory ${directory}: ${err.message}`);
    }

    return foundFiles;
}

// Function to rename a file to lowercase
async function renameToLowercase(filePath) {
    try {
        const directory = path.dirname(filePath);
        const fileName = path.basename(filePath);
        const lowerCaseFileName = fileName.toLowerCase();
        const newPath = path.join(directory, lowerCaseFileName);
        
        // Only rename if the filename is different in lowercase
        if (fileName !== lowerCaseFileName) {
            await fs.rename(filePath, newPath);
            console.log(`Renamed: ${fileName} → ${lowerCaseFileName}`);
            return {
                original: filePath,
                renamed: newPath,
                success: true
            };
        } else {
            return {
                original: filePath,
                renamed: null,
                success: false,
                reason: "Already lowercase"
            };
        }
    } catch (err) {
        console.error(`Error renaming ${filePath}: ${err.message}`);
        return {
            original: filePath,
            renamed: null,
            success: false,
            reason: err.message
        };
    }
}

// Main function
async function main() {
    const startDir = process.argv[2] || '.';
    console.log(`Searching for image files starting with capital letters in: ${startDir}`);

    try {
        const matchingFiles = await findFiles(startDir);

        console.log('\nMatching files:');
        matchingFiles.forEach(file => console.log(`- ${file}`));
        console.log(`\nTotal: ${matchingFiles.length} files found`);
        
        // Ask for confirmation before renaming
        if (matchingFiles.length > 0) {
            const shouldRename = process.argv.includes('--rename') || process.argv.includes('-r');
            
            if (shouldRename) {
                console.log('\nRenaming files to lowercase...');
                const renameResults = [];
                
                for (const file of matchingFiles) {
                    const result = await renameToLowercase(file);
                    renameResults.push(result);
                }
                
                const successCount = renameResults.filter(r => r.success).length;
                console.log(`\nRename summary: ${successCount} of ${matchingFiles.length} files renamed successfully.`);
            } else {
                console.log('\nTo rename these files to lowercase, run the script with the --rename or -r flag:');
                console.log(`node post-processing.js ${startDir} --rename`);
            }
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

main();