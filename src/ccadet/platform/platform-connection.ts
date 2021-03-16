import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import axios from 'axios';
import { ClassQualityAnalysisDTO } from './dtos/class-quality-analysis-dto';

const http = axios.create({
    baseURL: 'https://localhost:44325/api/',
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

export class PlatformConnection {
    public getChallengeAnalysis(filePath: string, challengeId: number, studentId: string | undefined): Promise<ClassQualityAnalysisDTO> {
        if(!challengeId) throw "Invalid challenge ID.";

        let normalizedPath = this.normalizeFilePath(filePath);
        //TODO: Endpoint for sending challenge code.
        return new Promise((resolve, reject) => {
            this.loadCode(normalizedPath)
            .then(this.sendCode)
            .then(this.mapDTO)
            .then(resolve)
            .catch(reject);
        });
    }

    public getQualityAnalysis(filePath: string): Promise<ClassQualityAnalysisDTO> {
        let normalizedPath = this.normalizeFilePath(filePath);

        return new Promise((resolve, reject) => {
            this.loadCode(normalizedPath)
            .then(this.sendCode)
            .then(this.mapDTO)
            .then(resolve)
            .catch(reject);
        });
        
    }

    private normalizeFilePath(classFilePath: string) {
        return classFilePath.substr(3); //dirty fix
    }

    private loadCode(filePath: string) {
        if(filePath.endsWith(".cs")) {
            return this.readCodeFromFile(filePath);
        }

        const getAllFiles = function (dirPath: string, arrayOfFiles: string[]) {
            let files = fs.readdirSync(dirPath);

            files.forEach(function (file) {
                let filePath = path.resolve(dirPath, file);
                if (fs.statSync(filePath).isDirectory()) {
                    arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
                } else if(filePath.endsWith(".cs")) arrayOfFiles.push(filePath);
            });

            return arrayOfFiles;
        }

        let files = getAllFiles(filePath, []);
        return Promise.all(files.map(this.readCodeFromFile))
    }

    private readCodeFromFile(filePath: string) {
        return new Promise((resolve, reject) => {
            fs.promises.readFile(filePath)
                .then(sourceCode => {
                    resolve(sourceCode.toString());
                })
                .catch(reject);
        });
    }

    private sendCode(sourceCode: any) {
        if(typeof sourceCode == 'string') sourceCode = [sourceCode];
        let sc = JSON.stringify(sourceCode);

        return new Promise((resolve, reject) => {
            http.post("repository/education/class", sc, {headers: {'Content-Type': 'application/json; charset=utf-8'}})
                .then(response => {
                    resolve(response.data);
                })
                .catch(reject);
        });
    }

    mapDTO(json: any) {
        return new ClassQualityAnalysisDTO(json);
    }
}