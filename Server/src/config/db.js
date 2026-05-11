import mongoose from "mongoose";
import { config } from "dotenv";
import dns from 'dns'
config()

const connectToDb = async () => {
    dns.setServers(['8.8.8.8', '1.1.1.1'])
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to DB");
}

export default connectToDb;