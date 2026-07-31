import type { INodeProperties } from 'n8n-workflow';
import structuredDataPrompts from './structuredDataPrompts.json';

const promptsJson = JSON.stringify(structuredDataPrompts);

const showOnlyForStructuredData = {
    operation: ['scrapeStructuredData'],
    resource: ['scraping'],
};

const messageRoutingValue = `={{ JSON.parse(${JSON.stringify(promptsJson)})[$parameter.structuredDataCategory] }}`;

export const scrapingStructuredDataDescription: INodeProperties[] = [
    {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        placeholder: 'https://example.com/articles/how-to-start',
        required: true,
        displayOptions: {
            show: showOnlyForStructuredData,
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
        displayName: 'Structured Data Category',
        name: 'structuredDataCategory',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForStructuredData,
        },
        options: [
            { name: 'Article', value: 'article' },
            { name: 'Forum Thread', value: 'forumThread' },
            { name: 'Hotel', value: 'hotel' },
            { name: 'Job Posting', value: 'jobPosting' },
            { name: 'Post', value: 'post' },
            { name: 'Product', value: 'product' },
            { name: 'Property', value: 'property' },
            { name: 'Restaurant', value: 'restaurant' },
            { name: 'Social Media Profile', value: 'socialMediaProfile' },
            { name: 'Tour / Attraction', value: 'tourAttraction' },
        ],
        default: 'article',
        description:
            'Preset extraction schema. The prompt sent to the API is chosen from this category.',
        routing: {
            send: {
                type: 'body',
                property: 'message',
                value: messageRoutingValue,
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
            show: showOnlyForStructuredData,
        },
        description:
            'Choose the scraping mode. Select "Cheap" if the website has weak security.',
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
        placeholder: 'e.g. SG',
        displayOptions: {
            show: showOnlyForStructuredData,
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
