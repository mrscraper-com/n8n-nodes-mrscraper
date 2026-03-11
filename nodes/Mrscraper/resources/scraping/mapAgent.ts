import type { INodeProperties } from 'n8n-workflow';

const showOnlyForScrapingMapAgent = {
    operation: ['mapAgent'],
    resource: ['scraping'],
};

export const scrapingMapAgentDescription: INodeProperties[] = [
    {
        displayName: 'Scraper ID',
        name: 'scraperId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: showOnlyForScrapingMapAgent,
        },
        description: 'The ID of the scraper to rerun',
        routing: {
            send: {
                type: 'body',
                property: 'scraperId',
            },
        },
    }, {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: showOnlyForScrapingMapAgent,
        },
        description: 'URL for the scraper to rerun',
        routing: {
            send: {
                type: 'body',
                property: 'url',
            },
        },
    }, {
        displayName: 'Max Retry',
        name: 'maxRetry',
        type: 'number',
        default: 3,
        displayOptions: {
            show: showOnlyForScrapingMapAgent,
        },
        description: 'Maximum number of retries for the scraper',
        routing: {
            send: {
                type: 'body',
                property: 'maxRetry',
            },
        },
    }, {
        displayName: 'Max Depth',
        name: 'maxDepth',
        type: 'number',
        default: 2,
        displayOptions: {
            show: showOnlyForScrapingMapAgent,
        },
        description: 'Maximum depth of pages for the scraper to crawl for URL discovery',
        routing: {
            send: {
                type: 'body',
                property: 'maxDepth',
            },
        },
    }, {
        displayName: 'Max Pages',
        name: 'maxPages',
        type: 'number',
        default: 50,
        displayOptions: {
            show: showOnlyForScrapingMapAgent,
        },
        description: 'Maximum pages for the scraper to evaluate for URL discovery',
        routing: {
            send: {
                type: 'body',
                property: 'maxPages',
            },
        },
    }, {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: {
            minValue: 1,
        },
        default: 50,
        displayOptions: {
            show: showOnlyForScrapingMapAgent,
        },
        description: 'Max number of results to return',
        routing: {
            send: {
                type: 'body',
                property: 'limit',
            },
        },
    }, {
        displayName: 'Include Patterns',
        name: 'includePatterns',
        type: 'string',
        default: '',
        displayOptions: {
            show: showOnlyForScrapingMapAgent,
        },
        description: 'Include patterns (regex) for filtering URLs ("|" separated)',
        routing: {
            send: {
                type: 'body',
                property: 'includePatterns',
            },
        },
    }, {
        displayName: 'Exclude Patterns',
        name: 'excludePatterns',
        type: 'string',
        default: '',
        displayOptions: {
            show: showOnlyForScrapingMapAgent,
        },
        description: 'Exclude patterns (regex) for filtering URLs ("|" separated)',
        routing: {
            send: {
                type: 'body',
                property: 'excludePatterns',
            },
        },
    },
];
