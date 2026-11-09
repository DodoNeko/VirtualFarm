import Plant from "../models/Plant.js";
import mongoose from "mongoose";

export const create = async (data, userId) => {
    const template = {
        userId: new mongoose.Types.ObjectId(userId),
        plantNumber: data.plant,
        biomeNumber: data.biome,
        soilNumber: data.soil,
        care: 0,
        watering: 0,
        plantedAt: Date(),
        phase: 1
    };
    
    const count = data.quantity;

    const plants = Array.from({ length: count }, () => ({ ...template }));
    const result = await Plant.insertMany(plants);

    return {
        status: "success",
        results: result
    };
};