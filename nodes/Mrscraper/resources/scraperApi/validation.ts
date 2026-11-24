import {
	NodeOperationError,
	type IDataObject,
	type IExecuteSingleFunctions,
	type PreSendAction,
} from 'n8n-workflow';

// Limits from the Scraper API reference.
const MAX_TIMEOUT_SECONDS = 330;
const MAX_CACHE_AGE_MS = 604800000;
const MAX_SELECTOR_LENGTH = 500;
const SCREENSHOT_VIEWPORT = /^(\d{3,4})x(\d{3,4})(?:-(\d{2,3}))?$/;

function fail(context: IExecuteSingleFunctions, message: string): never {
	throw new NodeOperationError(context.getNode(), message);
}

function checkInteger(
	context: IExecuteSingleFunctions,
	qs: IDataObject,
	name: string,
	label: string,
	minimum: number,
	maximum = Number.MAX_SAFE_INTEGER,
) {
	const value = qs[name];
	if (value === undefined) return;
	const number = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
	if (
		typeof number !== 'number' ||
		!Number.isInteger(number) ||
		number < minimum ||
		number > maximum
	) {
		fail(context, `${label} must be an integer from ${minimum} to ${maximum}`);
	}
	qs[name] = number;
}

function isScreenshotCapture(value: unknown): boolean {
	if (value === false || value === 'full' || value === 'top') return true;
	const match = typeof value === 'string' ? SCREENSHOT_VIEWPORT.exec(value) : null;
	if (!match) return false;
	const [width, height] = [Number(match[1]), Number(match[2])];
	const zoom = match[3] === undefined ? 100 : Number(match[3]);
	return (
		width >= 100 && width <= 3840 && height >= 100 && height <= 3840 && zoom >= 25 && zoom <= 300
	);
}

/**
 * Check the documented ranges and formats of a page request's query before it is sent.
 * Numeric strings from expressions are converted to numbers.
 */
export function validatePageQuery(this: IExecuteSingleFunctions, qs: IDataObject): IDataObject {
	checkInteger(this, qs, 'timeout', 'Timeout', 1, MAX_TIMEOUT_SECONDS);
	checkInteger(this, qs, 'maxAge', 'Max Age', 0, MAX_CACHE_AGE_MS);
	checkInteger(this, qs, 'maxRetries', 'Max Retries', 0);
	if (qs.geoCode !== undefined && !/^[a-z]{2}$/.test(String(qs.geoCode))) {
		fail(this, 'Geo Code must be a two-letter country code, such as us or gb');
	}
	if (
		typeof qs.waitForSelector === 'string' &&
		[...qs.waitForSelector].length > MAX_SELECTOR_LENGTH
	) {
		fail(this, `Wait for Selector must be at most ${MAX_SELECTOR_LENGTH} characters`);
	}
	if (typeof qs.screenshot === 'string' && !isScreenshotCapture(qs.screenshot)) {
		fail(
			this,
			'Viewport must be WIDTHxHEIGHT from 100 to 3840 pixels with an optional -ZOOM from 25 to 300, such as 1280x800 or 1920x1080-75',
		);
	}
	return qs;
}

export const validatePageRequest: PreSendAction = async function (requestOptions) {
	requestOptions.qs = validatePageQuery.call(this, { ...requestOptions.qs });
	return requestOptions;
};

// A Scrape HTML screenshot needs a rendered page, so it sends browserRendering=true whatever
// Browser Rendering is set to. Without a screenshot, Browser Rendering is sent as selected.
export const prepareHtmlRequest: PreSendAction = async function (requestOptions) {
	const qs = validatePageQuery.call(this, { ...requestOptions.qs });
	if (qs.screenshot !== undefined && qs.screenshot !== false) qs.browserRendering = true;
	requestOptions.qs = qs;
	return requestOptions;
};
