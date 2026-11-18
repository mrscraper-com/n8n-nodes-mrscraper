import type { INodeProperties, PostReceiveAction } from 'n8n-workflow';
import { scraperOptions } from './options';
import { prepareJsonRequest } from './json';

const resource = ['scraperApi'];
const pageOperations = ['scrapeHtml', 'scrapeMarkdown', 'getScreenshot', 'scrapeJson'];
const apiRequest = { baseURL: 'https://api.mrscraper.com', url: '/' };

const htmlOutput: PostReceiveAction = async function (_items, response) {
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
				description: 'Capture a screenshot of the full page or only the visible area at the top',
				routing: {
					request: {
						...apiRequest,
						method: 'GET',
						qs: { token: '={{$credentials.apiToken}}', browserRendering: true, html: true },
					},
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
						qs: { token: '={{$credentials.apiToken}}', html: true },
						json: false,
						encoding: 'text',
						headers: { Accept: 'text/html' },
					},
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
						method: 'POST',
						body: { agent: 'general' },
						qs: { token: '={{$credentials.apiToken}}' },
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
						qs: { token: '={{$credentials.apiToken}}', markdown: true, html: false },
						json: false,
						encoding: 'text',
						headers: { Accept: 'text/markdown' },
					},
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
		routing: { send: { type: 'body', property: 'url' } },
	},
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		typeOptions: { rows: 4 },
		default: 'Extract all available data as completely as possible.',
		required: true,
		placeholder: 'Extract the product name, price, and availability',
		displayOptions: { show: { resource, operation: ['scrapeJson'] } },
		description: 'Describe the data you want to extract from the page',
		routing: {
			send: {
				type: 'body',
				property: 'prompt',
			},
		},
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
		displayName: 'Screenshot Mode',
		name: 'screenshotMode',
		type: 'options',
		options: [
			{ name: 'Full', value: 'full', description: 'Capture the entire scrollable page' },
			{
				name: 'Top',
				value: 'top',
				description: 'Capture only the visible area at the top of the page',
			},
		],
		default: 'full',
		displayOptions: { show: { resource, operation: ['getScreenshot'] } },
		description: 'Area of the page to capture',
		routing: { send: { type: 'query', property: 'screenshot' } },
	},
	{
		displayName: 'Browser Rendering',
		name: 'browserRendering',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource, operation: ['scrapeHtml', 'scrapeMarkdown', 'scrapeJson'] },
		},
		description: 'Whether to render the page in a real browser so that JavaScript content loads',
		routing: { send: { type: 'query', property: 'browserRendering' } },
	},
	{
		displayName: 'Warm Start',
		name: 'warmStart',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource, operation: ['scrapeHtml', 'scrapeMarkdown', 'getScreenshot'] },
		},
		description: 'Whether to use a warm start for more reliable scraping',
		routing: { send: { type: 'query', property: 'warmStart' } },
	},
	{
		displayName: 'Super',
		name: 'super',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource, operation: pageOperations } },
		description: 'Whether to route the request through a real device for more reliable scraping',
		routing: { send: { type: 'query', property: 'super' } },
	},
	{
		displayName: 'Proxy Country',
		name: 'proxyCountry',
		type: 'string',
		default: 'us',
		placeholder: 'e.g. us',
		displayOptions: { show: { resource, operation: pageOperations } },
		description: 'Two-letter country code of the proxy server, such as us or gb',
		routing: { send: { type: 'query', property: 'proxyCountry' } },
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
];
