const defaultRevokeDelay = 1000;

const isAbsoluteHttpUrl = (url) => /^https?:\/\//i.test(url);

const isBlobOrDataUrl = (url) => /^(blob|data):/i.test(url);

const getFilenameFromUrl = (url) => {
  try {
    const parsedUrl = new URL(url, window.location.href);
    const pathname = parsedUrl.pathname;
    const name = decodeURIComponent(pathname.split('/').filter(Boolean).pop() ?? '');
    return name || undefined;
  } catch {
    const name = decodeURIComponent(url.split('?')[0]?.split('/').filter(Boolean).pop() ?? '');
    return name || undefined;
  }
};

const getFilenameFromDisposition = (contentDisposition) => {
  if (!contentDisposition) {
    return undefined;
  }

  const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1].trim().replaceAll('"', ''));
  }

  const filenameMatch = /filename=([^;]+)/i.exec(contentDisposition);
  return filenameMatch?.[1]?.trim().replace(/^"|"$/g, '');
};

const triggerAnchorDownload = (url, filename, revokeDelay = defaultRevokeDelay) => {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.style.display = 'none';

  if (filename) {
    anchor.download = filename;
  }

  document.body.append(anchor);
  anchor.click();
  anchor.remove();

  if (url.startsWith('blob:')) {
    window.setTimeout(() => URL.revokeObjectURL(url), revokeDelay);
  }
};

const normalizeOptions = (input, options) =>
  typeof input === 'string' ? { ...options, url: input } : input;

export async function downloadFile(input, options) {
  const normalizedOptions = normalizeOptions(input, options);
  const {
    url,
    filename,
    method = 'GET',
    headers,
    body,
    credentials = 'include',
    signal,
    forceFetch = true,
    revokeDelay = defaultRevokeDelay,
  } = normalizedOptions;

  if (!forceFetch || isBlobOrDataUrl(url)) {
    triggerAnchorDownload(url, filename ?? getFilenameFromUrl(url), revokeDelay);
    return;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: method.toUpperCase() === 'GET' || method.toUpperCase() === 'HEAD' ? undefined : body,
      credentials,
      signal,
    });

    if (!response.ok) {
      throw new Error(response.statusText || `HTTP ${String(response.status)}`);
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const responseFilename = getFilenameFromDisposition(
      response.headers.get('content-disposition'),
    );
    triggerAnchorDownload(
      objectUrl,
      filename ?? responseFilename ?? getFilenameFromUrl(url),
      revokeDelay,
    );
  } catch (error) {
    if (isAbsoluteHttpUrl(url)) {
      triggerAnchorDownload(url, filename ?? getFilenameFromUrl(url), revokeDelay);
      return;
    }

    throw error;
  }
}
