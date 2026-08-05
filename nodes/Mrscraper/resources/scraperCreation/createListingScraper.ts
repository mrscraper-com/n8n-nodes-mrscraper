import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAdvanceChatListingAgent = {
    operation: ['listingAgent'],
    resource: ['createScraper'],
};

export const createListingScraperDescription: INodeProperties[] = [
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
        displayOptions: {
            show: showOnlyForAdvanceChatListingAgent,
        },
        description: 'The message to instruct the agent on what data to extract',
        routing: {
            send: {
                type: 'body',
                property: 'message',
                value:
                    '={{ [$value, $parameter.outputSchema ? "Return each item as JSON matching this schema:\\n" + JSON.stringify(typeof $parameter.outputSchema === "string" ? JSON.parse($parameter.outputSchema) : $parameter.outputSchema) : ""].filter(Boolean).join("\\n\\n") || undefined }}',
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
        default: '',
        placeholder: `{
  "title": "string",
  "price": "number",
  "url": "string",
  "imageUrl": "string"
}`,
        displayOptions: {
            show: showOnlyForAdvanceChatListingAgent,
        },
        description:
            'Optional JSON describing each expected listing item, for example {"title":"string","price":"number"}. It is stringified and appended to the prompt.',
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
            show: showOnlyForAdvanceChatListingAgent,
        },
        description: 'Maximum pagination pages to scrape, for example 5',
        routing: {
            send: {
                type: 'body',
                property: 'maxPages',
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
