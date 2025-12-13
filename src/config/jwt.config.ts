export const JWT_CONFIG = {
    JWT_SECRET_KEY : process.env.JWT_SECRET_KEY || "secret",
    JWT_EXPIRES_IN : Number(process.env.JWT_EXPIRES_IN)|| 60 * 60,
    JWT_REFRESH_EXPIRES_IN : Number(process.env.JWT_REFRESH_EXPIRES_IN) || 60 * 60 * 24,
}