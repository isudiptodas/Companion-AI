import mongoose from "mongoose"

export const connectDb = async () => {
    const uri = process.env.MONGODB_URI as string;

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000
        });
        console.log("Database connected");
    } catch (err){
        console.log(err);
        console.error("Error connecting to database");
    }
}