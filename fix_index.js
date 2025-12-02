require("dotenv").config();
const mongoose = require("mongoose");

async function fixIndex() {
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log("Connected to DB");

        // List indexes first to be sure
        const indexes = await mongoose.connection.collection('products').indexes();
        console.log("Current Indexes:", indexes);

        try {
            await mongoose.connection.collection('products').dropIndex('id_1');
            console.log("Successfully dropped index 'id_1'");
        } catch (e) {
            console.log("Could not drop 'id_1' (maybe it doesn't exist or name is different):", e.message);
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected");
        process.exit(0);
    }
}

fixIndex();
