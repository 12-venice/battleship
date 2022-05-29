// Старый синтаксис
/* eslint-disable @typescript-eslint/no-var-requires */
import { Schema, model, Types } from 'mongoose';

const schema = new Schema({
    date: { type: Date, default: Date.now() },
    users: [{ type: Types.ObjectId, ref: 'User' }],
    messages: [{ type: Types.ObjectId, ref: 'Message' }],
    moves: [{ type: Types.ObjectId, ref: 'Move' }],
});

export default model('Room', schema);
