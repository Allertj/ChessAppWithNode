import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongod : any = null

const connect = async () => {
    if (!mongod) {
        mongod = await MongoMemoryServer.create();
    }
    const uri = mongod.getUri();
    const mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize: 10
    }
    await mongoose.connect(uri)
}

const closeDatabase = async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongod.stop()
}

const clearDatabase = async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
        const collection = collections[key]
        await collection.deleteMany({})
    }
}

export {connect, closeDatabase, clearDatabase} 