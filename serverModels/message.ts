// Старый синтаксис
/* eslint-disable @typescript-eslint/no-var-requires */
import { Schema, model, Types } from 'mongoose';

const schema = new Schema({
    date: { type: Date, default: Date.now() },
    user: { type: Types.ObjectId, ref: 'User', required: true },
    room: { type: Types.ObjectId, ref: 'Room', required: true },
    text: { type: String, trim: true, required: true },
});

export default model('Message', schema);
