/**
 * @file changePasswordBundle.js
 * @description Secure Change Password Controller and Middleware Bundle.
 * This bundle is self-contained to avoid modifying the existing codebase of this group project.
 * It includes rate limiting, input complexity validation, JWT authentication, and security audit logging.
 *
 * Architecture Flow:
 *
 *       [ HTTP POST /change-password ]
 *                     │
 *                     ▼
 *      ┌─────────────────────────────┐
 *      │    Security Audit Logger    │ ──► Records incoming request details (IP, User-Agent)
 *      └─────────────────────────────┘
 *                     │
 *                     ▼
 *      ┌─────────────────────────────┐
 *      │    Sliding Window Limiter   │ ──► Double Rate Limit Check (IP-based and User-based)
 *      └─────────────────────────────┘
 *                     │
 *                     ▼
 *      ┌─────────────────────────────┐
 *      │  Authentication Middleware  │ ──► Validates JWT token & fetches active Mongoose User
 *      └─────────────────────────────┘
 *                     │
 *                     ▼
 *      ┌─────────────────────────────┐
 *      │   Password Complexity check │ ──► Checks rules (length, cases, numbers, symbols)
 *      └─────────────────────────────┘
 *                     │
 *                     ▼
 *      ┌─────────────────────────────┐
 *      │  Change Password Controller  │ ──► Compares old pass, saves new pass (hashes via pre-save)
 *      └─────────────────────────────┘
 * 
 * Standards Followed:
 * - OWASP ASVS v4.0.3 (Authentication Verification Requirements)
 * - NIST SP 800-63B (Digital Identity Guidelines: Memorized Secrets)
 * - RFC 7231 (HTTP Semantics for Rate Limiting and Client Errors)
 */

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

// =========================================================================
// 1. OPENAPI / SWAGGER DOCUMENTATION SPECIFICATIONS
// =========================================================================

/**
 * @swagger
 * /api/v1/change-password:
 *   post:
 *     summary: Securely update the logged-in user's password
 *     description: >
 *       Changes the password of the authenticated user. Validates the current password, 
 *       enforces strict complexity checks on the new password, and applies IP and user-level 
 *       rate limits to prevent credential stuffing and brute-force attacks.
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: The user's existing password.
 *                 example: "OldSecurePass123!"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: >
 *                   The new secure password. Must be 8-64 characters long, containing 
 *                   at least one uppercase letter, one lowercase letter, one number, and one special character.
 *                 example: "NewAwesomePass2026$"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: Must match newPassword exactly.
 *                 example: "NewAwesomePass2026$"
 *     responses:
 *       200:
 *         description: Password updated successfully. Invalidates previous tokens.
 *         headers:
 *           X-RateLimit-Limit:
 *             schema:
 *               type: integer
 *             description: Maximum requests allowed in the rate limit window.
 *           X-RateLimit-Remaining:
 *             schema:
 *               type: integer
 *             description: Remaining requests allowed within the current window.
 *           X-RateLimit-Reset:
 *             schema:
 *               type: integer
 *             description: Unix epoch timestamp representing when the rate limit resets.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully. Please log in again with your new credentials."
 *       400:
 *         description: Bad Request. Validation failed (e.g., passwords don't match, new password matches current, or fails complexity criteria).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Password complexity requirements not met."
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Password must contain at least one special character.", "Password must contain at least one number."]
 *       401:
 *         description: Unauthorized. Token missing, expired, or invalid; or current password verification failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials or unauthorized request."
 *       429:
 *         description: Too Many Requests. Rate limit exceeded (either per IP or per account user).
 *         headers:
 *           Retry-After:
 *             schema:
 *               type: integer
 *             description: Number of seconds to wait before making another request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Too many password change attempts. Please try again later."
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error during password reset."
 */


// =========================================================================
// 2. SECURITY AUDIT LOGGER UTILITY
// =========================================================================

class SecurityLogger {
  /**
   * Safe JSON-based logger to record key authentication and credential change events.
   * Ensures no passwords, hashes, or tokens are printed to the logs.
   * 
   * @param {string} event - The name of the event (e.g., 'PASSWORD_CHANGE_SUCCESS', 'RATE_LIMIT_TRIGGERED')
   * @param {object} metadata - Extra details containing context like IP, User-Agent, user ID, etc.
   * @param {string} severity - Severity level: 'INFO', 'WARN', 'ERROR', 'FATAL'
   */
  static logEvent(event, metadata = {}, severity = "INFO") {
    const timestamp = new Date().toISOString();
    
    // Mask sensitive properties if they leak by accident
    const sanitizedMetadata = { ...metadata };
    const sensitiveKeys = ["password", "currentPassword", "newPassword", "confirmPassword", "token", "authHeader", "authorization"];
    
    for (const key of sensitiveKeys) {
      if (sanitizedMetadata[key]) {
        sanitizedMetadata[key] = "[MASKED]";
      }
    }

    const logPayload = {
      timestamp,
      severity,
      event,
      details: sanitizedMetadata
    };

    const formattedLog = `[SECURITY AUDIT] ${JSON.stringify(logPayload)}`;

    if (severity === "ERROR" || severity === "FATAL") {
      console.error(formattedLog);
    } else if (severity === "WARN") {
      console.warn(formattedLog);
    } else {
      console.log(formattedLog);
    }
  }
}


// =========================================================================
// 3. CUSTOM SLIDING WINDOW RATE LIMITER CLASS
// =========================================================================

class SlidingWindowRateLimiter {
  /**
   * Constructs an in-memory Sliding Window Rate Limiter.
   * Multi-dimensional: limits requests by both IP address and User Identity (email/id).
   * 
   * @param {number} windowMs - Time window size in milliseconds
   * @param {number} maxIpRequests - Maximum requests allowed per IP address in windowMs
   * @param {number} maxUserRequests - Maximum requests allowed per User ID in windowMs
   * @param {number} cleanupIntervalMs - Interval to run garbage collection to delete expired windows (prevents memory leak)
   */
  constructor(windowMs = 15 * 60 * 1000, maxIpRequests = 5, maxUserRequests = 3, cleanupIntervalMs = 5 * 60 * 1000) {
    this.windowMs = windowMs;
    this.maxIpRequests = maxIpRequests;
    this.maxUserRequests = maxUserRequests;
    
    // Maps storing timestamp arrays
    // Key format: 'ip:<ip_address>' or 'user:<user_id>'
    this.store = new Map();
    
    // IP Blocklist for temporary block after repeated violations
    this.blocklist = new Map();
    this.blockDurationMs = 30 * 60 * 1000; // 30 minutes ban for extreme spamming

    // Start background garbage collector
    this.gcTimer = setInterval(() => this.cleanup(), cleanupIntervalMs);
    if (this.gcTimer.unref) {
      this.gcTimer.unref(); // Allow process to exit cleanly in testing environment
    }
  }

  /**
   * Cleans up expired timestamps in the store to free up memory.
   */
  cleanup() {
    const now = Date.now();
    const expiryTime = now - this.windowMs;

    for (const [key, timestamps] of this.store.entries()) {
      const validTimestamps = timestamps.filter(ts => ts > expiryTime);
      if (validTimestamps.length === 0) {
        this.store.delete(key);
      } else {
        this.store.set(key, validTimestamps);
      }
    }

    // Clean blocklist
    for (const [ip, blockExpires] of this.blocklist.entries()) {
      if (now > blockExpires) {
        this.blocklist.delete(ip);
        SecurityLogger.logEvent("IP_BLOCK_EXPIRED", { ip }, "INFO");
      }
    }
  }

  /**
   * Helper to retrieve client IP from Express request.
   * Handles trust proxies if they are configured.
   * 
   * @param {object} req - Express request object
   * @returns {string} Client IP address
   */
  getClientIp(req) {
    return (
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
      "unknown-ip"
    );
  }

  /**
   * Evaluates the rate limits for a given IP and User Identifier.
   * 
   * @param {string} ip - Client IP address
   * @param {string} userId - User identifier (if user is authenticated, else 'anonymous')
   * @returns {object} Rate limit status details
   */
  evaluate(ip, userId) {
    const now = Date.now();
    const cutoff = now - this.windowMs;

    // 1. Check Blocklist for IP
    if (this.blocklist.has(ip)) {
      const blockExpires = this.blocklist.get(ip);
      if (now < blockExpires) {
        const remainingSeconds = Math.ceil((blockExpires - now) / 1000);
        return {
          allowed: false,
          reason: "IP_BLOCKED",
          retryAfterSeconds: remainingSeconds,
          limit: this.maxIpRequests,
          remaining: 0,
          resetTime: blockExpires
        };
      } else {
        this.blocklist.delete(ip);
      }
    }

    const ipKey = `ip:${ip}`;
    const userKey = `user:${userId}`;

    // 2. Fetch or create timestamp logs
    let ipTimestamps = this.store.get(ipKey) || [];
    let userTimestamps = this.store.get(userKey) || [];

    // Filter out timestamps outside window
    ipTimestamps = ipTimestamps.filter(ts => ts > cutoff);
    userTimestamps = userTimestamps.filter(ts => ts > cutoff);

    // 3. Evaluate limits
    let allowed = true;
    let reason = null;
    let limitUsed = this.maxIpRequests;
    let remainingRequests = this.maxIpRequests - ipTimestamps.length;
    let oldestTimestamp = ipTimestamps[0] || now;

    // Check IP limit
    if (ipTimestamps.length >= this.maxIpRequests) {
      allowed = false;
      reason = "IP_LIMIT_EXCEEDED";
      limitUsed = this.maxIpRequests;
      remainingRequests = 0;
    }
    // Check User limit (if authenticated and not anonymous)
    else if (userId && userId !== "anonymous" && userTimestamps.length >= this.maxUserRequests) {
      allowed = false;
      reason = "USER_LIMIT_EXCEEDED";
      limitUsed = this.maxUserRequests;
      remainingRequests = 0;
      oldestTimestamp = userTimestamps[0] || now;
    }

    // 4. Calculate reset time
    const resetTime = oldestTimestamp + this.windowMs;
    const retryAfterSeconds = Math.max(0, Math.ceil((resetTime - now) / 1000));

    // 5. If allowed, record the request
    if (allowed) {
      ipTimestamps.push(now);
      this.store.set(ipKey, ipTimestamps);

      if (userId && userId !== "anonymous") {
        userTimestamps.push(now);
        this.store.set(userKey, userTimestamps);
      }
      
      remainingRequests = Math.max(0, limitUsed - ipTimestamps.length);
    } else {
      // If client continues to spam while already blocked/limited, flag for Blocklist
      if (reason === "IP_LIMIT_EXCEEDED" && ipTimestamps.length > this.maxIpRequests * 3) {
        const blockExpiry = now + this.blockDurationMs;
        this.blocklist.set(ip, blockExpiry);
        SecurityLogger.logEvent("IP_TEMP_BANNED", { ip, reason: "Spamming while limited" }, "WARN");
      }
    }

    return {
      allowed,
      reason,
      retryAfterSeconds,
      limit: limitUsed,
      remaining: remainingRequests,
      resetTime
    };
  }

  /**
   * Express middleware generator for rate limiting.
   */
  getMiddleware() {
    return (req, res, next) => {
      const ip = this.getClientIp(req);
      
      // Determine user ID if auth middleware has already run, or fallback to body email if present
      let userId = "anonymous";
      if (req.user && req.user._id) {
        userId = req.user._id.toString();
      } else if (req.body && req.body.email) {
        userId = `email:${req.body.email.toLowerCase().trim()}`;
      }

      const result = this.evaluate(ip, userId);

      // Set standard RFC headers
      res.setHeader("X-RateLimit-Limit", result.limit);
      res.setHeader("X-RateLimit-Remaining", result.remaining);
      res.setHeader("X-RateLimit-Reset", Math.ceil(result.resetTime / 1000));

      if (!result.allowed) {
        res.setHeader("Retry-After", result.retryAfterSeconds);
        
        SecurityLogger.logEvent("RATE_LIMIT_TRIGGERED", {
          ip,
          userId,
          reason: result.reason,
          retryAfterSeconds: result.retryAfterSeconds,
          userAgent: req.headers["user-agent"]
        }, "WARN");

        return res.status(429).json({
          status: false,
          message: "Too many password change attempts. Please try again after some time.",
          retryAfter: result.retryAfterSeconds
        });
      }

      next();
    };
  }
}