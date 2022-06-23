/* eslint-disable import/no-default-export */
import mongoose, { Schema, model } from 'mongoose';

const schema = new Schema(
    {
        display_name: { type: String, default: '' },
        first_name: { type: String, default: '' },
        second_name: { type: String, default: '' },
        email: { type: String, default: '', lowercase: true, unique: true },
        phone: { type: String, default: '' },
        login: { type: String, default: '' },
        avatar: { type: String, default: '' },
        rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
        points: { type: String, default: 0 },
        wins: { type: String, default: 0 },
        defeats: { type: String, default: 0 },
        password: { type: String, default: '' },
    },
    { timestamps: true },
);

export default mongoose.models.User || model('User', schema);
