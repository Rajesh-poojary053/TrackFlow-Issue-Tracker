
require("dotenv").config();

const connectDB = require("./config/db");
const User = require("./models/User");

const createAdmin = async () => {
    try {
        await connectDB();

        const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

        if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
            throw new Error("Admin environment variables are missing");
        }

        if (ADMIN_PASSWORD.length < 8) {
            throw new Error("Admin password must contain at least 8 characters");
        }

        const email = ADMIN_EMAIL.toLowerCase().trim();

        let admin = await User.findOne({ email });

        if (admin) {
            if (admin.role !== "admin") {
                throw new Error("This email already belongs to a regular user");
            }

            admin.name = ADMIN_NAME;
            admin.password = ADMIN_PASSWORD;

            await admin.save();

            console.log("Existing admin password updated successfully!");
        } else {
            await User.create({
                name: ADMIN_NAME,
                email,
                password: ADMIN_PASSWORD,
                role: "admin"
            });

            console.log("Admin account created successfully!");
        }

        process.exit(0);

    } catch (error) {
        console.error("Admin setup failed:", error.message);
        process.exit(1);
    }
};

createAdmin();
