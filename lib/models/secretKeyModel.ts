import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const secretKeySchema = new Schema({
     issuedTo: {
        type: String,
        required: 'You are required to say who this key is for'
    },
    key: {
        type: String,
        required: 'The key is required',
        unique: true
    },
    accessLevel: {//r, w, rw, a
        type: String,
        required: 'Access level is required'
    }
});