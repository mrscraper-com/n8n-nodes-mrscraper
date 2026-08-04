import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAdvanceChatListingAgentPaginated = {
    operation: ['listingAgentPaginated'],
    resource: ['scraping'],
};

export const extractListingsAndPaginatedContentDescription: INodeProperties[] = [
    {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        placeholder: 'https://example.com/properties?page=1',
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
        typeOptions: {
            rows: 4,
        },
        default: '',
        placeholder: 'Extract each property name, price, location, detail URL, and image',
        displayOptions: {
            show: showOnlyForAdvanceChatListingAgentPaginated,
        },
        description: 'Instructions for what to extract from each listing page',
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
            show: showOnlyForAdvanceChatListingAgentPaginated,
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
            show: showOnlyForAdvanceChatListingAgentPaginated,
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
        placeholder: 'e.g. US',
        displayOptions: {
            show: showOnlyForAdvanceChatListingAgentPaginated,
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
