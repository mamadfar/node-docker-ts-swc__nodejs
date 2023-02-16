export default {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migration: {
        extension: "ts"
    }
}