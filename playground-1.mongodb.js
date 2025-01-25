const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // To load environment variables from .env

// Load the MongoDB URI from the .env file
const uri = process.env.MONGO_URI;

// Create a new MongoClient instance
const client = new MongoClient(uri);

// Define the function to connect to the database and perform operations
async function connectToDB() {
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected to MongoDB!");

    // Access the database
    const database = client.db("fuelDeliveryApp");

    // Create a collection for users (if it doesn't already exist)
    const usersCollection = database.collection("users");

    // Hash the password before inserting it
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Insert a test document into the users collection
    const insertUserResult = await usersCollection.insertOne({
      email: "testuser@example.com",
      password: hashedPassword, // Storing the hashed password
      role: "driver",
      created_at: new Date(),
    });
    console.log("User document inserted:", insertUserResult.insertedId);

    // Create a collection for invoices (if it doesn't already exist)
    const invoicesCollection = database.collection("invoices");

    // Insert a test document into the invoices collection
    const insertInvoiceResult = await invoicesCollection.insertOne({
      user_id: insertUserResult.insertedId, // Referencing the inserted user ID
      amount: 500.00,
      status: "outstanding",
      created_at: new Date(),
    });
    console.log("Invoice document inserted:", insertInvoiceResult.insertedId);

    // Create a collection for truck locations (if it doesn't already exist)
    const truckLocationsCollection = database.collection("truck_locations");

    // Insert a test document into the truck_locations collection
    const insertLocationResult = await truckLocationsCollection.insertOne({
      lat: 40.712776,
      lng: -74.005974,
      created_at: new Date(),
    });
    console.log("Truck location document inserted:", insertLocationResult.insertedId);

  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    // Ensure the client is closed after the operations are done
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

// Call the connectToDB function
connectToDB();
