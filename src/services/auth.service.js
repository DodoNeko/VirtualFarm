import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const register = async (data) => {

    const existingUser = await User.findOne({
        email: data.email
    });


    if (existingUser) {
        throw new Error("User already exists");
    }


    const hashedPassword = await bcrypt.hash(
        data.password,
        10
    );


    const user = await User.create({
        email: data.email,
        password: hashedPassword,
        name: data.name,
        money: 100,
        lvl: 1,
        exp: 0,
        day: 1
    });

    return user;
};



export const login = async (email, password) => {

    const user = await User.findOne({
        email
    });


    if (!user) {
        throw new Error("User does not exist");
    }


    const match = await bcrypt.compare(
        password,
        user.password
    );


    if (!match) {
        throw new Error("Invalid password");
    }

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );


    return {
        token: token
    };
};