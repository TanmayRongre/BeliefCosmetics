import mongoose from "mongoose";
import dns from "dns";

// Resolve SRV records using public DNS servers to avoid querySrv ECONNREFUSED on local networks
dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const connectDB = async () => {
    try {
        const uri = process.env.mongo_URI || process.env.MONGO_URI;
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Error connecting to MONGODB", error.message);
        process.exit(1);
    }
};