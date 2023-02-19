import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Schema that represents Users
 */
const UserSchema = new Schema({
    "username": { type: String, required: true },
    "picture_url": String
});

const User = mongoose.model("User", UserSchema);
export default User;