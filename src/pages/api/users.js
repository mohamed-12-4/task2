import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
    const apiKey = req.headers['api-key'];

    // we're assuming a trivial way of checking the api key (not recommended in a real application)
    if (apiKey !== process.env.API_KEY) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const client = await clientPromise;
    const db = client.db(); // Connect to the default database (replace with your DB name if needed)
    const usersCollection = db.collection('users'); // 'users' collection in MongoDB

    switch (req.method) {
        case 'GET':
            // Retrieve all users
            try {
                const users = await usersCollection.find({}).toArray();
                res.status(200).json(users);
            } catch (error) {
                console.error('Error fetching users:', error);
                res.status(500).json({ message: 'Error fetching users' });
            }
            break;

        case 'POST':
            // Add a new user
            try {
                const { name, email } = req.body;
                const result = await usersCollection.insertOne({ name, email });
                if (result.acknowledged) {
                    res.status(201).json({ _id: result.insertedId, name, email });
                } else {
                    res.status(500).json({ message: 'User insertion not acknowledged' });
                }
            } catch (error) {
                console.error('Error creating user:', error);
                res.status(500).json({ message: 'Error creating user' });
            }
            break;

        case 'PUT':
            // Update an existing user by ID
            try {
                const { id, name, email } = req.body;
                const updatedUser = await usersCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { name, email } }
                );
                res.status(200).json(updatedUser);
            } catch (error) {
                console.error('Error updating user:', error);
                res.status(500).json({ message: 'Error updating user' });
            }
            break;

        case 'DELETE':
            // Delete a user by ID
            try {
                const { id } = req.body;
                await usersCollection.deleteOne({ _id: new ObjectId(id) });
                res.status(200).json({ message: 'User deleted' });
            } catch (error) {
                console.error('Error deleting user:', error);
                res.status(500).json({ message: 'Error deleting user' });
            }
            break;

        default:
            res.status(405).json({ message: 'Method Not Allowed' });
            break;
    }
}