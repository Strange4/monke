import mongoose from "mongoose";
import { Constraints } from "../validation.js";

const Schema = mongoose.Schema;

/**
 * Schema that represents Users
 */
const UserSchema = new Schema({
    username: { type: String, required: true, },
    picture_url: {type: String, required: true, validate: Constraints.url},
    email: {type: String, required: true, validate: Constraints.email },
    user_stats: {type : Schema.Types.ObjectId, ref: "UserStat", required: true},
});

const User = mongoose.model("User", UserSchema);
export default User;