import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    "username": String,
    "picture_url": String
})


const UserModel = mongoose.model("User", UserSchema);
export default UserModel;