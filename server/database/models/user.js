import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Schema that represents Users
 */
const UserSchema = new Schema({
    "username": { type: String, required: true },
    "picture_url": {type: String, required: true},
    "email": {type: String, required: true},
    "user_stats": {type : Schema.Types.ObjectId, ref: "UserStat"},
});

const User = mongoose.model("User", UserSchema);
export default User;