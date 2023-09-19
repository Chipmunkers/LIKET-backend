import { MongoClient } from "mongodb";
import env from "../config/env";

export default new MongoClient(`mongodb://${env.mongoUser}:${env.mongoPassword}@${env.mongoHost}:${env.mongoPort}/${env.mongoDatabase}?authSource=admin`);
