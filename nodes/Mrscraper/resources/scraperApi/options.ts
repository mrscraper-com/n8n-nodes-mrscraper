import type { INodeProperties } from 'n8n-workflow';

export const scraperOptions: INodeProperties[] = [
	{
		displayName: 'Block Resources',
		name: 'blockResources',
		type: 'boolean',
		default: false,
		displayOptions: { hide: { '/operation': ['getScreenshot'] } },
		description: 'Whether to skip loading images, fonts, and stylesheets to speed up scraping',
		routing: { send: { type: 'query', property: 'blockResources' } },
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
		displayOptions: { show: { '/operation': ['scrapeHtml', 'scrapeMarkdown', 'scrapeJson'] } },
		description: 'Whether to include a Base64-encoded screenshot with the result',
		routing: { send: { type: 'query', property: 'screenshot' } },
	},
	{
		displayName: 'Timeout',
		name: 'timeout',
		type: 'number',
		default: 300,
		typeOptions: { minValue: 1, maxValue: 330, numberPrecision: 0 },
		description: 'Maximum time to wait for the page to load, in seconds',
		routing: { send: { type: 'query', property: 'timeout' } },
	},

	{
		displayName: 'Wait for Selector',
		name: 'waitForSelector',
		type: 'string',
		default: '',
		placeholder: 'e.g. .product-list',
		description: 'CSS selector that must appear on the page before content is extracted',
		routing: {
			send: { type: 'query', property: 'waitForSelector', value: '={{ $value || undefined }}' },
		},
	},

	{
		displayName: 'Max Age',
		name: 'maxAge',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, maxValue: 604800000, numberPrecision: 0 },
		description: 'Maximum cached result age in milliseconds (up to seven days)',
		routing: { send: { type: 'query', property: 'maxAge' } },
	},
];
