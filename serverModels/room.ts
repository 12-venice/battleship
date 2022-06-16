/* eslint-disable import/no-default-export */
import mongoose, { Schema, model, Types } from 'mongoose';

const schema = new Schema(
    {
        users: [{ type: Types.ObjectId, ref: 'User' }],
        messages: [{ type: Types.ObjectId, ref: 'Message' }],
        games: [{ type: Types.ObjectId, ref: 'Move' }],
    },
    { timestamps: true },
);

export default mongoose.models.Room || model('Room', schema);
