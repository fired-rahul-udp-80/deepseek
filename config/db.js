import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;

if (!mongoUri) {
    throw new Error("Please define MONGO_URI or MONGO_URL in your environment.");
}

let cached = globalThis.mongoose || { conn: null, promise: null };

if (!globalThis.mongoose) {
    globalThis.mongoose = cached;
}

export default async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(mongoUri).then((mongooseInstance) => {
            return mongooseInstance.connection;
        });
    }

    try {
        cached.conn = await cached.promise;                                    
    } catch (error) {
        cached.promise = null;
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }

    return cached.conn;
}