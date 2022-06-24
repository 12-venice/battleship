/* eslint-disable import/no-default-export */
import mongoose, { Schema, model } from 'mongoose';

const schema = new Schema(
    {
        users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
        moves: [{ type: Schema.Types.ObjectId, ref: 'Move' }],
    },
    { timestamps: true },
);

export default mongoose.models.Room || model('Room', schema);
