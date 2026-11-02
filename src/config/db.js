//conexion a MongoDB
import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI); 
        console.log(`MONGODB connected · "${mongoose.connection.name}"`);
    } catch (error) {
        console.error("MONGODB connection error:", error.message)
        process.exit(1) //corta la api si no hay base
    }
}