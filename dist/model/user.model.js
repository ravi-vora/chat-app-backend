import mongoose from 'mongoose';
const UserCollectionSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    hash: {
        type: String,
        require: true
    },
    salt: {
        type: String,
        require: true
    },
    socketId: {
        type: String,
        require: true
    },
    roomId: {
        type: String,
        require: true
    }
}, { timestamps: true });
/**
 * hide some credentials to query by accident
 */
UserCollectionSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj["hash"];
    delete obj["salt"];
    delete obj["__v"];
    return obj;
};
UserCollectionSchema.path("email").validate(async (email) => {
    const count = await mongoose.models.user.countDocuments({ email });
    return !count;
}, "Email is already exist");
export const User = mongoose.model('user', UserCollectionSchema);
//# sourceMappingURL=user.model.js.map