const axios = require('axios');
const fs = require('fs');
const Redis = require('ioredis');
const { promisify } = require('util');

// Constants
const API_URL = 'http://localhost:3000/api/v1/task';
const REDIS_URL = 'redis://localhost:6379';
const LOG_FILE = 'logs/task_logs.txt';

// Redis and promisify setup
const redis = new Redis(REDIS_URL);
const sleep = promisify(setTimeout);

// Helper function to send a request
async function sendRequest(userId) {
    try {
        // Ensure axios.post is correctly called
        const response = await axios.post(API_URL, { user_id: userId });
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;  // If there's a response, log the error data
        } else {
            return { error: 'Network error or server unavailable' };
        }
    }
}

// Check rate-limiting functionality
async function checkRateLimit() {
    console.log('\n--- Checking Rate Limit ---');
    const userId = 'test-user';
    
    // Test rate-limiting by sending 2 requests within 1 second
    console.log('Sending 2 requests in 1 second:');
    const results1 = await Promise.all([sendRequest(userId), sendRequest(userId)]);
    console.log(results1);

    // Wait for a second before continuing
    await sleep(1000);

    // Test rate-limiting by sending 21 requests in 1 minute
    console.log('\nSending 21 requests in 1 minute:');
    const results2 = [];
    for (let i = 0; i < 21; i++) {
        results2.push(await sendRequest(userId));
        await sleep(100);  // Small delay between requests
    }
    console.log(results2.slice(-2));  // Show only the last 2 results
}

// Check task queue length
async function checkQueueing() {
    console.log('\n--- Checking Queueing ---');
    const queueLength = await redis.llen('tasks');  // Fetch Redis list length
    console.log(`Current queue length: ${queueLength}`);
}

// Check logs for recent activity
function checkLogging() {
    console.log('\n--- Checking Logging ---');
    // Ensure fs.readFileSync is used correctly
    const logContent = fs.readFileSync(LOG_FILE, 'utf8');
    const lastLogLines = logContent.split('\n').slice(-5).join('\n');
    console.log('Last 5 log entries:');
    console.log(lastLogLines);
}

// Test error handling by sending an invalid request
async function checkErrorHandling() {
    console.log('\n--- Checking Error Handling ---');
    // Sending a request without required fields like user_id
    const invalidResponse = await axios.post(API_URL, {}, { validateStatus: () => true });
    console.log('Response for request without user_id:', invalidResponse.data);
}

// Run all tests sequentially
async function runTests() {
    console.log('Starting comprehensive test of Task Queue API');
    
    // Sequentially run each test
    await checkRateLimit();
    await checkQueueing();
    checkLogging();
    await checkErrorHandling();

    console.log('\nTest completed. Please review the results above.');
    process.exit(0);  // Exit the process once testing is done
}

// Run the test suite
runTests().catch(console.error);
