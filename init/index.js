// This file is responsible for initializing the database with sample data. It connects to the MongoDB database, clears any existing listings, and then inserts a predefined set of listings from the `data.js` file. Each listing is associated with a specific owner (user) by setting the `owner` field to a fixed user ID. This allows for testing and development with a consistent dataset.
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) =>({...obj , owner : '67d31ddd10fb3362779053d7'}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();