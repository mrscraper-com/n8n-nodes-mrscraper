import type { INodeProperties } from 'n8n-workflow';

// Each page operation already sends the documented default of Block Resources, Max Age, Return HTML,
// Screenshot, and Timeout; adding one of these options overrides that default. Results are always
// saved (saveResult=true) and no token cap is sent.
export const scraperOptions: INodeProperties[] = [
	{
		displayName: 'Action',
		name: 'action',
		type: 'string',
		default: '',
		placeholder: 'e.g. product-page',
		displayOptions: { show: { '/operation': ['scrapeHtml', 'scrapeMarkdown'] } },
		description:
			'Scraper action that routes the request or flags it, useful for separating analytics per domain. The action must exist for the target site.',
		routing: {
			send: {
				type: 'query',
				property: 'action',
				value: '={{ String($value).trim() || undefined }}',
			},
		},
	},
	{
		displayName: 'Block Resources',
		name: 'blockResources',
		type: 'boolean',
		default: false,
		displayOptions: { hide: { '/operation': ['getScreenshot'] } },
		description: 'Whether to block images, fonts, and stylesheets while the page loads',
		routing: { send: { type: 'query', property: 'blockResources' } },
	},
	{
		displayName: 'Geo Code',
		name: 'geoCode',
		type: 'string',
		default: '',
		placeholder: 'e.g. gb',
		description:
			'Two-letter code of the country to load the page from, such as us or gb. Leave this option out to load the page from the United States.',
		routing: {
			send: {
				type: 'query',
				property: 'geoCode',
				value: '={{ String($value).trim().toLowerCase() || undefined }}',
			},
		},
	},
	{
		displayName: 'Max Age',
		name: 'maxAge',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, maxValue: 604800000, numberPrecision: 0 },
		description:
			'Return a cached result of the same request when it is newer than this age, in milliseconds (up to 604800000, 7 days). A cached result costs the same tokens as the original scrape. 0 always scrapes fresh.',
		routing: { send: { type: 'query', property: 'maxAge' } },
	},
	{
		displayName: 'Max Retries',
		name: 'maxRetries',
		type: 'number',
		default: 3,
		typeOptions: { minValue: 0, numberPrecision: 0 },
		description: 'Maximum number of retry attempts. Remove this option to allow unlimited retries.',
		routing: { send: { type: 'query', property: 'maxRetries' } },
	},
	{
		displayName: 'Return HTML',
		name: 'html',
		type: 'boolean',
		default: true,
		displayOptions: { show: { '/operation': ['scrapeJson'] } },
		description: "Whether to include the page's raw HTML along with the extracted JSON",
		routing: { send: { type: 'query', property: 'html' } },
	},
	{
		displayName: 'Screenshot',
		name: 'screenshot',
		type: 'boolean',
		default: false,
		displayOptions: { show: { '/operation': ['scrapeJson'] } },
		description: 'Whether to include a Base64-encoded screenshot along with the extracted JSON',
		routing: { send: { type: 'query', property: 'screenshot' } },
	},
	{
		displayName: 'Timeout',
		name: 'timeout',
		type: 'number',
		default: 300,
		typeOptions: { minValue: 1, maxValue: 330, numberPrecision: 0 },
		description: 'Maximum time to wait for the scrape, in seconds, up to 330',
		routing: { send: { type: 'query', property: 'timeout' } },
	},
	{
		displayName: 'Wait for Selector',
		name: 'waitForSelector',
		type: 'string',
		default: '',
		placeholder: 'e.g. .product-list',
		description:
			'CSS selector or text that must appear on the page before it is returned, up to 500 characters. It needs a rendered page, so do not combine it with Browser Rendering set to Disabled.',
		routing: {
			send: {
				type: 'query',
				property: 'waitForSelector',
				value: '={{ String($value).trim() || undefined }}',
			},
		},
	},
];
