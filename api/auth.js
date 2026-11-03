'use strict';

const crypto = require('node:crypto');
const { promisify } = require('node:util');
const { db } = require('./db');

const scrypt = promisify(crypto.scrypt);

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MIN_PASSWORD_LENGTH = 12;

async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = await scrypt(password, salt, 32);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

async function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const candidate = await scrypt(password, Buffer.from(salt, 'hex'), 32);
  return crypto.timingSafeEqual(candidate, Buffer.from(hash, 'hex'));
}

// Compared against when the email is unknown, so a login takes the same time either way.
const UNKNOWN_ADMIN_HASH = `${'00'.repeat(16)}:${'00'.repeat(32)}`;

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

async function login(email, password) {
  const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(String(email).trim().toLowerCase());
  const valid = await verifyPassword(String(password), admin ? admin.password_hash : UNKNOWN_ADMIN_HASH);
  if (!admin || !valid) return null;

  db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(Date.now());
  const token = crypto.randomBytes(32).toString('base64url');
  db.prepare('INSERT INTO sessions (token_hash, admin_id, expires_at) VALUES (?, ?, ?)')
    .run(hashToken(token), admin.id, Date.now() + SESSION_TTL_MS);
  return token;
}

function isAuthenticated(req) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) return false;
  const session = db.prepare('SELECT expires_at FROM sessions WHERE token_hash = ?').get(hashToken(token));
  return Boolean(session) && session.expires_at > Date.now();
}

// Creates the admin or changes its password, and signs out its existing sessions.
async function setAdminPassword(email, password) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`The admin password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
  const normalized = email.trim().toLowerCase();
  const hash = await hashPassword(password);
  db.prepare(`
    INSERT INTO admins (email, password_hash) VALUES (?, ?)
    ON CONFLICT (email) DO UPDATE SET password_hash = excluded.password_hash
  `).run(normalized, hash);
  db.prepare('DELETE FROM sessions WHERE admin_id = (SELECT id FROM admins WHERE email = ?)').run(normalized);
}

async function ensureFirstAdmin() {
  if (db.prepare('SELECT 1 FROM admins LIMIT 1').get()) return;

  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD === 'change-me') {
    console.warn('No admin exists yet: set ADMIN_EMAIL and ADMIN_PASSWORD in .env and restart');
    return;
  }
  try {
    await setAdminPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log(`Created admin ${ADMIN_EMAIL.trim().toLowerCase()}`);
  } catch (err) {
    console.warn(`No admin created: ${err.message}`);
  }
}

module.exports = { login, isAuthenticated, setAdminPassword, ensureFirstAdmin };
