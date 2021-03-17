import * as https from 'https';
import axios, { AxiosInstance } from 'axios';
import { loadCode } from '../code-loader/code-loader';
import { ClassQualityAnalysisDTO } from './dtos/class-quality-analysis-dto';
import { ChallengeResponseDTO } from './dtos/challenge-response-dto';

export class PlatformConnection {
    private httpAnalysis: AxiosInstance;
    private httpTutor: AxiosInstance;

    constructor() {
        this.httpAnalysis = axios.create({
            baseURL: "https://localhost:44325/api/",
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });
        this.httpTutor = axios.create({
            baseURL: "https://localhost:44333/api/",
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });
    }

    public getQualityAnalysis(filePath: string): Promise<ClassQualityAnalysisDTO> {
        return new Promise((resolve, reject) => {
            loadCode(filePath)
            .then(this.sendCodeForAnalysis)
            .then(this.mapQualityAnalysisDTO)
            .then(resolve)
            .catch(reject);
        });
        
    }

    private sendCodeForAnalysis(sourceCode: any) {
        let sc = JSON.stringify(sourceCode);

        return new Promise((resolve, reject) => {
            this.httpAnalysis.post("repository/education/class", sc, {headers: {'Content-Type': 'application/json; charset=utf-8'}})
                .then(response => {
                    resolve(response.data);
                })
                .catch(reject);
        });
    }

    private mapQualityAnalysisDTO(json: any) {
        return new ClassQualityAnalysisDTO(json);
    }

    public getChallengeAnalysis(filePath: string, challengeId: number, studentId: string): Promise<ChallengeResponseDTO> {
        if(!studentId) throw "Invalid student ID.";
        if(!challengeId) throw "Invalid challenge ID.";

        return new Promise((resolve, reject) => {
            loadCode(filePath)
            .then(sourceCode => this.sendChallenge(sourceCode, challengeId, studentId))
            .then(this.mapChallengeDTO)
            .then(resolve)
            .catch(reject);
        });
    }
    
    private sendChallenge(sourceCode: string[], challengeId: number, studentId: string) {
        //TODO: Request and Response DTOs and functions for mapping
        //TODO: As this class continues to grow (and we understand it better) look for opportunities to refactor.
        let request = JSON.stringify({
            sourceCode: sourceCode,
            challengeId: challengeId,
            studentId: studentId
        });

        return new Promise((resolve, reject) => {
            this.httpTutor.post("challenge/check", request, {headers: {'Content-Type': 'application/json; charset=utf-8'}})
                .then(response => {
                    resolve(response.data);
                })
                .catch(reject);
        });
    }

    private mapChallengeDTO(json: any) {
        return new ChallengeResponseDTO(json);
    }
}