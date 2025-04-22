# Gbese Backend

A fintech application that allows users to transfer their debt to someone else. This is the backend service that powers the Gbese platform.

## Description

Gbese is a revolutionary fintech platform that facilitates debt transfer between users. The name "Gbese" is derived from a colloquial term for debt, making it relatable and easy to remember.

## Features

- RESTful API endpoints
- MongoDB database integration
- Express.js server with TypeScript

## Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB with Mongoose
- Other key dependencies:
  - cors
  - cookie-parser
  - dotenv

## Prerequisites

Before running this project, make sure you have:

- Node.js installed
- MongoDB installed and running locally
- Git for version control

## Installation

1. Clone the repository:

```bash
git clone https://github.com/jvstln/gbese-backend.git
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following configurations:

Take a look at the `.env.example` file to see the required configurations.

## Development

To start the development server:

```bash
npm run dev
```

The server will start on port 4000 (or the port specified in your .env file).

## Project Structure

```
gbese-backend/
├── src/
│   ├── lib/
│   │   └── db.ts         # Database connection setup
│   ├── app.ts            # Main application entry
│   ├── index.route.ts    # Main route definitions
│   └── index.middleware.ts # Middleware configurations
├── .env.example          # Example environment variables
├── .gitignore           # Git ignore rules
├── package.json         # Project dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## API Endpoints

- `GET /api/v1/` - Welcome endpoint that returns a greeting message
