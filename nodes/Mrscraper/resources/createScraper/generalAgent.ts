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
        description: 'URL for the scraper',
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
        description: 'The message to send to the agent',
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
        description: 'The mode for the scraper',
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
        description: 'Proxy country',
        routing: {
            send: {
                type: 'body',
                property: 'proxyCountry',
            },
        },
    },
    {
        displayName: 'Is Screenshot',
        name: 'isScreenshot',
        type: 'boolean',
        default: false,
        displayOptions: {
            show: showOnlyForAdvanceChatGeneralAgent,
        },
        description: 'Whether to take screenshot',
        routing: {
            send: {
                type: 'body',
                property: 'isScreenshot',
            },
        },
    },
];
