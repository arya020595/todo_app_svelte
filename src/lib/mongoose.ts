import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectToDatabase = async () => {
	if (mongoose.connection.readyState >= 1) return;

	return mongoose.connect(process.env.MONGODB_URI!, {});
};

export default connectToDatabase;
