export default (): Record<string, unknown> => ({
    databaseConnection: process.env.DATABASE_CONNECTION || "mysql",
    databaseHost: process.env.DATABASE_HOST,
    databasePort: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    databaseUsername: process.env.DATABASE_USERNAME,
    databasePassword: process.env.DATABASE_PASSWORD,
    databaseName: process.env.DATABASE_DB_NAME,
    databaseSlaveHost: process.env.DATABASE_SLAVE_HOST || process.env.DATABASE_HOST,
    databaseSlavePort: parseInt(process.env.DATABASE_SLAVE_PORT || process.env.DATABASE_PORT, 10) || 3306,
    databaseSlaveUsername: process.env.DATABASE_SLAVE_USERNAME || process.env.DATABASE_USERNAME,
    databaseSlavePassword: process.env.DATABASE_SLAVE_PASSWORD || process.env.DATABASE_PASSWORD,
    databaseSlaveName: process.env.DATABASE_SLAVE_DB_NAME || process.env.DATABASE_DB_NAME,
})
