// Conexion a MongoDB
import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI); 
        console.log(`MONGODB connected · "${mongoose.connection.name}"`);
    } catch (error) {
        console.error("MONGODB connection error:", error.message)
        // Corta la api si no hay base
        process.exit(1) 
    }
}