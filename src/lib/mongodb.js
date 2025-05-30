// lib/mongodb.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let clientPromise;

if (process.env.NODE_ENV === 'development') {
    // In development, use a global variable so the MongoDB client is not re-created on every reload
    if (global._mongoClientPromise) {
        clientPromise = global._mongoClientPromise;
    } else {
        global._mongoClientPromise = client.connect();
        clientPromise = global._mongoClientPromise;
    }
} else {
    // In production, it’s safe to use the MongoClient directly
    clientPromise = client.connect();
}

export default clientPromise;