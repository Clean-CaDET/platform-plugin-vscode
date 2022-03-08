import * as https from 'https';
import axios, { AxiosInstance } from 'axios';
import { loadCode } from '../code-loader/code-loader';
import { ChallengeEvaluation } from './view-model/challenge-evaluation';
import { Learner } from './view-model/learner';

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

    public loginUser(id: string): Promise<Learner> {
		return new Promise((resolve, reject) => {
            this.httpTutor.post("plugin/login", { studentIndex: id }, {headers: {'Content-Type': 'application/json; charset=utf-8'}})
                .then(this.mapLearnerDTO)
                .then(resolve)
                .catch(reject);
        });
	}
    mapLearnerDTO(response: any) {
        return new Learner(response.data);
    }

    public getChallengeAnalysis(filePath: string, challengeId: number, learnerId: number): Promise<ChallengeEvaluation> {
        if(!learnerId) throw "Invalid student ID.";
        if(!challengeId) throw "Invalid challenge ID.";

        return new Promise((resolve, reject) => {
            loadCode(filePath)
            .then(sourceCode => this.sendChallenge(sourceCode, challengeId, learnerId))
            .then(this.mapChallengeDTO)
            .then(resolve)
            .catch(reject);
        });
    }
    
    private sendChallenge(sourceCode: string[], assessmentEventId: number, learnerId: number) {
        let request = JSON.stringify({
            sourceCode: sourceCode,
            assessmentEventId: assessmentEventId,
            learnerId: learnerId
        });

        return new Promise((resolve, reject) => {
            this.httpTutor.post("plugin/challenge", request, {headers: {'Content-Type': 'application/json; charset=utf-8'}})
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