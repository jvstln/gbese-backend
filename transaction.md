To test the API endpoints:

Create a transaction:
POST /api/v1/transactions
{
  "from": "user_id",
  "to": "recipient_id",
  "type": "transfer",
  "amount": 100,
  "description": "Test transfer"
}

Get all transactions:
GET /api/v1/transactions?page=1&limit=10

Get user's sent transactions:
GET /api/v1/transactions/user/:userId/sent


Get user's received transactions:
GET /api/v1/transactions/user/:userId/received