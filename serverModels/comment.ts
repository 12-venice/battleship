/* eslint-disable import/no-default-export */
import mongoose, { Schema, model, Types } from 'mongoose';

const schema = new Schema(
    {
        topic: { type: Types.ObjectId, ref: 'Topic' },
        description: { type: String, trim: true, required: true },
        comment: { type: Types.ObjectId, ref: 'Comment' },
        subcomments: [{ type: Types.ObjectId, ref: 'Comment', default: [] }],
        user: { type: Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true },
);

export default mongoose.models.Comment || model('Comment', schema);
