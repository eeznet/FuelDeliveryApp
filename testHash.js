import bcrypt from "bcryptjs";

const testPassword = "Driver@123"; // Use the same password as login

const hashPassword = async () => {
    try {
        const saltRounds = 10;
        const hashed = await bcrypt.hash(testPassword, saltRounds);
        console.log("🔑 Hashed Password:", hashed);

        const isMatch = await bcrypt.compare(testPassword, hashed);
        console.log("✅ Password Match:", isMatch);
    } catch (error) {
        console.error("❌ Error during password hashing:", error);
    }
};

hashPassword();
