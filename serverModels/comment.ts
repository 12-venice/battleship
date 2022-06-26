/* eslint-disable import/no-default-export */
import mongoose, { Schema, model } from 'mongoose';

const schema = new Schema(
    {
        topic: { type: String },
        message: { type: String, trim: true, required: true },
        comment: { type: String },
        subcomments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true },
);

export default mongoose.models.Comment || model('Comment', schema);
