// Старый синтаксис
/* eslint-disable @typescript-eslint/no-var-requires */
const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    topic: { type: Types.ObjectId, ref: 'Topic' },
    date: { type: Date, default: Date.now() },
    description: { type: String, trim: true, default: 'Empty comment' },
    user: { type: Types.ObjectId, ref: 'User' },
});

module.exports = model('Comment', schema);
