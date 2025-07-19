const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust path if needed
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const seedUsers = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const hashedPassword = await bcrypt.hash("yourpassword123", 10);
        let insertedCount = 0;

        // Admin user
        const adminExists = await User.findOne({ email: "admin@gmail.com" });
        if (!adminExists) {
            await User.create({
                name: "Admin",
                email: "admin@gmail.com",
                password: hashedPassword,
                role: "admin",
                blocked: false,
            });
            insertedCount++;
            console.log("✅ Admin user inserted.");
        } else {
            console.log("ℹ️ Admin already exists.");
        }

        // 49 regular users
        for (let i = 1; i <= 49; i++) {
            const email = `user${i}@gmail.com`;
            const existingUser = await User.findOne({ email });

            if (!existingUser) {
                await User.create({
                    name: `User ${i}`,
                    email,
                    password: hashedPassword,
                    role: "user",
                    blocked: false,
                });
                insertedCount++;
            }
        }

        console.log(`✅ ${insertedCount} new users inserted.`);
    } catch (err) {
        console.error("❌ Seeding error:", err);
    } finally {
        mongoose.disconnect();
    }
};

seedUsers();
