import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        minLength: 6,
        required: true,
    },

    profilePic: {
        type: String,
        default: "",
    },

},
    { timestamps: true },);

const User= mongoose.model("User", userSchema);
export default User;