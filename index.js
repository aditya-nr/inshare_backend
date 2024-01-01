import { env } from "./constants.js";
import connectDB from "./src/config/db.js"
import server from "./src/server.js";


(async () => {
    try {
        let host = await connectDB(env.DB_URL, env.DB_NAME);
        console.log(`DB connected : `, host);
        server.listen(env.PORT, () => {
            console.log(`Serer is listing on port 3000...`);
        })
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})()