import * as https from 'https';
import axios from 'axios';
import { loadCode } from '../code-loader/code-loader';
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

        //TODO: Endpoint for sending challenge code.
        return new Promise((resolve, reject) => {
            loadCode(filePath)
            .then(this.sendCode)
            .then(this.mapDTO)
            .then(resolve)
            .catch(reject);
        });
    }

    public getQualityAnalysis(filePath: string): Promise<ClassQualityAnalysisDTO> {
        return new Promise((resolve, reject) => {
            loadCode(filePath)
            .then(this.sendCode)
            .then(this.mapDTO)
            .then(resolve)
            .catch(reject);
        });
        
    }

    private sendCode(sourceCode: any) {
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