import mongoose, { Schema, model, Types } from 'mongoose';
mongoose.Promise = global.Promise;

const schema = new Schema({
    theme: { type: String, trim: true, default: 'New theme' },
    date: { type: Date, default: Date.now() },
    description: { type: String, trim: true, default: 'description...' },
    user: { type: Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.models.Topic || model('Topic', schema);;
