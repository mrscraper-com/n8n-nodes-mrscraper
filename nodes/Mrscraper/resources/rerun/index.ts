import type { INodeProperties } from 'n8n-workflow';

const showOnlyForScraperRuns = {
	resource: ['rerun'],
};

const showForSingleRun = {
	resource: ['rerun'],
	operation: ['runExisting'],
};

const showForBatchRun = {
	resource: ['rerun'],
	operation: ['runExistingBatch'],
};

const showForAnyRun = {
	resource: ['rerun'],
	operation: ['runExisting', 'runExistingBatch'],
};

export const rerunDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForScraperRuns,
		},
		options: [
			{
				name: 'Run Existing Scraper',
				value: 'runExisting',
				action: 'Run existing scraper',
				description: 'Run one URL with an existing AI or manual scraper',
				routing: {
					request: {
						method: 'POST',
						url: '={{ $parameter.scraperType === "manual" ? "/api/v1/scrapers-manual-rerun" : "/api/v1/scrapers-ai-rerun" }}',
					},
				},
			},
			{
				name: 'Run Existing Scraper in Batch',
				value: 'runExistingBatch',
				action: 'Run existing scraper in batch',
				description: 'Run multiple URLs with an existing AI or manual scraper',
				routing: {
					request: {
						method: 'POST',
						url: '={{ $parameter.scraperType === "manual" ? "/api/v1/scrapers-manual-rerun/bulk" : "/api/v1/scrapers-ai-rerun/bulk" }}',
					},
				},
			},
		],
		default: 'runExisting',
	},
	{
		displayName: 'Scraper Type',
		name: 'scraperType',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showForAnyRun,
		},
		options: [
			{
				name: 'AI',
				value: 'ai',
				description: 'Use a scraper created with an AI agent',
			},
			{
				name: 'Manual',
				value: 'manual',
				description: 'Use a scraper created with manual selectors',
			},
		],
		default: 'ai',
		description: 'Select the scraper type so the request is sent to the correct API endpoint',
	},
	{
		displayName: 'Scraper ID',
		name: 'scraperId',
		type: 'string',
		default: '',
		placeholder: 'e.g. cm123abc456',
		required: true,
		displayOptions: {
			show: showForAnyRun,
		},
		description: 'ID of the existing scraper, available from the scraper detail page',
		routing: {
			send: {
				type: 'body',
				property: 'scraperId',
			},
		},
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		placeholder: 'https://example.com/products/123',
		required: true,
		displayOptions: {
			show: showForSingleRun,
		},
		description: 'Full URL to process in this scraper run',
		routing: {
			send: {
				type: 'body',
				property: 'url',
			},
		},
	},
	{
		displayName: 'Max Retry',
		name: 'maxRetry',
		type: 'number',
		default: 3,
		typeOptions: {
			minValue: 0,
		},
		displayOptions: {
			show: showForSingleRun,
		},
		description: 'Maximum retry attempts if the run fails, for example 3',
		routing: {
			send: {
				type: 'body',
				property: 'maxRetry',
			},
		},
	},
	{
		displayName: 'URLs',
		name: 'urls',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		default: '',
		placeholder:
			'https://example.com/page-1, https://example.com/page-2\nor ["https://example.com/page-1", "https://example.com/page-2"]',
		required: true,
		displayOptions: {
			show: showForBatchRun,
		},
		description:
			'URLs as an array, a JSON array string, or a comma/newline-separated list. The value is normalized to an array before it is sent.',
		routing: {
			send: {
				type: 'body',
				property: 'urls',
				value:
					'={{ (Array.isArray($value) ? $value : (String($value).trim().startsWith("[") ? JSON.parse(String($value)) : String($value).split(/[,\\n]/))).map(url => String(url).trim()).filter(Boolean) }}',
			},
		},
	},
];
