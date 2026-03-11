import type { INodeProperties } from 'n8n-workflow';

const showOnlyForScrapingBulkAI = {
	operation: ['bulkAIScrape'],
	resource: ['scraping'],
};

export const scrapingBulkAIScrapeDescription: INodeProperties[] = [
	{
		displayName: 'Scraper ID',
		name: 'scraperId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForScrapingBulkAI,
		},
		description: 'ID of the AI scraper to rerun (from Create Scraper)',
		routing: {
			send: {
				type: 'body',
				property: 'scraperId',
			},
		},
	},
	{
		displayName: 'URLs',
		name: 'urls',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		default: [],
		required: true,
		displayOptions: {
			show: showOnlyForScrapingBulkAI,
		},
		description: 'List of target URLs. All URLs are dispatched in parallel server-side.',
		routing: {
			send: {
				type: 'body',
				property: 'urls',
			},
		},
	},
];
