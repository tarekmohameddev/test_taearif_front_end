import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || process.env.MONGODB_SECURE_CODE || "";

if (!uri) {
  throw new Error(
    "MONGODB_URI (or MONGODB_SECURE_CODE) must be set in environment variables",
  );
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise as Promise<MongoClient>;

export default clientPromise;
