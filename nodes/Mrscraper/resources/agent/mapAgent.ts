import type { INodeProperties } from 'n8n-workflow';

const showOnlyForMapAgent = {
    operation: ['mapAgent'],
    resource: ['agent'],
};

export const MapAgentDescription: INodeProperties[] = [
    {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: showOnlyForMapAgent,
        },
        description: 'The URL to be scraped',
        routing: {
            send: {
                type: 'body',
                property: 'url',
            },
        },
    },
    {
        displayName: 'Max Depth',
        name: 'maxDepth',
        type: 'number',
        default: 2,
        displayOptions: {
            show: showOnlyForMapAgent,
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
            show: showOnlyForMapAgent,
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
            show: showOnlyForMapAgent,
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
            show: showOnlyForMapAgent,
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
            show: showOnlyForMapAgent,
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
