// Старый синтаксис
/* eslint-disable @typescript-eslint/no-var-requires */
const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    date: { type: Date, default: Date.now() },
    users: [{ type: Types.ObjectId, ref: 'User' }],
    messages: [{ type: Types.ObjectId, ref: 'Message' }],
});

module.exports = model('Room', schema);
