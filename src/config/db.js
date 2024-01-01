import mongoose from 'mongoose';


const connectDB = async (url, db_name) => {
    try {
        let connection = await mongoose.connect(`${url}/${db_name}`);
        return connection.connection.host;
    } catch (error) {
        throw error;
    }
}

export default connectDB;