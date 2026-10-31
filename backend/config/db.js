
const mongoose = require("mongoose");
const dns = require("dns");

// Use alternative DNS servers for MongoDB SRV lookup
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        throw error;
    }
};

module.exports = connectDB;
