import mongoose, {Schema} from 'mongoose';

const ChatCollectionSchema = new Schema({
    sender: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        require: true
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        require: true
    },
    message: {
        type: String,
        require: true
    },
    viewed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export const Chat = mongoose.model('chat', ChatCollectionSchema);