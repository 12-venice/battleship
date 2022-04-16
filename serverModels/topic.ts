// Старый синтаксис
/* eslint-disable @typescript-eslint/no-var-requires */
const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    theme: { type: String, trim: true, default: '' },
    date: { type: Date, default: Date.now() },
    description: { type: String, trim: true, default: '' },
    user: { type: Types.ObjectId, ref: 'User' },
});

module.exports = model('Topic', schema);
