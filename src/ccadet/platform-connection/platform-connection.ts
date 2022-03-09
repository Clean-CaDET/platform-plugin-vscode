import * as https from 'https';
import axios, { AxiosInstance } from 'axios';
import { loadCode } from '../code-loader/code-loader';
import { ChallengeEvaluation } from './view-model/challenge-evaluation';
import { Learner } from './view-model/learner';

export class PlatformConnection {
    private httpTutor: AxiosInstance;
    private _activeLearnerId = 0;

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
                .then(response => {
                    let learner = new Learner(response.data);
                    this._activeLearnerId = learner.id;
                    return learner;
                })
                .then(resolve)
                .catch(reject);
        });
	}

    public getChallengeAnalysis(filePath: string, challengeId: number): Promise<ChallengeEvaluation> {
        if(!this._activeLearnerId) throw "Invalid student ID.";
        if(!challengeId) throw "Invalid challenge ID.";

        return new Promise((resolve, reject) => {
            loadCode(filePath)
            .then(sourceCode => this.sendChallenge(sourceCode, challengeId, this._activeLearnerId))
            .then(this.mapChallengeDTO)
            .then(resolve)
            .catch(reject);
        });
    }
    
    private sendChallenge(sourceCode: string[], assessmentEventId: number, _activeLearnerId: number) {
        let request = JSON.stringify({
            sourceCode: sourceCode,
            assessmentEventId: assessmentEventId,
            learnerId: _activeLearnerId
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

    public seekHelp(challengeId: number, typeOfHelp: string) {
        return new Promise((resolve, reject) => {
            this.httpTutor.post(
                typeOfHelp === 'solution' ? "plugin/challenge/solution" : "plugin/challenge/hints",
                JSON.stringify({
                    assessmentEventId: challengeId,
                    learnerId: this._activeLearnerId,
                }), {headers: {'Content-Type': 'application/json; charset=utf-8'}})
            .then(response => {
                resolve(response.data);
            })
            .catch(reject);
        });
    }
}