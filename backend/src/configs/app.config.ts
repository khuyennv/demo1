export default (): Record<string, unknown> => ({
    PORT: parseInt(process.env.PORT, 10) || 3000,
    apiPrefix: process.env.API_PREFIX,
    language: "vi",
    DEFAULT_AVATAR: "https://storage.googleapis.com/fjob-dev/default-avatar.png",
    logLevel: process.env.LOG_LEVEL
})
