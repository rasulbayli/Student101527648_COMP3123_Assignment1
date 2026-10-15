# COMP3123 Assignment 1 Backend API

A secure employee management REST API built with Express, Mongoose, and MongoDB. Users register and log in to receive JWTs; each employee record is scoped to its creator. The API includes validation, rate limits, security headers, local logs, and a health check.

## Setup

Use Node.js 20 or newer and MongoDB. Run `npm install`, copy `.env.example` to `.env`, set `MONGODB_URI` and a random `JWT_SECRET` of at least 32 characters, then run `npm start`. The database is named `comp3123_assignment1`. Use `npm run dev` during development. Import the Postman collection and set `baseUrl` to `http://localhost:3000` or your deployed URL.

## Environment variables

`PORT` (default 3000), `MONGODB_URI`, `JWT_SECRET` (32+ characters), `JWT_EXPIRES_IN` (default `1h`), and `NODE_ENV`. Never commit `.env` or production credentials.

## API endpoints

| Method | Path | Auth | Success |
|---|---|---|---|
| GET | `/health` | No | 200 |
| POST | `/api/v1/user/signup` | No | 201 |
| POST | `/api/v1/user/login` | No | 200 |
| GET | `/api/v1/emp/employees` | Bearer JWT | 200 |
| POST | `/api/v1/emp/employees` | Bearer JWT | 201 |
| GET | `/api/v1/emp/employees/{eid}` | Bearer JWT | 200 |
| PUT | `/api/v1/emp/employees/{eid}` | Bearer JWT | 200 |
| DELETE | `/api/v1/emp/employees?eid={eid}` | Bearer JWT | 204 |

Signup accepts `username`, `email`, and `password` (minimum 8 characters). Login accepts either `username` or `email` plus `password`. Employee create/update accepts `first_name`, `last_name`, `email`, `position`, `salary`, `date_of_joining` (ISO date), and `department`. The owner ID always comes from the verified JWT.

Send `Authorization: Bearer <token>` for employee routes. Successful login returns a JWT. Employee database queries include both the employee ID and authenticated user's ID, so another user's record returns 404 and cannot be read, updated, or deleted.

## Security and errors

Passwords are hashed with bcryptjs (12 rounds) and never returned. JWTs are signed with `JWT_SECRET` and expire. Helmet sets security headers. express-validator checks fields, formats, salary, dates, and IDs. General traffic is limited to 300 requests per 15 minutes per IP. Signup and login each have a separate limit of 10 requests per 15 minutes per IP. Exceeding a limit returns 429 with a JSON error. The Postman collection includes burst tests for both authentication routes. Typical statuses: 400 validation, 401 authentication, 404 route/employee (including unowned records), 409 duplicate account, 429 rate limit, and 500 unexpected errors.

## Logging and health

Request logs and application events go to `logs/app.log` locally, including timestamp, method/path/status and authentication, validation, authorization, startup, and error events. On Vercel, the logger writes to writable, ephemeral `/tmp/logs/app.log`; use Vercel function logs for deployed diagnostics. Passwords and full tokens are excluded. A sanitized example is in `logs/sample.log`. `GET /health` reports service state, MongoDB connection state, and timestamp.

## Postman evidence

The collection contains 66 ordered requests with assertions for success, duplicate accounts, invalid/missing input, authentication, CRUD, both directions of cross-user access, non-existing records, malformed IDs/JSON, response security headers, and 429 rate limiting. Run it against a test database you control. It creates two throwaway users and stores JWTs and employee IDs as collection variables. It uses reserved test IP addresses in `X-Forwarded-For` to keep the ordinary validation checks separate from the deliberate rate-limit bursts; use this collection only with a test API. Sample marking password: `ExamplePass123!`; usernames and emails are generated for each run. Do not reuse this sample password for a real account.

## Vercel deployment

`api/index.js` and `vercel.json` configure Express for Vercel. Add `MONGODB_URI`, `JWT_SECRET`, and optionally `JWT_EXPIRES_IN` to Vercel project environment variables, deploy, and check `/health`. Configure MongoDB Atlas access for the deployment.

## Project structure

`src/config` database setup; `src/models` User and Employee; `src/routes` and `src/controllers` endpoints; `src/middleware` auth, validation, and errors; `src/validators` request rules; `src/utils` logging; `postman/` the importable collection.
