import type { INodeProperties, PostReceiveAction } from 'n8n-workflow';
import { scraperOptions } from './options';
import { brandOutput, prepareBrandRequest } from './brand';
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
				description: 'Capture a full-page or viewport screenshot',
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
				action: 'Scrape a brand',
				description: 'Extract colors, typography, logos, social links, and brand metadata',
				routing: {
					request: {
						...apiRequest,
						method: 'POST',
						qs: { action: 'brand-scraping' },
						body: { url: '={{$parameter.brandMode === "scrape" ? $parameter.url : undefined}}' },
					},
					send: { preSend: [prepareBrandRequest] },
					output: { postReceive: [brandOutput] },
				},
			},
			{
				name: 'Scrape HTML',
				value: 'scrapeHtml',
				action: 'Scrape HTML',
				description: 'Retrieve the HTML of a web page',
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
				description: 'Extract structured JSON from one page using a prompt',
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
				description: 'Convert a web page to clean Markdown',
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
				operation: ['scrapeHtml', 'scrapeMarkdown', 'getScreenshot'],
			},
		},
		description: 'Full URL of the page to scrape, including https://',
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
		description: 'Full URL of the page to extract JSON from, including https://',
		routing: { send: { type: 'body', property: 'url' } },
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'https://example.com',
		displayOptions: { show: { resource, operation: ['scrapeBrand'], brandMode: ['scrape'] } },
		description: 'Full URL of the page whose brand you want to scrape, including https://',
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
		description: 'Describe the data to extract from the page content',
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
		description: 'Optional JSON schema appended to the prompt as a JSON Schema section',
	},
	{
		displayName: 'Screenshot Mode',
		name: 'screenshotMode',
		type: 'options',
		options: [
			{ name: 'Full', value: 'full' },
			{ name: 'Top', value: 'top' },
		],
		default: 'full',
		displayOptions: { show: { resource, operation: ['getScreenshot'] } },
		description: 'Capture the entire scroll height or the visible viewport at the top',
		routing: { send: { type: 'query', property: 'screenshot' } },
	},
	{
		displayName: 'Brand Action',
		name: 'brandMode',
		type: 'options',
		options: [
			{
				name: 'Scrape Brand',
				value: 'scrape',
				description: 'Scrape a page and return its brand and job ID',
			},
			{ name: 'Get Brand', value: 'get', description: 'Read an existing brand job by ID' },
			{
				name: 'Download File',
				value: 'download',
				description: 'Download a file from an existing brand job',
			},
		],
		default: 'scrape',
		displayOptions: { show: { resource, operation: ['scrapeBrand'] } },
		description: 'Scrape a new brand, read a saved brand, or download its files',
	},
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: { resource, operation: ['scrapeBrand'], brandMode: ['get', 'download'] },
		},
		description: 'Brand job ID returned in data.job_id when scraping a brand',
	},
	{
		displayName: 'File',
		name: 'brandOutput',
		type: 'options',
		options: [
			{ name: 'HTML', value: 'html' },
			{ name: 'ZIP Bundle', value: 'bundle' },
			{ name: 'Screenshot', value: 'screenshot' },
			{ name: 'Full Screenshot', value: 'screenshot_full' },
		],
		default: 'html',
		displayOptions: { show: { resource, operation: ['scrapeBrand'], brandMode: ['download'] } },
		description:
			'File to download into binary field data; bundles other than none include all files',
	},
	{
		displayName: 'Bundle',
		name: 'bundle',
		type: 'options',
		options: [
			{ name: 'None', value: 'none', description: 'Return brand JSON only' },
			{
				name: 'Clean',
				value: 'clean',
				description: 'Include HTML, screenshots, and a ZIP without scripts',
			},
			{
				name: 'Full',
				value: 'full',
				description: 'Include HTML, screenshots, and a ZIP with scripts',
			},
		],
		default: 'none',
		displayOptions: { show: { resource, operation: ['scrapeBrand'], brandMode: ['scrape'] } },
		description:
			'Page bundle to return with the brand data; clean and full can take about a minute',
		routing: { send: { type: 'query', property: 'bundle' } },
	},
	{
		displayName: 'Browser Rendering',
		name: 'browserRendering',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource, operation: ['scrapeHtml', 'scrapeMarkdown', 'scrapeJson'] },
		},
		description: 'Whether to render the page using Chromium for JavaScript content',
		routing: { send: { type: 'query', property: 'browserRendering' } },
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
