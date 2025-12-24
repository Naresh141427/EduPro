const redis = require("../config/redisClient");

const SESSION_PREFIX = "session:";
const USER_SESSIONS_PREFIX = "user_sessions:";

module.exports = {
  async createSession({
    userUUID,
    refreshTokenHash,
    userAgent,
    ipAddress,
    expiresAt,
  }) {
    const sessionKey = `${SESSION_PREFIX}${refreshTokenHash}`;
    const userSessionsKey = `${USER_SESSIONS_PREFIX}${userUUID}`;

    const sessionData = {
      userUUID,
      refreshTokenHash,
      userAgent,
      ipAddress,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    };

    const ttlSeconds = Math.ceil(
      (new Date(expiresAt).getTime() - Date.now()) / 1000
    );

    if (ttlSeconds <= 0) {
      throw new Error("Cannot create a session that is already expired");
    }

    const pipeline = redis.pipeline();

    pipeline.setex(sessionKey, ttlSeconds, JSON.stringify(sessionData));

    pipeline.sadd(userSessionsKey, refreshTokenHash);

    await pipeline.exec();

    return { id: refreshTokenHash };
  },

  async findSessionByHash(hash) {
    const sessionKey = `${SESSION_PREFIX}${hash}`;
    const data = await redis.get(sessionKey);

    if (!data) return null;

    const session = JSON.parse(data);

    return {
      user_uuid: session.userUUID,
      refresh_token_hash: session.refreshTokenHash,
      user_agent: session.userAgent,
      ip_address: session.ipAddress,
      expires_at: session.expiresAt,
      created_at: session.createdAt,
    };
  },

  async deleteSessionByHash(hash) {
    const sessionKey = `${SESSION_PREFIX}${hash}`;

    const data = await redis.get(sessionKey);

    if (data) {
      const session = JSON.parse(data);
      const userSessionsKey = `${USER_SESSIONS_PREFIX}${session.userUUID}`;

      const pipeline = redis.pipeline();
      pipeline.del(sessionKey);
      pipeline.srem(userSessionsKey, hash);
      await pipeline.exec();

      return 1;
    }

    return 0;
  },

  async deleteSessionByUserUUID(userUUID) {
    const userSessionsKey = `${USER_SESSIONS_PREFIX}${userUUID}`;

    const hashes = await redis.smembers(userSessionsKey);

    if (hashes.length === 0) {
      return 0;
    }

    const pipeline = redis.pipeline();

    for (const hash of hashes) {
      pipeline.del(`${SESSION_PREFIX}${hash}`);
    }

    pipeline.del(userSessionsKey);

    await pipeline.exec();

    return hashes.length;
  },

  async rotateSession(oldHash, newHash, newExpiry) {
    const oldSessionKey = `${SESSION_PREFIX}${oldHash}`;

    // 1. Check if old session exists
    const data = await redis.get(oldSessionKey);
    if (!data) return 0;

    const session = JSON.parse(data);
    const userUUID = session.userUUID;
    const userSessionsKey = `${USER_SESSIONS_PREFIX}${userUUID}`;

    const ttlSeconds = Math.ceil(
      (new Date(newExpiry).getTime() - Date.now()) / 1000
    );
    if (ttlSeconds <= 0) return 0;

    const newSessionData = {
      ...session,
      refreshTokenHash: newHash,
      expiresAt: newExpiry.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const pipeline = redis.pipeline();

    // 2. Remove old session
    pipeline.del(oldSessionKey);
    pipeline.srem(userSessionsKey, oldHash);

    // 3. Create new session
    const newSessionKey = `${SESSION_PREFIX}${newHash}`;
    pipeline.setex(newSessionKey, ttlSeconds, JSON.stringify(newSessionData));
    pipeline.sadd(userSessionsKey, newHash);

    await pipeline.exec();

    return 1;
  },
};
