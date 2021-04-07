import { LearningObject } from "./learning-object";
import { convert } from "../mappers/learning-object-mapper";

export class ChallengeHint {
    id: number;
    content: string;
    learningObject: LearningObject | null = null;
    applicableToCodeSnippets: string[];

    constructor(obj?: any) {
        this.id = obj && obj.id || null;
        this.content = obj && obj.content || null;
        if(obj && obj.learningObject) {
            this.learningObject = convert(obj.learningObject);
        }
        this.applicableToCodeSnippets = obj && obj.applicableToCodeSnippets || null;
    }
}