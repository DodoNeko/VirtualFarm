import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    money: {
        type: Number
    },
    lvl: {
        type: Number
    },
    exp:{
        type: Number
    },
    day: {
        type: Number
    }
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema);

