import type { INodeProperties } from 'n8n-workflow';

const showOnlyForRerunMapAgent = {
    operation: ['mapAgent'],
    resource: ['rerun'],
};

export const rerunMapAgentDescription: INodeProperties[] = [
    {
        displayName: 'Scraper ID',
        name: 'scraperId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: showOnlyForRerunMapAgent,
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
            show: showOnlyForRerunMapAgent,
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
            show: showOnlyForRerunMapAgent,
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
            show: showOnlyForRerunMapAgent,
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
            show: showOnlyForRerunMapAgent,
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
            show: showOnlyForRerunMapAgent,
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
            show: showOnlyForRerunMapAgent,
        },
        description: 'Include patterns for filtering URLs ("|" separated)',
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
            show: showOnlyForRerunMapAgent,
        },
        description: 'Exclude patterns for filtering URLs ("|" separated)',
        routing: {
            send: {
                type: 'body',
                property: 'excludePatterns',
            },
        },
    },
];
