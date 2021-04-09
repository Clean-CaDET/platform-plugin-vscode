import { convert } from "../mappers/learning-object-mapper";
import { ChallengeHint } from "./challenge-hint";
import { LearningObject } from "./learning-object";


export class ChallengeEvaluation {
    public challengeId: number;
    public challengeCompleted: boolean;
    public applicableHints: ChallengeHint[];
    public solution: LearningObject;

    constructor(obj?: any) {
        this.challengeId = obj && obj.challengeId || null;
        this.challengeCompleted = obj && obj.challengeCompleted;
        this.applicableHints = obj && obj.applicableHints?.map((h: any) => new ChallengeHint(h)) || null;
        this.solution = obj && obj.solutionLO && convert(obj.solutionLO) || null;
    }
}