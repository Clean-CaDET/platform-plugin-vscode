import { ChallengeHint } from "./challenge-hint";

export class ChallengeEvaluation {
    public challengeId: number;
    public challengeCompleted: boolean;
    public applicableHints: ChallengeHint[];
    public solutionUrl: string;

    constructor(obj?: any) {
        this.challengeId = obj && obj.assessmentEventId || null;
        this.challengeCompleted = obj && obj.correct;
        this.applicableHints = obj && obj.applicableHints?.map((h: any) => new ChallengeHint(h)) || null;
        this.solutionUrl = obj && obj.solutionUrl || null;
    }
}