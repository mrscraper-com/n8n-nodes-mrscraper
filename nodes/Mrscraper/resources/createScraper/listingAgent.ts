import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAdvanceChatListingAgent = {
    operation: ['listingAgent'],
    resource: ['createScraper'],
};

export const advanceChatListingAgentDescription: INodeProperties[] = [
    {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: showOnlyForAdvanceChatListingAgent,
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
        displayName: 'Message',
        name: 'message',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: showOnlyForAdvanceChatListingAgent,
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
        default: 'us',
        displayOptions: {
            show: showOnlyForAdvanceChatListingAgent,
        },
        description: 'Choose the proxy country (e.g. us, uk, sg), adjust it to match the website\'s country domain',
        routing: {
            send: {
                type: 'body',
                property: 'proxyCountry',
            },
        },
    },
];
