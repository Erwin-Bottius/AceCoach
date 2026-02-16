const path = require("path");
const dotenv = require("dotenv");
const env = process.env.NODE_ENV || "dev";
const envFile = path.resolve(__dirname, `.env.${env}`);
dotenv.config({ path: envFile });
