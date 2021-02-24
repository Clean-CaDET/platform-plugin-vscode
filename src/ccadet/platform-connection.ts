import * as fs from 'fs';
import * as https from 'https';
import axios from 'axios';
const http = axios.create({
    baseURL: 'https://localhost:44325/api/',
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

export class PlatformConnection {
    public getClassQualityAnalysis(classFilePath: string) {
        let normalizedPath = this.normalizeFilePath(classFilePath);

        return new Promise((resolve, reject) => {
            this.loadCode(normalizedPath)
            .then(this.sendCode)
            .then(resolve)
            .catch(reject);
        });
        
    }

    private normalizeFilePath(classFilePath: string) {
        return classFilePath.substr(3); //dirty fix
    }

    private loadCode(filePath: string) {
        return new Promise((resolve, reject) => {
            fs.promises.readFile(filePath)
                .then(sourceCode => resolve(sourceCode))
                .catch(err => reject(err));
        });
    }

    private sendCode(sourceCode: any) {
        let sc = JSON.stringify(sourceCode.toString());

        return new Promise((resolve, reject) => {
            http.post("repository/education/class", sc, {headers: {'Content-Type': 'application/json; charset=utf-8'}})
                .then(response => {
                    resolve(response.data);
                })
                .catch(reject);
        });
    }
}