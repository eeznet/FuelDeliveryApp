import bcrypt from "bcryptjs";

// Hashed password from MongoDB (replace with the actual hash stored in MongoDB)
const hashedPassword = "$2a$10$/LplBtsEW62orRVIpOQuruGbdRd0wkwYEUIsczqLKGaX.qkSMWgES"; 
const inputPassword = "StrongPass123"; // The plain password you want to compare

const checkPassword = async () => {
    try {
        const match = await bcrypt.compare(inputPassword, hashedPassword);
        console.log(match ? "✅ Password match" : "❌ Password does NOT match");
    } catch (error) {
        console.error("❌ Error during password comparison:", error);
    }
};

checkPassword();
