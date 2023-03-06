import mongoose from "mongoose";
import { Constraints } from "../validation.js";
import UserStatSchema from "./userStat.js";

const Schema = mongoose.Schema;

/**
 * Schema that represents Users
 */
const UserSchema = new Schema({
    username: { type: String, required: true, },
    picture_url: {type: String, required: true, validate: Constraints.url},
    email: {type: String, required: true, validate: Constraints.email },
    user_stats: {type : UserStatSchema, required: true, default: () => ({}) },
});

const User = mongoose.model("User", UserSchema);
export default User;