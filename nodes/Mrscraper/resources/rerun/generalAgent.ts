import type { INodeProperties } from 'n8n-workflow';

const showOnlyForRerunGeneralAgent = {
    operation: ['generalAgent'],
    resource: ['rerun'],
};

export const rerunGeneralAgentDescription: INodeProperties[] = [
    {
        displayName: 'Scraper ID',
        name: 'scraperId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: showOnlyForRerunGeneralAgent,
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
            show: showOnlyForRerunGeneralAgent,
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
            show: showOnlyForRerunGeneralAgent,
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
