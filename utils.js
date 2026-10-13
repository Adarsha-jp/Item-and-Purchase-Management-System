// Shared helpers: HttpError, validators, async wrapper, stock status.

class HttpError extends Error {
  constructor(status, message, extra = {}) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Parses a positive integer id from a route param / body value. Throws 400 if malformed.
function parseId(value, label = 'ID') {
  const s = String(value ?? '').trim();
  if (!/^\d+$/.test(s) || Number(s) < 1 || !Number.isSafeInteger(Number(s))) {
    throw new HttpError(400, `Invalid ${label}`);
  }
  return Number(s);
}

// Strict YYYY-MM-DD that is also a real calendar date.
function parseDate(value, label = 'Purchase date') {
  if (value === undefined || value === null || String(value).trim() === '') {
    throw new HttpError(400, `${label} is required`);
  }
  const s = String(value).trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) throw new HttpError(400, `${label} must be a valid date in YYYY-MM-DD format`);
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) {
    throw new HttpError(400, `${label} must be a valid date in YYYY-MM-DD format`);
  }
  return s;
}

// Whole number >= 0 (used for stock).
function parseStock(value) {
  if (value === undefined || value === null || String(value).trim() === '') {
    throw new HttpError(400, 'Stock available is required');
  }
  const n = Number(value);
  if (!Number.isFinite(n) || !Number.isInteger(n)) throw new HttpError(400, 'Stock must be a whole number');
  if (n < 0) throw new HttpError(400, 'Stock cannot be negative');
  if (n > 2147483647) throw new HttpError(400, 'Stock value is too large');
  return n;
}

// Whole number > 0 (used for purchase quantity).
function parseQuantity(value) {
  const n = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  if (typeof n !== 'number' || !Number.isFinite(n)) throw new HttpError(400, 'Quantity must be a positive number');
  if (!Number.isInteger(n)) throw new HttpError(400, 'Quantity must be a whole number');
  if (n <= 0) throw new HttpError(400, 'Quantity must be greater than zero');
  if (n > 2147483647) throw new HttpError(400, 'Quantity is too large');
  return n;
}

function parseActive(value) {
  if (value === true || value === 1 || value === '1' || value === 'true') return 1;
  if (value === false || value === 0 || value === '0' || value === 'false') return 0;
  throw new HttpError(400, 'Status (active) is required and must be true or false');
}

function parseName(value, label) {
  if (typeof value !== 'string' || value.trim() === '') throw new HttpError(400, `${label} is required`);
  const s = value.trim();
  if (s.length > 150) throw new HttpError(400, `${label} must be at most 150 characters`);
  return s;
}

// Require a JSON object body.
function requireBody(req) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    throw new HttpError(400, 'Request body must be a JSON object');
  }
  return req.body;
}

const LOW_STOCK_LIMIT = 5;
function availability(stock) {
  if (stock === 0) return 'Out of Stock';
  if (stock <= LOW_STOCK_LIMIT) return 'Low Stock';
  return 'In Stock';
}

module.exports = {
  HttpError, asyncHandler, parseId, parseDate, parseStock, parseQuantity,
  parseActive, parseName, requireBody, availability, LOW_STOCK_LIMIT,
};
