import type { INodeProperties } from 'n8n-workflow';

const showOnlyForFetchHTML = {
	operation: ['fetchHTML'],
	resource: ['scraping'],
};

export const fetchRenderedHtmlDescription: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		placeholder: 'https://www.scrapethissite.com',
		required: true,
		displayOptions: {
			show: showOnlyForFetchHTML,
		},
		description: 'Target URL to fetch using the stealth browser',
		routing: {
			send: {
				type: 'body',
				property: 'url',
			},
		},
	},
	{
		displayName: 'Token Cap',
		name: 'tokenCap',
		type: 'number',
		default: 30,
		placeholder: 'e.g. 30',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: showOnlyForFetchHTML,
		},
		description: 'Maximum token allowance for processing the scraped content, for example 30',
		routing: {
			send: {
				type: 'body',
				property: 'tokenCap',
			},
		},
	},
	{
		displayName: 'Max Retries',
		name: 'maxRetries',
		type: 'number',
		default: 3,
		placeholder: 'e.g. 3',
		typeOptions: {
			minValue: 0,
		},
		displayOptions: {
			show: showOnlyForFetchHTML,
		},
		description: 'Maximum number of retry attempts when the request fails, for example 3',
		routing: {
			send: {
				type: 'body',
				property: 'maxRetries',
			},
		},
	},
	{
		displayName: 'Block Resources',
		name: 'blockResources',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: showOnlyForFetchHTML,
		},
		description:
			'Whether to block images, fonts, and stylesheets from loading. Speeds up scraping and reduces bandwidth usage.',
	},
	{
		displayName: 'Browser Rendering',
		name: 'browserRendering',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: showOnlyForFetchHTML,
		},
		description: 'Whether to render the page in a browser so JavaScript content is loaded',
	},
	{
		displayName: 'Wait Until',
		name: 'waitUntil',
		type: 'string',
		default: 'domcontentloaded',
		placeholder: 'e.g. domcontentloaded',
		displayOptions: {
			show: showOnlyForFetchHTML,
		},
		description: 'Browser lifecycle event to wait for before returning the page',
	},
	{
		displayName: 'Timeout',
		name: 'timeout',
		type: 'number',
		default: 300,
		placeholder: 'e.g. 300',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: showOnlyForFetchHTML,
		},
		description: 'Maximum number of seconds to wait for the page to load, for example 300',
	},
	{
		displayName: 'Geo Code',
		name: 'geoCode',
		type: 'string',
		default: 'us',
		placeholder: 'e.g. us',
		displayOptions: {
			show: showOnlyForFetchHTML,
		},
		description: 'Country code used for geolocation, for example us, gb, or sg',
	},
	{
		displayName: 'Return HTML',
		name: 'html',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: showOnlyForFetchHTML,
		},
		description: 'Whether to include the rendered HTML in the response',
	},
	{
		displayName: 'Return Markdown',
		name: 'markdown',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: showOnlyForFetchHTML,
		},
		description: 'Whether to include Markdown converted from the rendered page in the response',
	},
	{
		displayName: 'Screenshot',
		name: 'screenshot',
		type: 'string',
		default: 'full',
		placeholder: 'e.g. full',
		displayOptions: {
			show: showOnlyForFetchHTML,
		},
		description: 'Screenshot capture mode, for example full for the entire page',
	},
	{
		displayName: 'Super',
		name: 'super',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: showOnlyForFetchHTML,
		},
		description: 'Whether to use a real device for websites that require stronger scraping capabilities',
	},
	{
		displayName: 'Return Cookie',
		name: 'returnCookie',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: showOnlyForFetchHTML,
		},
		description: 'Whether to include browser cookies in the response',
	},
	{
		displayName: 'Proxy Country',
		name: 'proxyCountry',
		type: 'string',
		default: 'us',
		placeholder: 'e.g. us',
		displayOptions: {
			show: showOnlyForFetchHTML,
		},
		description: 'Country code for the proxy location, for example us, gb, or sg',
	},
];
