/**
 * Retry with Exponential Backoff
 * @param {Function} fn — async function to retry
 * @param {Object} opts
 * @param {number} opts.maxAttempts — default 3
 * @param {number} opts.baseDelayMs — default 1000
 * @param {Function} opts.shouldRetry — custom check (default: retry all errors)
 */
export async function withRetry(fn, opts = {}) {
  const {
    maxAttempts = 3,
    baseDelayMs = 1000,
    shouldRetry = () => true,
  } = opts;

  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      // لا نعيد المحاولة إذا:
      // - خطأ منطقي (validation, unauthorized)
      // - أو shouldRetry رجع false
      if (!shouldRetry(err, attempt)) throw err;

      if (attempt === maxAttempts) throw err;

      // Exponential backoff: 1s, 2s, 4s
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastError;
}

/**
 * هل الخطأ يستحق إعادة المحاولة؟
 */
export function isRetryableError(err) {
  if (!err) return false;
  const msg = String(err.message || err).toLowerCase();
  
  // أخطاء الشبكة
  if (msg.includes('fetch') || msg.includes('network') || 
      msg.includes('timeout') || msg.includes('failed to fetch')) return true;
  
  // أخطاء الـ 5xx
  if (err.status >= 500 && err.status < 600) return true;
  
  // غير قابلة لإعادة المحاولة
  if (msg.includes('invalid') || msg.includes('unauthorized') || 
      msg.includes('not found') || msg.includes('rate') ||
      msg.includes('تجاوزت') || msg.includes('غير صحيح')) return false;
  
  return false; // افتراضي: لا نعيد المحاولة
}
