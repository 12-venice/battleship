/* eslint-disable import/no-default-export */
import mongoose, { Schema, model } from 'mongoose';

const schema = new Schema(
    {
        theme: { type: String, trim: true, default: 'New theme' },
        description: { type: String, trim: true, default: 'description...' },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true },
);

export default mongoose.models.Topic || model('Topic', schema);
