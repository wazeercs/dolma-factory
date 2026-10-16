/**
 * Retry with bounded exponential backoff and jitter.
 */
export async function withRetry(fn, opts = {}) {
  const {
    maxAttempts = 3,
    baseDelayMs = 1000,
    maxDelayMs = 8000,
    shouldRetry = () => true,
  } = opts;

  if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }

  const attempts = Math.max(1, Math.floor(Number(maxAttempts) || 1));
  const baseDelay = Math.max(0, Number(baseDelayMs) || 0);
  const maxDelay = Math.max(baseDelay, Number(maxDelayMs) || 0);

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= attempts || !shouldRetry(err, attempt)) {
        throw err;
      }

      const exponentialDelay = Math.min(
        maxDelay,
        baseDelay * Math.pow(2, attempt - 1)
      );

      const jitteredDelay = Math.round(
        exponentialDelay * (0.8 + Math.random() * 0.4)
      );

      await new Promise((resolve) => setTimeout(resolve, jitteredDelay));
    }
  }
}

/**
 * Return true only for likely transient network and server errors.
 */
export function isRetryableError(err) {
  if (!err) return false;

  const message = String(err.message || err).toLowerCase();
  const status = Number(err.status);

  if (status >= 500 && status < 600) return true;

  if (
    status === 429 ||
    (status >= 400 && status < 500)
  ) {
    return false;
  }

  if (
    message.includes('failed to fetch') ||
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('timed out') ||
    message.includes('connection reset') ||
    message.includes('load failed')
  ) {
    return true;
  }

  return err instanceof TypeError && message.includes('fetch');
}
