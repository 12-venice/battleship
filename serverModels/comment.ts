// Старый синтаксис
/* eslint-disable @typescript-eslint/no-var-requires */
const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    topic: { type: Types.ObjectId, ref: 'Topic', required: true },
    date: { type: Date, default: Date.now() },
    description: { type: String, trim: true, required: true },
    user: { type: Types.ObjectId, ref: 'User', required: true },
});

module.exports = model('Comment', schema);
