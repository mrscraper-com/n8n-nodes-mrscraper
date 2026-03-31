import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAdvanceChatListingAgentPaginated = {
    operation: ['listingAgentPaginated'],
    resource: ['scraping'],
};

export const advanceChatListingAgentPaginatedDescription: INodeProperties[] = [
    {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: showOnlyForAdvanceChatListingAgentPaginated,
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
        displayName: 'Prompt',
        name: 'prompt',
        type: 'string',
        default: 'Get all data for each property listing',
        required: true,
        displayOptions: {
            show: showOnlyForAdvanceChatListingAgentPaginated,
        },
        description: 'Instructions for what to extract from each listing page',
        routing: {
            send: {
                type: 'body',
                property: 'prompt',
            },
        },
    },
    {
        displayName: 'Agent',
        name: 'listingPaginatedAgent',
        type: 'hidden',
        default: 'listing',
        displayOptions: {
            show: showOnlyForAdvanceChatListingAgentPaginated,
        },
        routing: {
            send: {
                type: 'body',
                property: 'agent',
                value: 'listing',
            },
        },
    },
    {
        displayName: 'Max Pages',
        name: 'maxPages',
        type: 'number',
        default: 1,
        typeOptions: {
            minValue: 1,
        },
        displayOptions: {
            show: showOnlyForAdvanceChatListingAgentPaginated,
        },
        description: 'Maximum number of pages to scrape for listing agent scraper',
        routing: {
            send: {
                type: 'body',
                property: 'maxPages',
            },
        },
    },
];
