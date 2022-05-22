// Старый синтаксис
/* eslint-disable @typescript-eslint/no-var-requires */
const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    date: { type: Date, default: Date.now() },
    user: { type: Types.ObjectId, ref: 'User', required: true },
    room: { type: Types.ObjectId, ref: 'Room', required: true },
    text: { type: String, trim: true, required: true },
});

module.exports = model('Message', schema);
