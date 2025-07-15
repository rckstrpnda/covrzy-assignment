import DynamoDb from "@/utils/db/DynamoDB";
import {
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { Request, Response } from "express";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import crypto from "crypto";


export const createPartner = async (req: Request, res: Response) => {
  try {
    const { partnerName } = req.body;
    const randomFourDigits = Math.floor(1000 + Math.random() * 9000);
    const partnerId =
      partnerName.length > 3
        ? partnerName.toLowerCase().slice(0, 4) + randomFourDigits
        : partnerName.toLowerCase() + randomFourDigits;
    const apiKey = crypto.randomBytes(32).toString("hex");
    const hourlyLimit = "100";
    const result = await DynamoDb.send(
      new PutItemCommand({
        TableName: "partnerData",
        Item: {
          partnerId: { S: partnerId },
          partnerName: { S: partnerName },
          apiKey: { S: apiKey },
          hourlyLimit: { N: hourlyLimit },
        },
      })
    );
    res.status(201).json({ partnerId, apiKey, result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating partner" });
  }
};


export const getUsage = async (req: Request, res: Response) => {
  try {
    const { partnerId } = req.params;
    const result = await DynamoDb.send(
      new GetItemCommand({
        TableName: "partnerData",
        Key: { partnerId: { S: partnerId } },
      })
    );
    if (result.Item) {
      const data = unmarshall(result.Item);
      res.status(200).json({ status: 200, message: "Success", data: data });
    } else {
      res.status(404).json({ status: 404, message: "Partner not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Error getting usage" });
  }
};


export const updateUsage = async (req: Request, res: Response) => {
  try {
    const { partnerId, hourlyLimit } = req.body;
    const result = await DynamoDb.send(
      new UpdateItemCommand({
        TableName: "partnerData",
        Key: { partnerId: { S: partnerId } },
        UpdateExpression: "set hourlyLimit = :hourlyLimit",
        ExpressionAttributeValues: { ":hourlyLimit": { N: hourlyLimit } },
      })
    );
    res.status(200).json({ status: 200, message: "Success", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Error updating usage" });
  }
};
export const healthCheck = async (req: Request, res: Response) => {
  res.status(200).json({ message: "OK" });
};
