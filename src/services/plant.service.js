import Plant from "../models/Plant.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const create = async (data, userId) => {
    const template = {
        userId: new mongoose.Types.ObjectId(userId),
        plantNumber: data.plant,
        biomeNumber: data.biome,
        soilNumber: data.soil,
        care: 0,
        watering: 0,
        plantedAt: data.currentDay,
        phase: 0
    };

    const count = data.quantity;

    const plants = Array.from({ length: count }, () => ({ ...template }));
    const result = await Plant.insertMany(plants);

    return {
        status: "success",
        results: result
    };
};

export const evolve = async (success, plantId) => {
    if (success) {
        const result = await Plant.updateOne(
            { _id: new mongoose.Types.ObjectId(plantId) },
            {
                $inc: { phase: 1 },
                watering: 0,
                care: 0,
                lastWateredAt: 0,
                lastCaredAt: 0
            }
        );
        return {
            status: "success",
            message: "Plant has been evolved",
            results: result
        };
    } else {
        const result = await Plant.updateOne(
            { _id: new mongoose.Types.ObjectId(plantId) },
            {
                $inc: { phase: 4 },
            }
        );
        return {
            status: "success",
            message: "Plant has died",
            results: result
        };
    }
}

export const harvest = async (exp, userId) => {
    const result = await User.updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        { $inc: { exp: exp } }
    );
    return {
        status: "success",
        message: "Plant has been harvested",
        results: result
    };
}

export const change = async (action, plantId) => {
    // action -> water / care / remove
    if (action == 'water') {
        const result = await Plant.updateOne(
            { _id: new mongoose.Types.ObjectId(plantId) },
            { $inc: { watering: 1 } }
        );
        console.log(result);
        return {
            status: "success",
            message: "Plant has been watered",
            results: result
        };
    } else if (action == "care") {
        const result = await Plant.updateOne(
            { _id: new mongoose.Types.ObjectId(plantId) },
            { $inc: { care: 1 } }
        );
        return {
            status: "success",
            message: "Plant has been taken care of",
            results: result
        };
    }
    else if (action == "remove") {
        await Plant.deleteOne(
            { _id: new mongoose.Types.ObjectId(plantId) }
        );
        return {
            status: "success"
        };
    }
}

export const get = async (userId) => {
    const result = await Plant.find(
        {
            userId: new mongoose.Types.ObjectId(userId)
        }
    );

    return {
        status: "success",
        results: result
    };
};