
const { z } = require('zod');

const {
    rateLimit,
    ipBlocker,
    validateRequest
} = require('@shubhansh28/api-guard-js');

// Limit repeated login and signup requests
const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    maxRequests: 10
});

// Validate login and signup request bodies
const validateAuthRequest = validateRequest({
    body: z.object({
        username: z.string().trim().min(1),
        password: z.string().min(1)
    })
});

// Read blocked IPs from environment variables
const blockedIPs = (process.env.API_GUARD_BLOCKED_IPS || '')
    .split(',')
    .map(ip => ip.trim())
    .filter(Boolean);

// Apply IP blocking only when blocked IPs are configured
const ipBlockerMiddleware = blockedIPs.length
    ? ipBlocker({ blockedIPs })
    : (req, res, next) => next();

module.exports = {
    authRateLimit,
    validateAuthRequest,
    ipBlockerMiddleware
};
