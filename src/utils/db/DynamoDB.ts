import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import env from "@/config/ENV";

const DynamoDb = new DynamoDBClient({

  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_KEY,
  },
});

export default DynamoDb;
