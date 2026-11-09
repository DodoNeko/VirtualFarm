import mongoose from "mongoose";
import User from "./User.js";

const plantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: User,
        required: true
    },
    plantNumber: { type: Number, required: true },
    biomeNumber: { type: Number, required: true },
    soilNumber: { type: Number, required: true },
    care: { type: Number },
    watering: { type: Number },
    lastWateredAt: { type: Date },
    lastCaredAt: { type: Date },
    planedAt: { type: Date },
    phase: { type: Number }
}, {
    timestamps: true
});

export default mongoose.model("Plant", plantSchema);