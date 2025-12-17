import type { INodeProperties } from 'n8n-workflow';

const showOnlyForRerunListingAgent = {
    operation: ['listingAgent'],
    resource: ['rerun'],
};

export const rerunListingAgentDescription: INodeProperties[] = [
    {
        displayName: 'Scraper ID',
        name: 'scraperId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: showOnlyForRerunListingAgent,
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
            show: showOnlyForRerunListingAgent,
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
            show: showOnlyForRerunListingAgent,
        },
        description: 'Maximum number of retries for the scraper',
        routing: {
            send: {
                type: 'body',
                property: 'maxRetry',
            },
        },
    }, {
        displayName: 'Max Pages',
        name: 'maxPages',
        type: 'number',
        default: 5,
        displayOptions: {
            show: showOnlyForRerunListingAgent,
        },
        description: 'Maximum number of pages to scrape for listing agent scraper',
        routing: {
            send: {
                type: 'body',
                property: 'maxPages',
            },
        },
    }, {
        displayName: 'Timeout',
        name: 'timeout',
        type: 'number',
        default: 30,
        displayOptions: {
            show: showOnlyForRerunListingAgent,
        },
        description: 'Timeout in seconds for the listing agent scraper',
        routing: {
            send: {
                type: 'body',
                property: 'timeout',
            },
        },
    },
];
