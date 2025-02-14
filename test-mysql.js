import pool from "./config/database.js"; // Importing the MySQL connection pool

(async () => {
    try {
        // Execute a simple query to test the connection
        const [rows] = await pool.query("SELECT 1+1 AS test");
        console.log("✅ MySQL Connected:", rows); // Logs the result of the query (should be [ { test: 2 } ])
    } catch (error) {
        // If there is an error connecting, log it to the console
        console.error("❌ MySQL Connection Error:", error.message);
    }
})();
