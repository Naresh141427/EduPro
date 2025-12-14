const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

const createUserService = async (fullname, email, password) => {

    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
        throw new Error("Email already exists");
    }


    const passwordHash = await bcrypt.hash(password, 10);


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

    return {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active
    };


}

module.exports = { createUserService, loginUserService };
