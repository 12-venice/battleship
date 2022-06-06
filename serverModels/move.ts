import mongoose, { Schema, model, Types } from 'mongoose';
mongoose.Promise = global.Promise;

const schema = new Schema({
    date: { type: Date, default: Date.now() },
    user: { type: Types.ObjectId, ref: 'User', required: true },
    room: { type: Types.ObjectId, ref: 'Room', required: true },
    move: { type: Object, required: true },
    delivered: { type: Boolean, default: false },
});

export default mongoose.models.Move || model('Move', schema);;
