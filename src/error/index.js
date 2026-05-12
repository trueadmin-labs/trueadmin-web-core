export class ApiError extends Error {
  constructor(code, message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

const isRecord = (value) => typeof value === 'object' && value !== null;

const readString = (value) => (typeof value === 'string' && value !== '' ? value : undefined);

const readStatus = (value) => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string' && value !== '') {
    const status = Number(value);
    return Number.isFinite(status) ? status : undefined;
  }

  return undefined;
};

const fromRecord = (record) => {
  const code = readString(record.code) ?? readString(record.errorCode);
  const message = readString(record.message) ?? readString(record.errorMessage);
  const status = readStatus(record.status) ?? readStatus(record.statusCode);

  if (code || message || status) {
    return new ApiError(
      code ?? (status ? `HTTP.${status}` : 'WEB.UNKNOWN'),
      message ?? '请求失败',
      status,
      record,
    );
  }

  return undefined;
};

export const normalizeError = (error) => {
  if (error instanceof ApiError) {
    return error;
  }

  if (isRecord(error)) {
    const normalized = fromRecord(error);
    if (normalized) {
      return normalized;
    }

    for (const key of ['details', 'response', 'body', 'data', 'error']) {
      const nested = error[key];
      if (!isRecord(nested)) {
        continue;
      }
      const nestedNormalized = fromRecord(nested);
      if (nestedNormalized) {
        return nestedNormalized;
      }
    }
  }

  if (error instanceof Error) {
    return new ApiError(error.name || 'WEB.ERROR', error.message || '未知错误', undefined, error);
  }

  return new ApiError(
    'WEB.UNKNOWN',
    typeof error === 'string' && error !== '' ? error : '未知错误',
  );
};

const listeners = new Set();

const logError = (error, normalized, policy) => {
  if (typeof console === 'undefined') {
    return;
  }

  console.error('[TrueAdminError]', {
    code: normalized.code,
    message: normalized.message,
    status: normalized.status,
    details: normalized.details,
    policy,
    error,
  });
};

export const errorCenter = {
  subscribe(listener) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
  emit(error, policy) {
    const normalized = normalizeError(error);
    logError(error, normalized, policy);
    for (const listener of listeners) {
      listener({ error: normalized, policy });
    }
  },
};
