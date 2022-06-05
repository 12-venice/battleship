/* eslint-disable import/no-default-export */
import mongoose, { Schema, model, Types } from 'mongoose';

const schema = new Schema(
    {
        topic: { type: Types.ObjectId, ref: 'Topic', required: true },
        description: { type: String, trim: true, required: true },
        user: { type: Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true },
);

export default mongoose.models.Comment || model('Comment', schema);
