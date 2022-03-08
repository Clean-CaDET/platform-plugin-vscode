export class ChallengeHint {
    id: number;
    content: string;
    applicableToCodeSnippets: string[];

    constructor(obj?: any) {
        this.id = obj && obj.id || null;
        this.content = obj && obj.content || null;
        this.applicableToCodeSnippets = obj && obj.applicableToCodeSnippets || null;
    }
}