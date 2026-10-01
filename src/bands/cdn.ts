/**
 * The p5 CDN tag, in one place.
 *
 * Both the live Band and the build-time render target load p5, and they must load the same build:
 * if they drifted, the Sketch tuned in the picker would not be the Sketch that rendered. The
 * integrity hash makes that worse to get wrong by hand — a stale copy fails closed and silently,
 * in whichever file was missed.
 *
 * To bump: change the version, then
 *   curl -sS <src> | openssl dgst -sha384 -binary | openssl base64 -A
 */
export const P5_SRC = 'https://cdn.jsdelivr.net/npm/p5@1.11.1/lib/p5.min.js';
export const P5_INTEGRITY =
	'sha384-mNoDMsj3qyJxOkfse1kNjhDVbbYTNnpuSEL68aRVPnNERG3lHoGH+4FHEQSHJhYV';
