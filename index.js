const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://oanagrecu09:gdOyFqrbIhLZwlhL@cluster0.hpttsr4.mongodb.net/?retryWrites=true&w=majority";

async function run() {
  const client = new MongoClient(uri);

  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected successfully to MongoDB!");

    const collection = client.db("test").collection("students");

    // Insert documents into the collection
    const result = await collection.insertMany([
      {
        name: "maria daass",
        age: 45,
        grade: "B",
      },
      {
        name: "dan naksjd",
        age: 25,
        grade: "C",
      },
      {
        name: "luc gfrvs",
        age: 15,
        grade: "C",
      },
    ]);

    console.log(
      `Inserted ${result.insertedCount} documents into the collection`
    );

    // Fetch and display all documents in the collection
    const docs = await collection.find({}).toArray();
    console.log(`Found ${docs.length} documents in the collection`);
    console.log(docs);
  } catch (err) {
    console.error("Error occurred:", err);
  } finally {
    // Close the connection when done or if there's an error
    await client.close();
  }
}

run().catch(console.error);
