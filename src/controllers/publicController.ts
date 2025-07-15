import { Request, Response } from "express";
import { getData } from "@/service/publicDataService";
import { GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import DynamoDb from "@/utils/db/DynamoDB";
import { unmarshall } from "@aws-sdk/util-dynamodb";
export const getPartnerData = async (req: Request, res: Response) => {
  try {
    const { partnerId } = req.body;
    const apiKey = req.headers["x-api-key"];
    const rawResult = await DynamoDb.send(
      new GetItemCommand({
        TableName: "partnerData",
        Key: { partnerId: { S: partnerId } },
      })
    );
    if (rawResult.Item) {
      const result = unmarshall(rawResult.Item);
      if (result.apiKey === apiKey) {
        const now = new Date();
        const lastRequestedAt = result.lastRequestedAt ? new Date(result.lastRequestedAt) : null;
        let newHourlyLimit = result.hourlyLimit;
        if (
          !lastRequestedAt ||
          now.getHours() !== lastRequestedAt.getHours() ||
          now.getDate() !== lastRequestedAt.getDate() ||
          now.getMonth() !== lastRequestedAt.getMonth() ||
          now.getFullYear() !== lastRequestedAt.getFullYear()
        ) {
          newHourlyLimit = 100;
        }
        if (newHourlyLimit > 0) {
          const updatedResult = await DynamoDb.send(
            new UpdateItemCommand({
              TableName: "partnerData",
              Key: { partnerId: { S: partnerId } },
              UpdateExpression: "SET hourlyLimit = :hourlyLimit, lastRequestedAt = :lastRequestedAt",
              ExpressionAttributeValues: {
                ":hourlyLimit": { N: (newHourlyLimit - 1).toString() },
                ":lastRequestedAt": { S: now.toISOString() },
              },
              ReturnValues: "ALL_NEW",
            })
          );
          const data = await getData();
          res.status(200).json({ status: 200, message: "Success", data: { data, limitRemaining: newHourlyLimit - 1 } });
        } else {
          res.status(429).json({ status: 429, message: "Too Many Requests" });
        }
      } else {
        res.status(401).json({ status: 401, message: "Unauthorized" });
      }
    } else {
      res.status(401).json({ status: 401, message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};
