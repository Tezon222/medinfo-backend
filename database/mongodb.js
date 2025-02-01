import mongoose from "mongoose"

const connectdb = async() =>{
    try{
        const connection = await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database successfully connected:",connection.connection.host)
    }catch(err){
        throw new Error(err)
    }

}
 
export default connectdb