/* eslint-disable import/no-default-export */
import mongoose, { Schema, model, Types } from 'mongoose';

const schema = new Schema({
    date: { type: Date, default: Date.now() },
    user: { type: Types.ObjectId, ref: 'User', required: true },
    room: { type: Types.ObjectId, ref: 'Room', required: true },
    text: { type: String, trim: true, required: true },
    delivered: { type: Boolean, default: false },
});

export default mongoose.models.Message || model('Message', schema);
