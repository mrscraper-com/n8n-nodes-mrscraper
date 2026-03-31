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
        name: 'message',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: showOnlyForAdvanceChatListingAgentPaginated,
        },
        description: 'The message to instruct the agent on what data to extract',
        routing: {
            send: {
                type: 'body',
                property: 'message',
            },
        },
    },
    {
        displayName: 'Proxy Country',
        name: 'proxyCountry',
        type: 'string',
        default: '',
        displayOptions: {
            show: showOnlyForAdvanceChatListingAgentPaginated,
        },
        description: 'Input the proxy country (e.g. us, uk, sg)',
        routing: {
            send: {
                type: 'body',
                property: 'proxyCountry',
                value: '={{ $value || undefined }}',
            },
        },
    },
    {
        displayName: 'Max Pages',
        name: 'maxPages',
        type: 'number',
        default: 1,
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
    }

];
