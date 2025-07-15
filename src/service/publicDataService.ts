import DynamoDb from "@/utils/db/DynamoDB";
import {  ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const getData = async () => {
      const data = await DynamoDb.send(new ScanCommand({
        TableName: "customer_data",
      }));
      if(data.Items){
        const result = data.Items?.map((item) => unmarshall(item));
        return result;
      }else{
        return [];
      }
};
