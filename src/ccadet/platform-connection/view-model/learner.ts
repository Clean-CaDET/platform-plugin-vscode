export class Learner {
    public id: number;

    constructor(obj?: any) {
        this.id = obj && obj.id || null;
    }
}