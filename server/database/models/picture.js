import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * Schema that represents Pictures
 */
const PictureSchema = new Schema({
    "picture_name": { type: String, required: true },
    "url": {type: String, required: true}
});

const Picture = mongoose.model("Picture", PictureSchema);
export default Picture;