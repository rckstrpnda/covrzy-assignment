# Covrzy API

This project is a Node.js/Express backend that uses AWS DynamoDB for data storage. It provides endpoints for partner management and public data access with API key and hourly rate limiting.

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- AWS account with DynamoDB access
- AWS credentials configured (see below)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd covrzy
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following:

```
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
PORT=8080
```

- Replace the values with your actual AWS credentials and desired port.

### 4. DynamoDB Table Setup
Ensure you have a DynamoDB table named `partnerData` with at least the following attributes:
- `partnerId` (Partition Key, String)
- `partnerName` (String)
- `apiKey` (String)
- `hourlyLimit` (Number)
- `lastRequestedAt` (String, ISO date)

also ensure you have a table called `customer_data` so that you can get the dummy data

You can create this table via the AWS Console or AWS CLI.

### 5. Run the Server
```bash
npm run dev
# or
npm start
```

The server should now be running on the port specified in your `.env` file (default: 3000).

## API Endpoints

- `POST /admin/create-partner` — Create a new partner and API key
- `GET /admin/usage/:partnerId` — Get partner usage info
- `POST /admin/partners` — Update partner usage limit
- `POST /public/data` — Public endpoint for data access (requires API key)

## Notes
- Make sure your AWS credentials have permission to access DynamoDB.
- The rate limit resets at the start of each hour (e.g., 10:00, 11:00, etc.).

