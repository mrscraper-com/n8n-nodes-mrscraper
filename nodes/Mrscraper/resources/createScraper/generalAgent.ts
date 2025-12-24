import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAdvanceChatGeneralAgent = {
    operation: ['generalAgent'],
    resource: ['createScraper'],
};

export const advanceChatGeneralAgentDescription: INodeProperties[] = [
    {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
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
        displayName: 'Message',
        name: 'message',
        type: 'string',
        default: '',
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
        default: 'us',
        displayOptions: {
            show: showOnlyForAdvanceChatGeneralAgent,
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
