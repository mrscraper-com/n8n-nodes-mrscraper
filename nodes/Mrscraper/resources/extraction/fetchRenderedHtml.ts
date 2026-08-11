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
	{
		displayName: 'Screenshot',
		name: 'screenshot',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyForFetchHTML,
		},
		description: 'Whether to capture and return a screenshot',
	},
	{
		displayName: 'Screenshot Mode',
		name: 'screenshotMode',
		type: 'options',
		default: 'full',
		options: [
			{
				name: 'Full',
				value: 'full',
			},
			{
				name: 'Top',
				value: 'top',
			},
		],
		displayOptions: {
			show: {
				...showOnlyForFetchHTML,
				screenshot: [true],
			},
		},
		description: 'Whether to capture the full page or only the top of the page',
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
		default: false,
		displayOptions: {
			show: showOnlyForFetchHTML,
		},
		description: 'Whether to include Markdown converted from the rendered page in the response',
	},
	{
		displayName: 'Advanced Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: showOnlyForFetchHTML,
		},
		// Keep input fields above toggles to make the form easier to scan.
		// eslint-disable-next-line n8n-nodes-base/node-param-collection-type-unsorted-items
		options: [
			{
				displayName: 'Token Cap',
				name: 'tokenCap',
				type: 'number',
				default: 30,
				placeholder: 'e.g. 30',
				typeOptions: {
					minValue: 1,
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
				displayName: 'Wait for Selector',
				name: 'waitForSelector',
				type: 'string',
				default: '',
				placeholder: '#example-selector',
				description: 'Optional CSS selector to wait for before returning the page',
				routing: {
					send: {
						type: 'query',
						property: 'waitForSelector',
						value: '={{ $value || undefined }}',
					},
				},
			},
			{
				displayName: 'Wait Until',
				name: 'waitUntil',
				type: 'options',
				default: 'domcontentloaded',
				options: [
					{
						name: 'DOM Content Loaded',
						value: 'domcontentloaded',
					},
					{
						name: 'Load',
						value: 'load',
					},
					{
						name: 'Network Idle',
						value: 'networkidle',
					},
				],
				description: 'Browser lifecycle event to wait for before returning the page',
				routing: {
					send: {
						type: 'query',
						property: 'waitUntil',
					},
				},
			},
			{
				displayName: 'Block Resources',
				name: 'blockResources',
				type: 'boolean',
				default: true,
				description:
					'Whether to block images, fonts, and stylesheets from loading. Speeds up scraping and reduces bandwidth usage.',
				routing: {
					send: {
						type: 'query',
						property: 'blockResources',
						value: '={{ $value ? "true" : "false" }}',
					},
				},
			},
			{
				displayName: 'Browser Rendering',
				name: 'browserRendering',
				type: 'boolean',
				default: true,
				description: 'Whether to render the page in a browser so JavaScript content is loaded',
				routing: {
					send: {
						type: 'query',
						property: 'browserRendering',
						value: '={{ $value ? "true" : "false" }}',
					},
				},
			},
			{
				displayName: 'Home Page',
				name: 'homePage',
				type: 'boolean',
				default: false,
				description: 'Whether to navigate via the site home page first before the target URL',
				routing: {
					send: {
						type: 'body',
						property: 'homePage',
					},
				},
			},
			{
				displayName: 'Return Cookie',
				name: 'returnCookie',
				type: 'boolean',
				default: true,
				description: 'Whether to include browser cookies in the response',
				routing: {
					send: {
						type: 'query',
						property: 'returnCookie',
						value: '={{ $value ? "true" : "false" }}',
					},
				},
			},
			{
				displayName: 'Super',
				name: 'super',
				type: 'boolean',
				default: true,
				description: 'Whether to use a real device for websites that require stronger scraping capabilities',
				routing: {
					send: {
						type: 'query',
						property: 'super',
						value: '={{ $value ? "true" : "false" }}',
					},
				},
			},
		],
	},
];
