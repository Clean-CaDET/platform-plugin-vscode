import * as fs from 'fs';
import * as path from 'path';

export function loadCode(filePath: string): Promise<string[]> {
    filePath = normalizeFilePath(filePath);

    if (filePath.endsWith(".cs")) {
        return readCodeFromFile(filePath)
            .then(sourceCode => {
                return [sourceCode];
            });
    }

    const getAllFiles = function (dirPath: string, arrayOfFiles: string[]) {
        let files = fs.readdirSync(dirPath);

        files.forEach(function (file) {
            let filePath = path.resolve(dirPath, file);
            if (fs.statSync(filePath).isDirectory()) {
                arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
            } else if (filePath.endsWith(".cs")) arrayOfFiles.push(filePath);
        });

        return arrayOfFiles;
    }

    let files = getAllFiles(filePath, []);
    return Promise.all(files.map(readCodeFromFile))
}

function normalizeFilePath(filePathWithPrefix: string) {
    if(process.platform === "win32") return filePathWithPrefix.substr(3); //dirty fix
    return filePathWithPrefix;
}

function readCodeFromFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.promises.readFile(filePath)
            .then(sourceCode => {
                resolve(sourceCode.toString());
            })
            .catch(reject);
    });
}