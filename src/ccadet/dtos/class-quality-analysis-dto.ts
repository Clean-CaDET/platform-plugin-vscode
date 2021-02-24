export class ClassQualityAnalysisDTO {
    public metrics: ClassMetricsDTO;
    public content: EducationalContentDTO;

    constructor(obj?: any) {
        this.metrics = obj && obj.metrics || null;
        this.content = obj && obj.content || null;
    }
}

export class ClassMetricsDTO {
    public fullName: string;
    public LOC: number;
    public LCOM: number;
    public NMD: number;
    public NAD: number;
    public WMC: number;

    constructor(obj?: any) {
        this.fullName = obj && obj.fullName || null;
        this.LOC = obj && obj.LOC || null;
        this.LCOM = obj && obj.LCOM || null;
        this.NMD = obj && obj.NAD || null;
        this.NAD = obj && obj.NAD || null;
        this.WMC = obj && obj.WMC || null;
    }
}

export class EducationalContentDTO {
    public title: string;
    public image: string;
    
    constructor(obj?: any) {
        this.title = obj && obj.title || null;
        this.image = obj && obj.image || null;
    }
}