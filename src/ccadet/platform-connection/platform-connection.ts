import * as https from 'https';
import axios, { AxiosInstance } from 'axios';
import { loadCode } from '../code-loader/code-loader';
import { ChallengeEvaluation } from './view-model/challenge-evaluation';

export class PlatformConnection {
    private httpTutor: AxiosInstance;

    constructor(baseUrl: string) {
        this.httpTutor = axios.create({
            baseURL: baseUrl,
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });
    }

    public getChallengeAnalysis(filePath: string, challengeId: number, studentId: string): Promise<ChallengeEvaluation> {
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
    
    private sendChallenge(sourceCode: string[], challengeId: number, traineeId: string) {
        let request = JSON.stringify({
            sourceCode: sourceCode,
            challengeId: challengeId,
            traineeId: traineeId
        });

        return new Promise((resolve, reject) => {
            this.httpTutor.post("challenge/evaluate-submission", request, {headers: {'Content-Type': 'application/json; charset=utf-8'}})
                .then(response => {
                    resolve(response.data);
                })
                .catch(reject);
        });
    }

    private mapChallengeDTO(json: any) {
        return new ChallengeEvaluation(json);
    }
}