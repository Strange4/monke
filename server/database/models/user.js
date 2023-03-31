import mongoose from "mongoose";
import { Constraints } from "../validation.js";
import UserStatSchema from "./userStat.js";

const Schema = mongoose.Schema;

/**
 * Schema that represents Users
 */
const UserSchema = new Schema({
    username: { type: String, required: true, },
    "picture_url": {type: String, required: true, validate: Constraints.url},
    email: {type: String, required: true, validate: Constraints.email },
    "user_stats": {type : UserStatSchema, required: true, default: () => ({}) },
}, {
    methods: {
        async getRank(){
            const peopleGreaterThanMe = await User.countDocuments({
                "user_stats.max_wpm": { $gt: this.user_stats.max_wpm },
            });
            const peopleEqualToMe = await User.countDocuments({
                "user_stats.max_wpm": this.user_stats.max_wpm,
            });
            // if i am the only one with that wpm
            if(peopleEqualToMe === 1){
                // i am next in line
                return peopleGreaterThanMe + 1;
            }

            // every one who has the same wpm sorted by accuracy and then date
            const myPeople = await User.find({
                "user_stats.max_wpm": this.user_stats.max_wpm
            }).sort({
                "user_stats.max_accuracy": "desc",
                "user_stats.date": "asc"
            }).lean();

            // find myself, then add the people above me, 
            // then add 1 because it needs the rank not the index
            return myPeople.findIndex((people) => people._id.toString() === this.id ) 
                + peopleGreaterThanMe + 1;
        }
    }
});

const User = mongoose.model("User", UserSchema);
export default User;