// Старый синтаксис
/* eslint-disable @typescript-eslint/no-var-requires */
import { Schema, model } from 'mongoose';

const schema = new Schema({
    id: { type: Number, required: true },
    display_name: { type: String, default: '' },
    first_name: { type: String, default: '' },
    second_name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    login: { type: String, default: '' },
    avatar: { type: String, default: '' },
    points: { type: String, default: 0 },
    wins: { type: String, default: 0 },
    defeats: { type: String, default: 0 },
});

export default model('User', schema);
