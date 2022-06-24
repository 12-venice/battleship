/* eslint-disable import/no-default-export */
import mongoose, { Schema, model, Types } from 'mongoose';

const schema = new Schema({
    id: { type: String },
    invitedUser: { type: Types.ObjectId, ref: 'User' },
    createdUser: { type: Types.ObjectId, ref: 'User' },
    room: { type: Types.ObjectId, ref: 'Room', required: true },
    createdField: { type: Object },
    invitedField: { type: Object },
    queue: { type: String },
    score: [{ type: Number }],
    bonusScore: { type: Number },
    statistics: [{ type: Object }],
    gameOver: { type: Boolean },
    gameCancel: { type: Boolean },
});

export default mongoose.models.Game || model('Game', schema);
