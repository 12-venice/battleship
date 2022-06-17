/* eslint-disable import/no-default-export */
import mongoose, { Schema, model, Types } from 'mongoose';

const schema = new Schema({
    users: [{ type: Types.ObjectId, ref: 'User' }],
    room: { type: Types.ObjectId, ref: 'Room', required: true },
    queue: { type: Types.ObjectId }, // user id
    score: { type: String },

    text: { type: String, trim: true, required: true },
    delivered: { type: Boolean, default: false },
});

export default mongoose.models.Game || model('Game', schema);
