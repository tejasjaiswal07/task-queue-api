# Task Queue API

This is a Node.js API cluster with task queuing and rate limiting capabilities.

## Features

- Node.js API cluster with multiple workers
- Rate limiting: 1 task per second and 20 tasks per minute per user
- Task queuing system using Redis
- Logging of task completions
- Error handling and worker resilience

## Prerequisites

- Node.js (v14 or later recommended)
- Redis server

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/task-queue-api.git
   cd task-queue-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the following (adjust as needed):
   ```
   PORT=3000
   REDIS_URL=redis://localhost:6379
   LOG_LEVEL=info
   LOG_FILE=logs/task_logs.txt
   ```

## Running the Application

To start the server:

```
npm start
```

For development with auto-reloading:

```
npm run dev
```

## API Endpoint

POST `/api/v1/task`

Request body:
```json
{
  "user_id": "123"
}
```

## Testing

You can use tools like curl or Postman to test the API. Example curl command:

```
curl -X POST -H "Content-Type: application/json" -d '{"user_id":"123"}' http://localhost:3000/api/v1/task
```

## Logging

Logs are stored in the file specified by `LOG_FILE` in the `.env` file. By default, it's `logs/task_logs.txt`.

## Error Handling

The application includes error handling for various scenarios, including worker crashes and Redis connection issues.

## Scaling

The application uses Node.js cluster module to utilize all available CPU cores. To adjust the number of workers, modify the `numCPUs` variable in `src/server.js`.
