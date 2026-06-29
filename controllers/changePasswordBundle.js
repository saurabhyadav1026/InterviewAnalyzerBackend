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