import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAdvanceChatGeneralAgent = {
    operation: ['generalAgent'],
    resource: ['scraping'],
};

export const advanceChatGeneralAgentDescription: INodeProperties[] = [
    {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        placeholder: 'https://example.com/products/123',
        required: true,
        displayOptions: {
            show: showOnlyForAdvanceChatGeneralAgent,
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
        typeOptions: {
            rows: 4,
        },
        default: '',
        placeholder: 'Extract the product name, price, availability, and image URL',
        required: true,
        displayOptions: {
            show: showOnlyForAdvanceChatGeneralAgent,
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
        displayName: 'Mode',
        name: 'mode',
        type: 'options',
        options: [
            {
                name: 'Super',
                value: 'Super',
            },
            {
                name: 'Cheap',
                value: 'Cheap',
            },
        ],
        default: 'Super',
        displayOptions: {
            show: showOnlyForAdvanceChatGeneralAgent,
        },
        description: 'Choose the scraping mode. Select "Cheap" if the website has weak security.',
        routing: {
            send: {
                type: 'body',
                property: 'mode',
            },
        },
    },
    {
        displayName: 'Proxy Country',
        name: 'proxyCountry',
        type: 'string',
        default: '',
        placeholder: 'e.g. ID',
        displayOptions: {
            show: showOnlyForAdvanceChatGeneralAgent,
        },
        description: 'ISO country code for the proxy, for example US, GB, ID, or SG',
        routing: {
            send: {
                type: 'body',
                property: 'proxyCountry',
                value: '={{ $value || undefined }}',
            },
        },
    },
];
