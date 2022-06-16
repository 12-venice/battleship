/* eslint-disable import/no-default-export */
import mongoose, { Schema, model, Types } from 'mongoose';

const schema = new Schema(
    {
        users: [{ type: Types.ObjectId, ref: 'User', required: true }],
        room: { type: Types.ObjectId, ref: 'Room', required: true },
        moves: [{ type: Types.ObjectId, ref: 'Move', required: true }],
        ships: { type: Array },
    },
    { timestamps: true },
);

export default mongoose.models.Move || model('Game', schema);
