import { ChallengeHint } from "./challenge-hint";


export class ChallengeEvaluation {
    public challengeId: number;
    public challengeCompleted: boolean;
    public applicableHints: ChallengeHint[];

    constructor(obj?: any) {
        this.challengeId = obj && obj.challengeId || null;
        this.challengeCompleted = obj && obj.challengeCompleted;
        this.applicableHints = obj && obj.applicableHints?.map((h: any) => new ChallengeHint(h)) || null;
    }
}