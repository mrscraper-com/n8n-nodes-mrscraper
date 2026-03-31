import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBatchOperation = {
    resource: ['batchOperation'],
};

const showForBatchScrapeUrls = {
    resource: ['batchOperation'],
    operation: ['batchScrapeUrls'],
};

export const batchOperationDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForBatchOperation,
        },
        options: [
            {
                name: 'Batch Scrape URLs',
                value: 'batchScrapeUrls',
                action: 'Batch scrape urls',
                description:
                    'Run multiple URLs in one batch against a scraper you created in the app. Choose AI or manual scraper mode.',
                routing: {
                    request: {
                        method: 'POST',
                        url: '={{ $parameter.batchScrapeMode === "manual" ? "/api/v1/scrapers-manual-rerun/bulk" : "/api/v1/scrapers-ai-rerun/bulk" }}',
                    },
                },
            },
        ],
        default: 'batchScrapeUrls',
    },
    {
        displayName: 'Mode',
        name: 'batchScrapeMode',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showForBatchScrapeUrls,
        },
        options: [
            {
                name: 'AI',
                value: 'ai',
                description: 'Use an AI scraper created in the app',
            },
            {
                name: 'Manual',
                value: 'manual',
                description: 'Use a manual scraper created in the app',
            },
        ],
        default: 'ai',
        description: 'Whether to call the AI bulk endpoint or the manual bulk endpoint',
    },
    {
        displayName: 'Scraper ID',
        name: 'scraperId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: showForBatchScrapeUrls,
        },
        description: 'ID of the scraper to use (from Create Scraper in the app)',
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
            show: showForBatchScrapeUrls,
        },
        description:
            'List of target URLs. All URLs are dispatched in parallel server-side.',
        routing: {
            send: {
                type: 'body',
                property: 'urls',
            },
        },
    },
];
