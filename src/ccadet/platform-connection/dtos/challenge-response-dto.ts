export class ChallengeResponseDTO {
    public responseText: string;

    constructor(obj?: any) {
        this.responseText = obj && obj.responseText || null;
    }
}