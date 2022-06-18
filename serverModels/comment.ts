/* eslint-disable import/no-default-export */
import mongoose, { Schema, model, Types } from 'mongoose';

const schema = new Schema(
    {
        topic: { type: String },
        message: { type: String, trim: true, required: true },
        comment: { type: String },
        subcomments: [{ type: Types.ObjectId, ref: 'Comment' }],
        user: { type: Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true },
);

export default mongoose.models.Comment || model('Comment', schema);
