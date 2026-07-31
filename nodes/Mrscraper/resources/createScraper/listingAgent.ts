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
        placeholder: 'https://example.com/search?q=laptop',
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
        displayName: 'Prompt',
        name: 'message',
        type: 'string',
        typeOptions: {
            rows: 4,
        },
        default: '',
        placeholder: 'Extract every listing with its title, price, detail URL, and rating',
        required: true,
        displayOptions: {
            show: showOnlyForAdvanceChatListingAgent,
        },
        description: 'The message to instruct the agent on what data to extract',
        routing: {
            send: {
                type: 'body',
                property: 'message',
                value:
                    '={{ $value + "\\n\\nReturn each item as JSON matching this schema:\\n" + JSON.stringify(typeof $parameter.outputSchema === "string" ? JSON.parse($parameter.outputSchema) : $parameter.outputSchema) }}',
            },
        },
    },
    {
        displayName: 'Expected Item Schema',
        name: 'outputSchema',
        type: 'json',
        typeOptions: {
            rows: 10,
        },
        default:
            '{\n  "type": "object",\n  "properties": {\n    "title": { "type": "string" },\n    "price": { "type": "number" },\n    "url": { "type": "string" }\n  },\n  "required": ["title", "url"]\n}',
        placeholder: '{"title":"string","price":"number","url":"string"}',
        required: true,
        displayOptions: {
            show: showOnlyForAdvanceChatListingAgent,
        },
        description:
            'Valid JSON describing each expected listing item. It is stringified and appended to the prompt before the request is sent.',
    },
    {
        displayName: 'Proxy Country',
        name: 'proxyCountry',
        type: 'string',
        default: '',
        placeholder: 'e.g. ID',
        displayOptions: {
            show: showOnlyForAdvanceChatListingAgent,
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
