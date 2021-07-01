import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const exampleSchema = new Schema({
    exampleString: {
        type: String
    },
    exampleDate: {
        type: Date,
        default: Date.now
    }
});