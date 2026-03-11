import type { INodeProperties } from 'n8n-workflow';

const showOnlyForScrapingGeneralAgent = {
    operation: ['generalAgent'],
    resource: ['scraping'],
};

export const scrapingGeneralAgentDescription: INodeProperties[] = [
    {
        displayName: 'Scraper ID',
        name: 'scraperId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: showOnlyForScrapingGeneralAgent,
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
            show: showOnlyForScrapingGeneralAgent,
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
            show: showOnlyForScrapingGeneralAgent,
        },
        description: 'Maximum number of retries for the scraper',
        routing: {
            send: {
                type: 'body',
                property: 'maxRetry',
            },
        },
    },
];
