const { PrismaClient } = require("@prisma/client")
const { PrismaPg } = require("@prisma/adapter-pg")

const isLocal = (process.env.DATABASE_URL || '').includes('localhost') ||
                (process.env.DATABASE_URL || '').includes('127.0.0.1')

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } })
});

const prisma = new PrismaClient({
    adapter
});


module.exports = {
    prisma
}