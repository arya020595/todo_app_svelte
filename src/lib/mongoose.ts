import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectionString = process.env.MONGODB_URI as string;

async function connectToDatabase() {
	try {
		await mongoose.connect(connectionString, {});
		console.log('Connected to MongoDB');
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
	}
}

export default connectToDatabase;
