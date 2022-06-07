/* eslint-disable import/no-default-export */
import mongoose, { Schema, model, Types } from 'mongoose';

const schema = new Schema(
    {
        user: { type: Types.ObjectId, ref: 'User', required: true },
        room: { type: Types.ObjectId, ref: 'Room', required: true },
        move: { type: Object, required: true },
        delivered: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export default mongoose.models.Move || model('Move', schema);
