import mongoose from "mongoose";

export const connectDB = async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
             console.log("MongoDb connected successfully!!");
    } catch (error) {
        console.log("MongoDb connection failed:",error)
    }
}
