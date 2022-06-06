import mongoose, { Schema, model, Types } from 'mongoose';
mongoose.Promise = global.Promise;

const schema = new Schema({
    date: { type: Date, default: Date.now() },
    users: [{ type: Types.ObjectId, ref: 'User' }],
    messages: [{ type: Types.ObjectId, ref: 'Message' }],
    moves: [{ type: Types.ObjectId, ref: 'Move' }],
});

export default mongoose.models.Room || model('Room', schema);;
