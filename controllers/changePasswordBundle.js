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