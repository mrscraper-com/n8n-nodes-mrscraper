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
        placeholder: 'Extract the product name, current price, availability, and main image URL',
        required: true,
        displayOptions: {
            show: showOnlyForAdvanceChatGeneralAgent,
        },
        description: 'The message to instruct the agent on what data to extract',
        routing: {
            send: {
                type: 'body',
                property: 'message',
                value:
                    '={{ $value + "\\n\\nReturn the output as JSON matching this schema:\\n" + JSON.stringify(typeof $parameter.outputSchema === "string" ? JSON.parse($parameter.outputSchema) : $parameter.outputSchema) }}',
            },
        },
    },
    {
        displayName: 'Expected Output Schema',
        name: 'outputSchema',
        type: 'json',
        typeOptions: {
            rows: 10,
        },
        default:
            '{\n  "type": "object",\n  "properties": {\n    "name": { "type": "string" },\n    "price": { "type": "number" },\n    "inStock": { "type": "boolean" }\n  },\n  "required": ["name", "price"]\n}',
        placeholder: '{"name":"string","price":"number","inStock":"boolean"}',
        required: true,
        displayOptions: {
            show: showOnlyForAdvanceChatGeneralAgent,
        },
        description:
            'Valid JSON describing the expected API output. It is stringified and appended to the prompt before the request is sent.',
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
        placeholder: 'e.g. US',
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
