export class LearningObject {
    id: number;
    learningObjectSummaryId: number;
    typeDiscriminator: string;

    constructor(obj?: any) {
        this.id = obj && obj.id || null;
        this.learningObjectSummaryId = obj && obj.learningObjectSummaryId || null;
        this.typeDiscriminator = obj && obj.typeDiscriminator || null;
    }
}

export class Text extends LearningObject {
    content: string;

    constructor(obj?: any) {
        super(obj);
        this.content = obj && obj.content || null;
    }
}

export class Image extends LearningObject {
    url: string;
    caption: string;
  
    constructor(obj?: any) {
        super(obj);
        this.url = obj && obj.url || null;
        this.caption = obj && obj.caption || null;
    }
}

export class Video extends LearningObject {
    url: string;

    constructor(obj?: any) {
        super(obj);
        this.url = obj && obj.url || null;
    }
}