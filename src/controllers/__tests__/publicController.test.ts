import { getPartnerData } from '../publicController';
import DynamoDb from '@/utils/db/DynamoDB';
import { GetItemCommand } from '@aws-sdk/client-dynamodb';

jest.mock('@/utils/db/DynamoDB', () => ({
  __esModule: true,
  default: { send: jest.fn() }
}));

const mockReq = (body = {}, headers = {}) => ({
  body,
  headers
});

const mockRes = () => {
  const res = {} as any;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('getPartnerData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if apiKey does not match', async () => {
    (DynamoDb.send as jest.Mock).mockResolvedValue({
      Item: {
        partnerId: { S: 'test1234' },
        apiKey: { S: 'correct-key' },
        hourlyLimit: { N: '10' },
        lastRequestedAt: { S: new Date().toISOString() }
      }
    });
    const req = mockReq({ partnerId: 'test1234' }, { 'x-api-key': 'wrong-key' });
    const res = mockRes();
    await getPartnerData(req as any, res as any);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ status: 401, message: 'Unauthorized' });
  });
}); 