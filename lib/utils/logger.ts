import * as mongoose from 'mongoose';

import { exampleSchema } from '../models/exampleModel';

const Source = 'cura-Template-service';
const SaveFailure = 'Failing to save to Mongo.';

export function logEvent(cId, msg): void{
    console.log(msg + "todo: logging");
}

export function logError(cId, msg){
    console.log(msg + "todo: logging");
}