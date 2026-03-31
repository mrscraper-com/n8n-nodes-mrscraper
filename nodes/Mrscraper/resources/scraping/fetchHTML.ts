import type { INodeProperties } from 'n8n-workflow';

const showOnlyForFetchHTML = {
	operation: ['fetchHTML'],
	resource: ['scraping'],
};

/**
 * Fetch HTML uses https://api.mrscraper.com (different base URL).
 * All query params (token, url, timeout, geoCode, blockResources) are built
 * in the operation routing URL via $parameter references.
 * No routing.send here — these are UI-only fields.
 */
export const webUnblockerFetchHTMLDescription: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForFetchHTML,
		},
		description: 'Target URL to fetch (e.g. https://example.com/page). Rendered via stealth browser.',
	},
	{
		displayName: 'Timeout',
		name: 'timeout',
		type: 'number',
		default: 120,
		displayOptions: {
			show: showOnlyForFetchHTML,
		},
		description: 'Maximum seconds to wait for the page to load',
	},
	{
		displayName: 'Geo Code',
		name: 'geoCode',
		type: 'string',
		default: 'US',
		displayOptions: {
			show: showOnlyForFetchHTML,
		},
		description: 'ISO country code for proxy-based geolocation (e.g. US, GB, ID, SG)',
	},
	{
		displayName: 'Block Resources',
		name: 'blockResources',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyForFetchHTML,
		},
		description: 'Whether to block images, CSS and fonts to speed up the request',
	},
];
