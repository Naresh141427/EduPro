const bcrypt = require("bcrypt");
const jwtToken = require("../utils/jwt")
const userModel = require("../models/userModel");

const createUserService = async (fullname, email, password) => {
    // Check if email already exists
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
        throw new Error("Email already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user in DB
    const user = await userModel.createUser(fullname, email, passwordHash);

    return user;
};


const loginUserService = async (email, password) => {
    const user = await userModel.getUserByEmail(email)
    if (!user) {
        throw new Error("Invalid email or password")
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        throw new Error("Invalid email or password")
    }


    const payload = {
        uuid: user.uuid,
        email: user.email,
        role: user.role
    }
    const token = jwtToken.generateToken(payload)

    return {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active
    };


}

module.exports = { createUserService, loginUserService };
