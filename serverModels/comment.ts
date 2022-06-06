import mongoose, { Schema, model, Types } from 'mongoose';
mongoose.Promise = global.Promise;

const schema = new Schema({
    topic: { type: Types.ObjectId, ref: 'Topic', required: true },
    date: { type: Date, default: Date.now() },
    description: { type: String, trim: true, required: true },
    user: { type: Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.models.Comment || model('Comment', schema);
