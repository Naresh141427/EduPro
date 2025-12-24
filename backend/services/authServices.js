const tokenServices = require("./tokenServices");
const sessionModel = require("../models/sessionModel.redis");
const userModel = require("../models/userModel");
const AppError = require("../utils/AppError");
const env = require("../config/env");

const DAYS = parseInt(env.REFRESH_TOKEN_EXPIRES_DAYS, 10);

async function createSessionForUser(user, ipAddress, userAgent) {
  const rawRefreshToken = tokenServices.generateRefreshToken();
  const refreshTokenHash = tokenServices.hashRefreshToken(rawRefreshToken);

  const expiresAt = new Date(Date.now() + DAYS * 24 * 60 * 60 * 1000);

  await sessionModel.createSession({
    userUUID: user.uuid,
    refreshTokenHash,
    userAgent,
    ipAddress,
    expiresAt,
  });

  const accessPayload = {
    uuid: user.uuid,
    email: user.email,
    role: user.role,
  };

  const accessToken = tokenServices.generateAccessToken(accessPayload);

  return {
    accessToken,
    refreshToken: rawRefreshToken,
    expiresAt,
  };
}

async function refreshSession(rawRefreshToken) {
  const oldHash = tokenServices.hashRefreshToken(rawRefreshToken);

  const session = await sessionModel.findSessionByHash(oldHash);
  if (!session) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (new Date(session.expires_at) < new Date()) {
    await sessionModel.deleteSessionByHash(oldHash);
    throw new AppError("Refresh token expired", 401);
  }

  const user = await userModel.getUserByUUID(session.user_uuid);
  if (!user || !user.is_active) {
    await sessionModel.deleteSessionByHash(oldHash);
    throw new AppError("Invalid user for this session", 401);
  }

  const newRawRefreshToken = tokenServices.generateRefreshToken();
  const newHashedRefreshToken =
    tokenServices.hashRefreshToken(newRawRefreshToken);
  const newExpiry = new Date(Date.now() + DAYS * 24 * 60 * 60 * 1000);

  const updated = await sessionModel.rotateSession(
    oldHash,
    newHashedRefreshToken,
    newExpiry
  );

  if (!updated) {
    throw new AppError("Failed to rotate refresh token", 500);
  }

  const payload = {
    uuid: user.uuid,
    email: user.email,
    role: user.role,
  };

  const newAccessToken = tokenServices.generateAccessToken(payload);

  return {
    accessToken: newAccessToken,
    refreshToken: newRawRefreshToken,
    expiresAt: newExpiry,
    user: payload,
  };
}

async function revokeRefreshToken(rawRefreshToken) {
  const hash = tokenServices.hashRefreshToken(rawRefreshToken);
  return sessionModel.deleteSessionByHash(hash);
}

async function revokeSessionByUserUUID(uuid) {
  return sessionModel.deleteSessionByUserUUID(uuid);
}

module.exports = {
  createSessionForUser,
  refreshSession,
  revokeRefreshToken,
  revokeSessionByUserUUID,
};
