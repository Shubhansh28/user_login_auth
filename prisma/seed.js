const { config } = require('dotenv')
const bcrypt = require('bcrypt')

config()

const { prisma } = require('../src/config/config')

const saltRounds = 10

const adminCheck = async () => {
    const admin = await prisma.user.findUnique({
        where: {
            username: 'shivji'
        }
    })

    return admin !== null
}

const createAdmin = async () => {
    const password = process.env.adminPassword

    if (typeof password !== 'string' || password.trim() === '') {
        throw new Error('adminPassword is missing or empty')
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds)

    await prisma.user.create({
        data: {
            username: 'shivji',
            role: 'admin',
            password: hashedPassword
        }
    })
}

const main = async () => {
    try {
        if (await adminCheck()) {
            console.log('Admin user already exists')
            return
        }

        await createAdmin()
        console.log('Admin user created')
    } catch (error) {
        console.error('Database seed failed:', error)
        process.exitCode = 1
    } finally {
        await prisma.$disconnect()
    }
}

main()