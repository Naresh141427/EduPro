const bcrypt = require("bcrypt");

const userModel = require("../models/userModel");
const AppError = require("../utils/AppError");

// REGISTER
const createUserService = async (fullname, email, password) => {
    const existingUser = await userModel.getUserByEmail(email);

    if (existingUser) {
        throw new AppError("Email already exists", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userModel.createUser(
        fullname,
        email,
        passwordHash
    );

    return user;
};

// LOGIN (credential validation only)
const loginUserService = async (email, password) => {
    const user = await userModel.getUserByEmail(email);

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    if (!user.is_active) {
        throw new AppError("User account is disabled", 403);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new AppError("Invalid email or password", 401);
    }

    return {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active
    };
};


//UPDATE USER PROFILE(name, email)
const updateUserService = async (userUUID, data) => {

    const { email } = data

    const user = await userModel.getUserByUUID(userUUID)

    if (!user) {
        throw new AppError("User not found", 400)
    }

    if (!user.is_active) {
        throw new AppError("User account is disabled", 403)
    }

    if (email) {
        if (email === user.email) {
            throw new AppError(
                "Please use a different email address",
                400
            );
        }
        const emailExist = await userModel.getUserByEmail(email)
        if (emailExist) {
            throw new AppError("Email already in use", 409)
        }
    }

    const updated = await userModel.updateUser(userUUID, data)

    return {
        uuid: updated.uuid,
        name: updated.name,
        email: updated.email,
        role: updated.role
    }

}



// UPDATE USER PASSWORD

const updateUserPasswordService = async (uuid, data) => {

    const user = await userModel.getUserWithPasswordByUUID(uuid)

    if (!user) {
        throw new AppError("User not found", 404)
    }

    if (!user.is_active) {
        throw new AppError("User account is disabled", 403)
    }

    const { currentPassword, newPassword } = data

    const isPasswordMatched = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordMatched) {
        throw new AppError("Incorrect cuurent password", 401)
    }
    const hashNewPassword = await bcrypt.hash(newPassword, 10)
    const updatePassword = await userModel.updateUserPassword(uuid, hashNewPassword)

}

const deactivateUserService = async (uuid) => {
    const user = await userModel.getUserByUUID(uuid)

    if (!user) {
        throw new AppError("User not found", 404)
    }

    if (!user.is_active) {
        throw new AppError("Account already deactivated", 400)
    }

    await userModel.deactivateUser(uuid)

}

module.exports = {
    createUserService,
    loginUserService,
    updateUserService,
    updateUserPasswordService,
    deactivateUserService
};
