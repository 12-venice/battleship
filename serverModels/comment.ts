// Старый синтаксис
/* eslint-disable @typescript-eslint/no-var-requires */
import { Schema, model, Types } from 'mongoose';

const schema = new Schema({
    topic: { type: Types.ObjectId, ref: 'Topic' },
    date: { type: Date, default: Date.now() },
    description: { type: String, trim: true, default: 'Empty comment' },
    user: { type: Types.ObjectId, ref: 'User' },
});

export default model('Comment', schema);
