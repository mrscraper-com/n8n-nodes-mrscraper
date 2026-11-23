import type { IDataObject, INodeProperties, PostReceiveAction } from 'n8n-workflow';
import { scraperOptions } from './options';
import { prepareJsonRequest } from './json';
import { prepareBrandRequest, prepareHtmlRequest, validatePageRequest } from './validation';

const resource = ['scraperApi'];
const pageOperations = ['scrapeHtml', 'scrapeMarkdown', 'getScreenshot', 'scrapeJson'];
const loadingOperations = ['scrapeHtml', 'scrapeMarkdown', 'scrapeJson'];
const warmStartOperations = [...loadingOperations, 'scrapeBrand'];
// Scrape Brand offers only Geo Code and Timeout under Options.
const brandOptions = scraperOptions.filter((option) =>
	['geoCode', 'timeout'].includes(option.name),
);
const apiRequest = { baseURL: 'https://api.mrscraper.com', url: '/' };
// Documented defaults sent with every page request; an entry under Options overrides timeout and
// maxAge. Results are always saved, so saveResult is a fixed field.
const pageDefaults = { timeout: 300, saveResult: true, maxAge: 0 };
const loadingDefaults = { ...pageDefaults, blockResources: false };

// With a screenshot, Scrape HTML returns JSON with html and screenshot instead of HTML text.
const htmlOutput: PostReceiveAction = async function (_items, response) {
	const contentType = String(response.headers?.['content-type'] ?? '');
	if (contentType.includes('application/json') && typeof response.body === 'string') {
		return [{ json: JSON.parse(response.body) as IDataObject }];
	}
	return [{ json: { html: response.body } }];
};

const markdownOutput: PostReceiveAction = async function (_items, response) {
	return [{ json: { markdown: response.body } }];
};

export const scraperApiDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource } },
		options: [
			{
				name: 'Get Screenshot',
				value: 'getScreenshot',
				action: 'Get a screenshot',
				description: 'Capture a full-page screenshot of a web page',
				routing: {
					request: {
						...apiRequest,
						method: 'GET',
						qs: {
							screenshot: 'full',
							html: false,
							markdown: false,
							browserRendering: true,
							...pageDefaults,
						},
					},
					send: { preSend: [validatePageRequest] },
				},
			},
			{
				name: 'Scrape Brand',
				value: 'scrapeBrand',
				action: 'Scrape brand details',
				description:
					"Extract a website's brand identity, including colors, typography, logos, and social links",
				routing: {
					request: {
						...apiRequest,
						method: 'GET',
						qs: { action: 'brand-scraping', bundle: 'none' },
					},
					send: { preSend: [prepareBrandRequest] },
				},
			},
			{
				name: 'Scrape HTML',
				value: 'scrapeHtml',
				action: 'Scrape HTML',
				description: 'Retrieve the full HTML of a web page',
				routing: {
					request: {
						...apiRequest,
						method: 'GET',
						qs: { html: true, markdown: false, ...loadingDefaults },
						json: false,
						encoding: 'text',
						headers: { Accept: 'text/html' },
					},
					send: { preSend: [prepareHtmlRequest] },
					output: { postReceive: [htmlOutput] },
				},
			},
			{
				name: 'Scrape JSON',
				value: 'scrapeJson',
				action: 'Scrape JSON',
				description: 'Extract structured JSON data from a web page using a natural language prompt',
				routing: {
					request: {
						...apiRequest,
						method: 'GET',
						qs: { agent: 'general', html: true, screenshot: false, ...loadingDefaults },
					},
					send: { preSend: [prepareJsonRequest] },
				},
			},
			{
				name: 'Scrape Markdown',
				value: 'scrapeMarkdown',
				action: 'Scrape markdown',
				description: 'Convert a web page into clean, readable Markdown',
				routing: {
					request: {
						...apiRequest,
						method: 'GET',
						qs: { markdown: true, html: false, screenshot: false, ...loadingDefaults },
						json: false,
						encoding: 'text',
						headers: { Accept: 'text/markdown' },
					},
					send: { preSend: [validatePageRequest] },
					output: { postReceive: [markdownOutput] },
				},
			},
		],
		default: 'scrapeHtml',
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'https://example.com',
		displayOptions: {
			show: {
				resource,
				operation: ['scrapeHtml', 'scrapeMarkdown', 'getScreenshot', 'scrapeBrand'],
			},
		},
		description: 'Full URL of the page to scrape, including the https:// prefix',
		routing: { send: { type: 'query', property: 'url' } },
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'https://example.com',
		displayOptions: { show: { resource, operation: ['scrapeJson'] } },
		description: 'Full URL of the page to extract data from, including the https:// prefix',
		routing: { send: { type: 'query', property: 'url' } },
	},
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		typeOptions: { rows: 4 },
		default: 'Extract all data as complete as possible.',
		required: true,
		placeholder: 'Extract the product name, price, and availability',
		displayOptions: { show: { resource, operation: ['scrapeJson'] } },
		description: 'Describe the data you want to extract from the page',
	},
	{
		displayName: 'Expected Output Schema',
		name: 'outputSchema',
		type: 'json',
		typeOptions: { rows: 8 },
		default: '',
		placeholder: '{ "name": "string", "price": "number" }',
		displayOptions: { show: { resource, operation: ['scrapeJson'] } },
		description:
			'Optional JSON schema that describes the expected output. It is appended to the prompt to shape the result.',
	},
	{
		displayName: 'Screenshot',
		name: 'screenshot',
		type: 'options',
		options: [
			{
				name: 'Custom Viewport',
				value: 'custom',
				description: 'Capture a viewport of the size entered in Viewport',
			},
			{ name: 'Full Page', value: 'full', description: 'Capture the entire scrollable page' },
			{ name: 'None', value: false, description: 'Return only the HTML' },
			{ name: 'Top of Page', value: 'top', description: 'Capture only the first viewport' },
		],
		default: false,
		displayOptions: { show: { resource, operation: ['scrapeHtml'] } },
		description:
			'Screenshot to capture with the HTML. Any screenshot also sends browserRendering=true, overriding Browser Rendering, and returns JSON with html and screenshot.',
		routing: {
			send: {
				type: 'query',
				property: 'screenshot',
				value: '={{ $value === "custom" ? undefined : $value }}',
			},
		},
	},
	{
		displayName: 'Viewport',
		name: 'screenshotViewport',
		type: 'string',
		default: '',
		required: true,
		placeholder: '1280x800',
		displayOptions: { show: { resource, operation: ['scrapeHtml'], screenshot: ['custom'] } },
		description:
			'Viewport size as WIDTHxHEIGHT from 100 to 3840 pixels, with an optional -ZOOM percent from 25 to 300, such as 1280x800 or 1920x1080-75',
		routing: {
			send: { type: 'query', property: 'screenshot', value: '={{ String($value).trim() }}' },
		},
	},
	{
		displayName: 'Browser Rendering',
		name: 'browserRendering',
		type: 'options',
		options: [
			{
				name: 'Auto',
				value: 'auto',
				description:
					'Load the page without a browser first and switch to a browser if the request is blocked',
			},
			{ name: 'Disabled', value: false, description: 'Never load the page in a browser' },
			{
				name: 'Enabled',
				value: true,
				description: 'Always load the page in a browser, which JavaScript-heavy pages need',
			},
		],
		default: 'auto',
		displayOptions: { show: { resource, operation: loadingOperations } },
		description:
			'Whether to load the page in a real browser. In Scrape HTML, a screenshot always sends browserRendering=true.',
		routing: {
			send: {
				type: 'query',
				property: 'browserRendering',
				value: '={{ $value === "auto" ? undefined : $value }}',
			},
		},
	},
	{
		displayName: 'Warm Start',
		name: 'warmStart',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource, operation: warmStartOperations } },
		description:
			"Whether to open the site's home page first to warm the session before loading the page",
		routing: { send: { type: 'query', property: 'warmStart' } },
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource, operation: pageOperations } },
		options: scraperOptions,
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource, operation: ['scrapeBrand'] } },
		options: brandOptions,
	},
];
