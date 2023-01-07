import { request } from 'undici';
import path from 'path';
import fs from 'fs/promises';

/**
 *
 * Fetches a buffer from a URL. If the URL is a local file and allowFS is true, it will read the file.
 * We use this to fetch buffer first then pass it to loadImage. This is because loadImage uses http/https
 * to fetch the image, which is slow. This is faster.
 *
 * @example
 * ```ts
 * const buffer = await fetchBuffer('https://example.com/image.png');
 * const image = await loadImage(buffer);
 * ```
 *
 * @param {string|Buffer|import('node:fs').PathLike} input The URL to fetch
 * @param {boolean} [allowFS=false] Whether to allow reading from the filesystem.
 * Defaults to false for security reasons.
 * @returns {Promise<?Buffer>} The buffer
 */
export const fetchBuffer = async (input: string, allowFS = false) => {
  if (!input) return null;
  if (Buffer.isBuffer(input)) return input;
  if (typeof input === 'string' && input.startsWith('http')) {
    const res = await request(input);
    const arrBuffer = await res.body.arrayBuffer();
    return Buffer.from(arrBuffer);
  }
  // TODO: for now only `/functions` folder is allowed as we read frame data from there.
  // In the future if needed, we should allow reading from any folder.
  return allowFS
    ? fs.readFile(
        typeof input === 'string'
          ? path.join(__dirname, '../../functions', input)
          : input,
      )
    : null;
};
