import { LearningObject, Text, Image, Video } from '../view-model/learning-object';

export function convert(learningObject: any): LearningObject {
    switch (learningObject.typeDiscriminator) {
        case 'text':
            return new Text(learningObject);
        case 'image':
            return new Image(learningObject);
        case 'video':
            return new Video(learningObject);
    }
    return new LearningObject(learningObject);
}