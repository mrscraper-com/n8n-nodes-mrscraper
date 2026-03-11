import type { INodeProperties } from 'n8n-workflow';

const showOnlyForScrapingBulkManual = {
	operation: ['bulkManualScrape'],
	resource: ['scraping'],
};

export const scrapingBulkManualDescription: INodeProperties[] = [
	{
		displayName: 'Scraper ID',
		name: 'scraperId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForScrapingBulkManual,
		},
		description: 'ID of the manual scraper to rerun (from Create Scraper)',
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
			show: showOnlyForScrapingBulkManual,
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
