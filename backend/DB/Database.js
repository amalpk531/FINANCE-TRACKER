// import mongoose from "mongoose";

// export const connectDB = async (req, res) => {
//     //mongo server url
//     const url = "mongodb://127.0.0.1:27017/finmanager";

//     const {connection} = await mongoose.connect(url);

//     console.log(`MongoDB Connection successful to ${connection.host}`);

// }

import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
    try {
        const url =process.env.MONGO_URI;
        
        
        const { connection } = await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected to: ${connection.host}`);
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1); // Exit process on failure
    }
};
