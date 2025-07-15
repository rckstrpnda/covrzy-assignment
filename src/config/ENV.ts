import dotenv from "dotenv";
dotenv.config({ quiet: true });
const env = {
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY || "",
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY || "",
  AWS_REGION: process.env.AWS_REGION || "",
  LOCAL_ENDPOINT: process.env.LOCAL_ENDPOINT || "",
  PORT: process.env.PORT || "",
  ADMIN_API_KEY: process.env.ADMIN_API_KEY || "",
};

export default env;
